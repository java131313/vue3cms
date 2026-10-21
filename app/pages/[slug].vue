<template>
  <div class="post-body">
    <template v-if="post">
      <!-- markdown files baked at build time by @nuxt/content -->
      <ContentRenderer v-if="source === 'content'" :value="post" />
      <!-- user-authored posts stored in D1, rendered at runtime -->
      <MDC v-else :value="post.body" />

      <DisqusComments
        :key="disqusIdentifier"
        :shortname="appConfig.disqusShortname"
        :identifier="disqusIdentifier"
        :url="postUrl"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
/*
** Blog post page, rendered inside the `post` layout (author header,
** date and title). Markdown files render through <ContentRenderer>;
** user-authored posts (source === 'user') render through <MDC>.
*/
definePageMeta({
  layout: 'post'
})

const route = useRoute()
const appConfig = useAppConfig()

const slug = String(route.params.slug)
const { data } = await usePost(slug)

const post = computed(() => data.value?.post || null)
const source = computed(() => data.value?.source || null)

if (!post.value) {
  console.error('[slug-debug] slug=', slug, 'data=', JSON.stringify(data.value)?.slice(0, 300))
  // fatal: true is required for SSR to actually respond with the 404 status
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}

useHead({
  title: post.value.title,
  meta: [
    { name: 'description', content: post.value.description || post.value.title }
  ]
})

// env prefix avoids re-using the same Disqus thread between dev and production
const disqusIdentifier = `${import.meta.dev ? 'development' : 'production'}-${source.value}-${appConfig.disqusShortname}-${slug}`
const postUrl = `${useRequestURL().origin}${route.fullPath}`
</script>

<style>
/* Code blocks rendered by @nuxt/content / MDC */
.post-body pre {
  background-color: #f5f5f5;
  padding: 2em;
  overflow-x: auto;
}
</style>
