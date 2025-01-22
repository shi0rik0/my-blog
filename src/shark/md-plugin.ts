/**
 * A markdown-it plugin tailored for this blog.
 */

import type MarkdownIt from 'markdown-it'

export const markdownItPlugin = (md: MarkdownIt) => {
  // replace braces to HTML entities
  const textRules = ['text', 'fence', 'code_inline']
  const defaultTextRules = textRules.map(
    (rule) => md.renderer.rules[rule] ?? (() => ''),
  )
  for (let i = 0; i < textRules.length; i++) {
    const rule = textRules[i]
    md.renderer.rules[rule] = (tokens, idx, options, env, self) => {
      const text = defaultTextRules[i](tokens, idx, options, env, self)
      return text.replace(/{/g, '&#123;').replace(/}/g, '&#125;')
    }
  }
  md.renderer.rules.code_block = (tokens, idx, options, env, self) => {
    console.log(tokens[idx].content)
    return '123'
  }

  // replace standard <img> tag with Astro's <Image> component
  const defaultImageRule = md.renderer.rules.image ?? (() => '')
  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    tokens[idx].tag = 'Image'
    return defaultImageRule(tokens, idx, options, env, self)
  }

  // TODO: add support for math formulas
}
