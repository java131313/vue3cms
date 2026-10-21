<template>
  <div class="post-body">
    <template v-if="post">
      <header class="post-header">
        <time class="created-at" :datetime="post.date">{{ formattedDate }}</time>
        <h1 class="post-title">{{ post.title }}</h1>
      </header>

      <div class="markdown">
        <!-- markdown files baked at build time by @nuxt/content -->
        <ContentRenderer v-if="source === 'content'" :value="post" />
        <!-- user-authored posts stored in D1, rendered at runtime -->
        <MDC v-else :value="post.body" />
      </div>

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
** Blog post page (rendered inside the `post` layout). Handles both post
** types in one route:
**   - markdown files baked at build time by @nuxt/content → ContentRenderer
**   - user-authored posts stored in D1 at runtime → MDC
** Throws a 404 when neither source has the slug.
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

// fatal: true is required for SSR to actually respond with the 404 status
if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}

const formattedDate = computed(() => {
  if (!post.value?.date) { return '' }
  return new Date(post.value.date).toLocaleDateString()
})

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
.post-header {
  margin-top: 1.5em;
  text-align: center;
}

.post-title {
  margin-top: 0.75em;
  font-weight: 600;
}

/* Code blocks rendered by @nuxt/content / MDC */
.post-body pre {
  background-color: #f5f5f5;
  padding: 2em;
  overflow-x: auto;
}
</style>
