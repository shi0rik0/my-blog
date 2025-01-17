import {
  listPostDirs,
  getPostUrl,
  readPostMetadata,
  compileMarkdown,
} from './utils.js'

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import * as cheerio from 'cheerio'

type Post = {
  title: string
  date: string
  url: string
  content: string
  tags: string[]
}

const postDirs = await listPostDirs()
const posts = Promise.all(
  postDirs.map(async (dir) => {
    const article = compileMarkdown(
      await readFile(path.join(dir, 'article.md'), 'utf-8'),
    )
    const metadata = await readPostMetadata(dir)
    const $ = cheerio.load(article)
    const stringArr: string[] = []
    $().each((_, el) => {
      stringArr.push($(el).text())
    })
    return {
      title: metadata.title,
      date: metadata.created,
      url: getPostUrl(dir),
      content: stringArr.join(' '),
      tags: metadata.tags,
    }
  }),
)
console.log(posts)
