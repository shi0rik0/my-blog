import { readdir, readFile } from 'node:fs/promises'
import { statSync } from 'node:fs'
import path from 'node:path'
import { z } from 'zod'
import TOML from '@iarna/toml'
import markdownit from 'markdown-it'

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
  const schema = z.object({
    title: z.string(),
    created: z.date(),
    updated: z.date(),
    tags: z.array(z.string()),
  })
  return schema.parse(metadata)
}

const md = markdownit()

/**
 * Compile markdown source to HTML.
 *
 * @param markdown
 * @returns
 */
export const compileMarkdown = (markdown: string) => {
  return md.render(markdown)
}
