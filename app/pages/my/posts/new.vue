<template>
  <div class="editor-page">
    <h1>New post</h1>
    <PostForm @saved="onSaved" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

useHead({ title: 'New post' })

async function onSaved (post: any) {
  await navigateTo(`/${post.slug}`)
}
</script>

<style scoped>
.editor-page {
  max-width: var(--content-width);
  margin: 5em auto 0;
  padding: 0 1em;
}
</style>
