import { updatePost, updateAllPosts } from './utils.js'

import chokidar from 'chokidar'

import path from 'node:path'

await updateAllPosts()

chokidar.watch('src/posts/').on('all', async (event, file) => {
  const dir = path.dirname(file).replace(/\\/g, '/')
  if (path.dirname(dir) === 'src/posts') {
    await updatePost(dir)
  }
})
