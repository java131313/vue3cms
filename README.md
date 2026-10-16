# Vue Static CMS

Static Markdown blogging with **Vue 3 + Nuxt 4**, rewritten from the original Nuxt 2 version (forked from [andreliem/vuecms](https://github.com/andreliem/vuecms)).

Use this setup to create a simple blogging system for your personal website.

## Features

- Markdown blogging powered by [@nuxt/content](https://content.nuxt.com)
- Locally stored posts in `content/posts/`, frontmatter holds title/date/description
- File name = URL slug, e.g. `content/posts/hello-static-blogging.md` → `/hello-static-blogging`
- Two layouts (home page and blog posts) + author header component
- Disqus integration (`your_disqus_short_name` placeholder in `app/app.config.ts`)
- Shiki code highlighting, syntax highlighted code blocks out of the box
- Pure CSS (no Bootstrap), CSS custom properties for the colour palette
- Static generation with automatic route discovery (`nuxt generate`)

## Getting started

```bash
# install dependencies
npm install

# serve locally with hot reload
npm run dev

# build for production (SSR server)
npm run build
npm run start

# generate static site into .output/public
npm run generate
```

## Writing posts

Create a new file in `content/posts/` named after your slug:

```markdown
---
title: My New Post
date: '2026-10-16'
description: A short description used as the meta description
---

Your markdown here...
```

Posts are listed newest-first on the home page automatically.

## Customizing

- Site title, subtitle, avatar, links: `app/app.config.ts`
- Colours and global styles: `app/assets/css/main.css` (CSS custom properties in `:root`)
- Disqus shortname: `app/app.config.ts`

## Structure

```
app/
  pages/         index.vue (post list), [slug].vue (post page)
  layouts/       default.vue, post.vue (header around the post body)
  components/    Author.vue, DisqusComments.vue
  composables/   usePosts.ts (queryCollection wrappers)
  assets/css/    main.css (global styles)
content/posts/   markdown posts
content.config.ts  @nuxt/content collection schema
public/          favicon etc.
```

## License

[MIT](http://opensource.org/licenses/MIT)
