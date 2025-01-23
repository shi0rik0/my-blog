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
