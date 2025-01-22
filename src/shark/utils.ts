import { readdir, readFile, writeFile, unlink } from 'node:fs/promises'
import { statSync, existsSync } from 'node:fs'
import path from 'node:path'
import { z } from 'zod'
import TOML from '@iarna/toml'
import MarkdownIt from 'markdown-it'
import { markdownItPlugin } from './md-plugin.js'
import Mustache from 'mustache'

const isFile = (path: string) => {
  return statSync(path, { throwIfNoEntry: false })?.isFile() ?? false
}

const isValidPost = (dir: string) => {
  return ['article.md', 'metadata.toml'].every((f) => isFile(path.join(dir, f)))
}

const postDir = 'src/posts'

/**
 * List all post directories.
 *
 * For example, if the structure under `src/posts` is:
 * ```
 * .
 * ├── post1
 * │   ├── article.md
 * │   └── metadata.toml
 * └── post2
 *     └── foo.txt
 * ```
 *
 * Then the return value will be `['src/posts/post1']`.
 *
 * @returns All post directories.
 */
export const listPostDirs = async () => {
  const dirs = await readdir(postDir, { withFileTypes: true })
  return dirs
    .filter((d) => d.isDirectory())
    .map((d) => path.join(postDir, d.name))
    .filter(isValidPost)
}

export const getPostUrl = (dir: string) => {
  return `/posts/${path.basename(dir)}`
}

/**
 * Read post metadata safely.
 *
 * @param dir
 * @returns
 */
export const readPostMetadata = async (dir: string) => {
  const metadata = TOML.parse(
    await readFile(path.join(dir, 'metadata.toml'), 'utf-8'),
  )
  if (metadata.tags === undefined) {
    metadata.tags = []
  }
  const schema = z.object({
    title: z.string(),
    created: z.string().date(),
    updated: z.string().date(),
    tags: z.array(z.string()),
  })
  const parsed = schema.parse(metadata)
  return parsed
}

const md = new MarkdownIt().use(markdownItPlugin)

/**
 * Compile markdown source to HTML.
 *
 * @param markdown The markdown source.
 * @returns The compiled HTML.
 */
export const compileMarkdown = (markdown: string): string => {
  return md.render(markdown)
}

const compileMarkdown2 = (markdown: string, baseDir: string) => {
  const html = compileMarkdown(markdown)

  const images: { moduleName: string; path: string }[] = []

  const newHtml = html.replace(/<Image src="([^"]*?)"/g, (_, p1) => {
    const moduleName = `img${images.length}`
    images.push({
      moduleName,
      path: `${baseDir}/${p1}`,
    })
    return `<Image src={${moduleName}}`
  })
  return { html: newHtml, images }
}

const postTemplate = await readFile('src/templates/post.astro.template', 'utf8')

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
const generatePostPage = async (dir: string): Promise<string> => {
  const articleFile = path.join(dir, 'article.md')
  const metadataFile = path.join(dir, 'metadata.toml')
  const articleContent = await readFile(articleFile, 'utf8')
  const metadataContent = await readFile(metadataFile, 'utf8')
  const { html, images } = compileMarkdown2(articleContent, dir)

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

export const updatePost = async (dir: string) => {
  const articleFile = path.join(dir, 'article.md')
  const metadataFile = path.join(dir, 'metadata.toml')
  const postUrlSegment = path.basename(dir)
  const astroFile = `src/pages/posts/${postUrlSegment}.astro`
  if ([articleFile, metadataFile].some((f) => !existsSync(f))) {
    try {
      await unlink(astroFile)
    } catch {}
    console.log(`Deleted ${astroFile}`)
  } else {
    const postAstro = await generatePostPage(dir)
    await writeFile(astroFile, postAstro)
    console.log(`Updated ${astroFile}`)
  }
}

export const updateAllPosts = async () => {
  const files1 = await readdir('src/posts', { withFileTypes: true })
  const posts1 = files1.filter((f) => f.isDirectory()).map((f) => f.name)
  const files2 = await readdir('src/pages/posts', { withFileTypes: true })
  const posts2 = files2
    .filter((f) => f.isFile() && f.name.endsWith('.astro'))
    .map((f) => f.name.substring(0, f.name.length - 6))
    .filter((f) => f !== 'index')
  const posts = Array.from(new Set([...posts1, ...posts2]))
  await Promise.all(posts.map((i) => updatePost(path.join('src/posts', i))))
}
