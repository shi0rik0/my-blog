import { mkdir, stat } from 'node:fs/promises'
import { exec, spawn } from 'node:child_process'
import util from 'node:util'
import nodePath from 'node:path'

const execAsync = util.promisify(exec)

/**
 * Create a directory if it does not exist.
 * Throws an error if the path exists but is not a directory.
 *
 * @param path The path to the directory.
 */
const ensureDir = async (path: string) => {
  try {
    const stats = await stat(path)
    if (!stats.isDirectory()) {
      throw new Error(`Path exists but is not a directory: ${path}`)
    }
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      await mkdir(path, { recursive: true })
    } else {
      throw error
    }
  }
}

const getGitStatus = async () => {
  const { stdout } = await execAsync('git status --porcelain')
  const lines = stdout.split('\n')
  const untracked = []
  const modified = []
  for (const line of lines) {
    const status = line.slice(0, 2)
    const path = line.slice(3)
    if (status === '??') {
      untracked.push(path)
    } else if (status === ' M') {
      modified.push(path)
    }
  }
  return { untracked, modified }
}

let { untracked, modified } = await getGitStatus()
untracked = untracked.filter((path) => nodePath.dirname(path) === 'src/posts')
modified = Array.from(
  new Set(
    modified
      .filter(
        (path) => nodePath.dirname(nodePath.dirname(path)) === 'src/posts',
      )
      .map((path) => nodePath.dirname(path)),
  ),
)

await execAsync(['git', 'add', ...untracked, ...modified].join(' '))
await execAsync('git commit -m "update posts"')

console.log('Posts updated:')
for (const path of [...untracked, ...modified]) {
  console.log(`  - ${path}`)
}
