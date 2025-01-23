/**
 * Utilities for file system operations.
 */
import { promises as fs } from 'node:fs'
import nodePath from 'node:path'

/**
 * Writes data to a file. Will create parent directories if needed.
 *
 * @param path The path to the file.
 * @param data The data to write.
 */
export const writeFile = async (path: string, data: string) => {
  await fs.mkdir(nodePath.dirname(path), { recursive: true })
  await fs.writeFile(path, data)
}

/**
 * Reads the contents of a directory. Will return an empty array if `dir` isn't
 * a directory.
 */
export const readDir = async (dir: string) => {
  try {
    const stat = await fs.stat(dir)
    if (!stat.isDirectory()) {
      return []
    }
  } catch (e) {
    if (e instanceof Error && 'code' in e && e.code === 'ENOENT') {
      return []
    }
    throw e
  }
  return await fs.readdir(dir, { withFileTypes: true })
}
