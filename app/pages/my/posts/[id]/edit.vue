<template>
  <div class="editor-page">
    <h1>Edit post</h1>
    <p v-if="error" class="error">{{ error }} <NuxtLink to="/my/posts">Back to my posts</NuxtLink></p>
    <PostForm v-else-if="post" :post="post" @saved="onSaved" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const route = useRoute()

const { data, error } = await useFetch<{ posts: any[] }>('/api/my/posts')
const post = computed(() => data.value?.posts.find(p => p.id === route.params.id) || null)

if (!error.value) {
  useHead({ title: `Edit: ${post.value?.title || 'post'}` })
  if (!post.value) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
  }
}

async function onSaved (saved: any) {
  await navigateTo(`/${saved.slug}`)
}
</script>

<style scoped>
.editor-page {
  max-width: var(--content-width);
  margin: 5em auto 0;
  padding: 0 1em;
}

.error {
  margin-top: 2em;
  color: var(--red);
}
</style>
