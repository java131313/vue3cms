<template>
  <div class="post-body">
    <ContentRenderer v-if="post" :value="post" />
    <DisqusComments
      v-if="post"
      :key="disqusIdentifier"
      :shortname="appConfig.disqusShortname"
      :identifier="disqusIdentifier"
      :url="postUrl"
    />
  </div>
</template>

<script setup lang="ts">
/*
** Blog post page, rendered inside the `post` layout (author header,
** date and title). The markdown body comes from @nuxt/content via
** <ContentRenderer>, replacing the old webpack `require()` of .md files.
*/
definePageMeta({
  layout: 'post'
})

const route = useRoute()
const appConfig = useAppConfig()

const slug = String(route.params.slug)
const { data: post } = await usePost(slug)

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found' })
}

useHead({
  title: post.value.title,
  meta: [
    { name: 'description', content: post.value.description || post.value.title }
  ]
})

// env prefix avoids re-using the same Disqus thread between dev and production
const disqusIdentifier = `${import.meta.dev ? 'development' : 'production'}-${appConfig.disqusShortname}-${slug}`
const postUrl = `${useRequestURL().origin}${route.fullPath}`
</script>

<style>
/* Code blocks rendered by @nuxt/content */
.post-body pre {
  background-color: #f5f5f5;
  padding: 2em;
  overflow-x: auto;
}
</style>
