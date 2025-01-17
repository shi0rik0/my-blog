/**
 * This script generates two files:
 *
 * 1. src/assets/posts.json
 *   This contains the metadata of all posts. It's only used on server-side to
 *   generate the post list pages and so on. It won't be exposed to the client.
 *
 * 2. public/data/posts.json
 *   This contains the data for the post search feature. It can be fetched by
 *   the client.
 */

import {
  listPostDirs,
  getPostUrl,
  readPostMetadata,
  compileMarkdown,
} from './utils.js'

import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import * as cheerio from 'cheerio'

/**
 * Cleanses the post content by removing all HTML tags to prevent them from
 * intervening with the search process.
 *
 * @param html The HTML content of the post.
 * @returns The cleansed content.
 */
const cleansePostContent = (html: string) => {
  const $ = cheerio.load(html)
  const stringArr: string[] = []
  $('body').each((_, el) => {
    stringArr.push($(el).text())
  })
  return stringArr.join(' ')
}

const mapPosts = async <T>(
  callback: (dir: string) => Promise<T>,
): Promise<T[]> => {
  const postDirs = await listPostDirs()
  return await Promise.all(postDirs.map(callback))
}

const generateSrcAssetsPostsJson = async () => {
  const obj = await mapPosts(async (dir) => {
    const metadata = await readPostMetadata(dir)
    return {
      title: metadata.title,
      date: metadata.created,
      url: getPostUrl(dir),
      tags: metadata.tags,
    }
  })
  obj.sort((a, b) => {
    // First sort by date in descending order
    const dateComparison =
      new Date(b.date).getTime() - new Date(a.date).getTime()
    if (dateComparison !== 0) {
      return dateComparison
    }
    // If the dates are the same, sort by URL in ascending order
    return a.url.localeCompare(b.url)
  })
  return JSON.stringify(obj)
}

const generatePublicDataPostsJson = async () => {
  const obj = await mapPosts(async (dir) => {
    const article = compileMarkdown(
      await readFile(path.join(dir, 'article.md'), 'utf-8'),
    )
    const metadata = await readPostMetadata(dir)

    return {
      title: metadata.title,
      date: metadata.created,
      url: getPostUrl(dir),
      content: cleansePostContent(article),
      tags: metadata.tags,
    }
  })
  return JSON.stringify(obj)
}

const srcAssetsPostsJson = await generateSrcAssetsPostsJson()
await writeFile('src/assets/posts.json', srcAssetsPostsJson)
const publicPostsJson = await generatePublicDataPostsJson()
await writeFile('public/data/posts.json', publicPostsJson)
