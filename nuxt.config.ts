export default defineNuxtConfig({
  /*
  ** Headers of the page
  */
  app: {
    pageTransition: true,
    head: {
      title: 'Vue Static CMS',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Static Markdown blogging with Vue 3 + Nuxt' }
      ]
    }
  },
  /*
  ** Modules
  */
  modules: [
    '@nuxt/content'
  ],
  /*
  ** Markdown rendering + code highlighting
  */
  content: {
    build: {
      markdown: {
        highlight: {
          theme: 'github-light'
        }
      }
    }
  },
  /*
  ** Global CSS
  */
  css: [
    '~/assets/css/main.css'
  ],
  /*
  ** Prerender all post routes at generate time
  */
  nitro: {
    prerender: {
      crawlLinks: true
    }
  }
})
