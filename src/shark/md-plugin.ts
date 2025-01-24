/**
 * A markdown-it plugin tailored for this blog.
 */

import katex from 'katex'
import type MarkdownIt from 'markdown-it'
import type { RenderRule } from 'markdown-it/lib/renderer.mjs'

const HTML_ESCAPE_REPLACE_RE = /[&<>"{}]/g
const HTML_REPLACEMENTS = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '{': '&#123;',
  '}': '&#125;',
}

const escapeHtml = (text: string) => {
  return text.replace(HTML_ESCAPE_REPLACE_RE, (ch) => {
    if (ch in HTML_REPLACEMENTS) {
      return HTML_REPLACEMENTS[ch as keyof typeof HTML_REPLACEMENTS]
    } else {
      throw new Error(`Unknown HTML escape: ${ch}`)
    }
  })
}

const parseMath = (text: string) => {
  const regex = /(\$[^$]+\$)|([^$]+)/g
  const result = []

  let match
  while ((match = regex.exec(text)) !== null) {
    if (match[1]) {
      result.push({ math: true, text: match[1].slice(1, -1) })
    } else if (match[2]) {
      result.push({ math: false, text: match[2] })
    }
  }

  return result
}

export const markdownItPlugin = (md: MarkdownIt) => {
  // escape special characters
  const rule1: RenderRule = (tokens, idx, options, env, self) => {
    const text = tokens[idx].content
    return escapeHtml(text)
  }

  // on the base of rule1, render math expressions
  const rule2: RenderRule = (tokens, idx, options, env, self) => {
    const text = tokens[idx].content
    const parts = parseMath(text)
    return parts
      .map((part) => {
        if (part.math) {
          return katex.renderToString(part.text)
        } else {
          return escapeHtml(part.text)
        }
      })
      .join('')
  }

  md.renderer.rules.text = rule2
  md.renderer.rules.fence = rule1
  md.renderer.rules.code_inline = rule1

  // replace standard <img> tags with Astro's <Image> components
  const defaultImageRule = md.renderer.rules.image ?? (() => '')
  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    tokens[idx].tag = 'Image'
    return defaultImageRule(tokens, idx, options, env, self)
  }
}
