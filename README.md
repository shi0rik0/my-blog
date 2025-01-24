# My Personal Blog

This is the repository for my personal blog. It is built by [Astro](https://astro.build/) and hosted on [GitHub Pages](https://pages.github.com/).

## Features

- **Static**: This blog is completely static.
- **Math Formula**: This blog uses [KaTeX](https://katex.org/) to render math formulas.

## Architecture

One simple way to set up a blog is to use the [Content API](https://docs.astro.build/en/guides/content-collections/) of Astro, but it's not flexible enough for me, so I wrote a module called `Shark` to generate the blog pages from post files.

The pipeline of the blog generation is as follows:

1. Shark transforms the post files in `src/posts/` into .astro files and related resource files.
2. Astro transforms the .astro files into website files.

## Format

Each post is a directory in `src/posts/`. The directory name is part of the URL of the post. For example, the post in `src/posts/hello-world/` will be available at `https://your-domain/hello-world`.

Each post consists of the following files:

- `article.md`: The content of the post in Markdown format.
- `metadata.toml`: The metadata of the post.

Metadata contains the following fields:

- `title`: The title of the post.
- `created`: The creation date of the post.
- `updated`: The last update date of the post.
- `tags`: The tags of the post.

## Build

To build the blog, run the following command:

```bash
npm run shark-build && npm run build
```

The generated files will be in the `dist/` directory.

## Hot Reload

To start the development server with hot reload, run the following commands in two terminals:

```bash
npm run shark-watch
```

and,

```bash
npm run dev
```
