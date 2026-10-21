# Vue Static CMS

Static Markdown blogging with **Vue 3 + Nuxt 4**, rewritten from the original Nuxt 2 version (forked from [andreliem/vuecms](https://github.com/andreliem/vuecms)).

Use this setup to create a simple blogging system for your personal website.

## Features

- Markdown blogging powered by [@nuxt/content](https://content.nuxt.com)
- Locally stored posts in `content/posts/`, frontmatter holds title/date/description
- File name = URL slug, e.g. `content/posts/hello-static-blogging.md` → `/hello-static-blogging`
- User accounts: email registration (activated immediately), login/logout with httpOnly session cookies (PBKDF2-hashed passwords, D1-backed sessions)
- User posts: registered users can create, edit and delete markdown posts at runtime (stored in D1, rendered with `<MDC>`); they appear on the home page next to the static posts and live at the same `/<slug>` URLs
- Two layouts (home page and blog posts) + author header component
- Disqus integration (`your_disqus_short_name` placeholder in `app/app.config.ts`)
- Shiki code highlighting, syntax highlighted code blocks out of the box
- Pure CSS (no Bootstrap), CSS custom properties for the colour palette
- Deploys as an SSR app on Cloudflare Workers (`cloudflare_module` preset) with D1

## Getting started

```bash
# install dependencies
npm install

# set up the local D1 database (first time only)
npx wrangler d1 migrations apply vue3cms-content --local

# serve locally with hot reload (Cloudflare bindings via nitro-cloudflare-dev)
npm run dev

# build for production (SSR worker)
npm run build

# deploy to Cloudflare
npm run deploy
```

## Deployment (Cloudflare Workers)

The site deploys as a Nuxt SSR app on Cloudflare Workers (`cloudflare_module`
preset). `@nuxt/content` reads posts from a D1 database at runtime and
self-seeds it from the build-time dump on the first request after each deploy.

```bash
npm run deploy   # nuxt build && wrangler deploy
```

Prerequisites:

- `npx wrangler login`
- A D1 database bound as `DB` in `wrangler.toml`
  (created with `npx wrangler d1 create vue3cms-content`)
- The `users` / `user_sessions` / `user_posts` tables:
  `npx wrangler d1 migrations apply vue3cms-content --remote`

Config layout: `nuxt.config.ts` sets the Nitro preset and app code;
`wrangler.toml` at the project root provides the deployment name, compatibility
date and the D1 binding — Nitro merges it into the generated
`.output/server/wrangler.json` during build.

Live site: https://vue3cms.java13131305626.workers.dev

## User accounts and posts

- Register at `/register` — the account is active immediately and you are
  logged in straight away.
- Log in/out via the nav bar; sessions are httpOnly cookies stored in D1.
- Manage your posts at `/my/posts` (new / edit / delete). Posts are markdown,
  get a unique slug derived from the title, and render on `/<slug>` with the
  same layout as static posts.

Server-side API calls use `useRequestFetch()` — a Worker cannot
loopback-fetch its own `*.workers.dev` URL (Cloudflare rejects it with
"error code: 1042"), so SSR invokes the Nitro handlers in-process instead.

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
  pages/         index.vue (post list), [slug].vue (post page),
                 login.vue / register.vue, my/posts/* (post management)
  layouts/       default.vue (nav bar), post.vue (author header wrapper)
  components/    Author.vue, DisqusComments.vue, PostForm.vue
  composables/   usePosts.ts (merged static + user posts), useAuth.ts
  middleware/    auth.ts (guards the my/ area)
  assets/css/    main.css (global styles)
server/
  api/auth/      register / login / logout / me
  api/posts/     public user-post reads
  api/my/posts/  authenticated create / update / delete
  utils/         D1 access, PBKDF2 hashing + sessions, post helpers
migrations/      D1 schema (users, user_sessions, user_posts)
content/posts/   markdown posts
content.config.ts  @nuxt/content collection schema
public/          favicon etc.
```

## License

[MIT](http://opensource.org/licenses/MIT)
