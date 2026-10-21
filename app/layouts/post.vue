<template>
  <div class="page-post">
    <Author size="small" />
    <template v-if="post">
      <header class="post-header">
        <time class="created-at" :datetime="post.date">{{ formattedDate }}</time>
        <h1 class="post-title">{{ post.title }}</h1>
      </header>
      <div class="markdown">
        <slot />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
/*
** Replaces the old nested `slug` layout: the header (author, date, title)
** lives here while the page renders the markdown body into the slot.
** Shares the `post-<slug>` payload key with pages/[slug].vue. The payload
** envelope covers both build-time (content) and user-authored posts.
*/
const route = useRoute()
const { params } = route

const { data } = await usePost(String(params.slug))
const post = computed(() => data.value?.post || null)

const formattedDate = computed(() => {
  if (!post.value?.date) { return '' }
  return new Date(post.value.date).toLocaleDateString()
})
</script>

<style scoped>
.page-post {
  margin-top: 5em;
}

.post-header {
  margin-top: 1.5em;
  text-align: center;
}

.post-title {
  margin-top: 0.75em;
  font-weight: 600;
}
</style>
