import chokidar from 'chokidar'
import { promises as fs } from 'fs'
import fsLegacy from 'node:fs'
import Mustache from 'mustache'
import path from 'node:path'
import markdownit from 'markdown-it'
import * as cheerio from 'cheerio'

const md = markdownit()

const token = 'kbPqITpmcOkbPqITpmcO'

const complieMarkdown = (markdown: string, baseDir: string) => {
  const html = md.render(markdown)
  const $ = cheerio.load(html)

  const images: { moduleName: string; path: string }[] = []
  $('img').each((i, el) => {
    const src = $(el).attr('src')
    if (src === undefined) {
      return
    }
    const moduleName = `img${i}`
    images.push({
      moduleName,
      path: path.join(baseDir, src).replace(/\\/g, '/'),
    })
    el.tagName = 'Image'
    $(el).attr('src', `${token}{${moduleName}}${token}`)
  })

  const newHtml = $('body')
    ?.html()
    ?.replace(new RegExp(`"${token}(.*?)${token}"`, 'g'), '$1')
  return { html: newHtml, images }
}

const postTemplate = await fs.readFile(
  'src/templates/post.astro.template',
  'utf8'
)

/**
 * For example, `{ moduleName: 'img1', path: 'src/foo.png' }` will be
 * translated to `import img1 from './foo.png'` in 'src/example.js'.
 */
type ImageImportInfo = {
  moduleName: string
  path: string
}

/**
 * Refer to 'src/templates/post.astro.template' for the template structure.
 */
type TemplateFields = {
  images: ImageImportInfo[]
  html: string
  metadata: string
}

const renderPostTemplate = (fields: TemplateFields) => {
  const f = {
    images: fields.images.map(({ moduleName, path }) => {
      return { moduleName, path: JSON.stringify(path) }
    }),
    html: fields.html,
    metadata: JSON.stringify(fields.metadata),
  }
  return Mustache.render(postTemplate, f)
}

/**
 * For example, if `dir` is "src/posts/foo", it will read "src/posts/foo/article.md"
 * and "src/posts/foo/metadata.toml" and generate the content of "src/pages/posts/foo.astro".
 *
 * @param dir The directory of the post content.
 * @returns The content of the post page.
 */
const generatePostPage = async (dir: string) => {
  const articleFile = path.join(dir, 'article.md')
  const metadataFile = path.join(dir, 'metadata.toml')
  const articleContent = await fs.readFile(articleFile, 'utf8')
  const metadataContent = await fs.readFile(metadataFile, 'utf8')
  const { html, images } = complieMarkdown(articleContent, dir)

  images.forEach((i) => {
    i.path = `../../../${i.path}`
  })

  const postAstro = renderPostTemplate({
    html: html ?? '',
    images,
    metadata: metadataContent,
  })

  return postAstro
}

const updatePost = async (dir: string) => {
  const articleFile = path.join(dir, 'article.md')
  const metadataFile = path.join(dir, 'metadata.toml')
  const postUrlSegment = path.basename(dir)
  const astroFile = `src/pages/posts/${postUrlSegment}.astro`
  if ([articleFile, metadataFile].some((f) => !fsLegacy.existsSync(f))) {
    try {
      await fs.unlink(astroFile)
    } catch {}
    console.log(`Deleted ${astroFile}`)
  } else {
    const postAstro = await generatePostPage(dir)
    await fs.writeFile(astroFile, postAstro)
    console.log(`Updated ${astroFile}`)
  }
}

const updateAllPosts = async () => {
  const files1 = await fs.readdir('src/posts', { withFileTypes: true })
  const posts1 = files1.filter((f) => f.isDirectory()).map((f) => f.name)
  const files2 = await fs.readdir('src/pages/posts', { withFileTypes: true })
  const posts2 = files2
    .filter((f) => f.isFile() && f.name.endsWith('.astro'))
    .map((f) => f.name.substring(0, f.name.length - 6))
  const posts = Array.from(new Set([...posts1, ...posts2]))
  await Promise.all(posts.map((i) => updatePost(path.join('src/posts', i))))
}

await updateAllPosts()

chokidar.watch('src/posts/').on('all', async (event, file) => {
  const dir = path.dirname(file).replace(/\\/g, '/')
  if (path.dirname(dir) === 'src/posts') {
    await updatePost(dir)
  }
})
