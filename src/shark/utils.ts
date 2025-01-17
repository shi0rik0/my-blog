import { readdir, readFile } from 'node:fs/promises'
import { statSync } from 'node:fs'
import path from 'node:path'
import { z } from 'zod'
import TOML from '@iarna/toml'
import markdownit from 'markdown-it'
import * as cheerio from 'cheerio'

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

const md = markdownit()

/**
 * Compile markdown source to HTML.
 *
 * @param markdown The markdown source.
 * @returns The compiled HTML.
 */
export const compileMarkdown = (markdown: string): string => {
  const html = md.render(markdown)
  const $ = cheerio.load(html)
  $('code').each((_, el) => {
    // Set the Astro `is:raw` attribute to properly handle the braces.
    $(el).prop('is:raw', 'is:raw')
  })
  return $('body').html() ?? ''
}
