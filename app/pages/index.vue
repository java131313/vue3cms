<template>
  <div class="page-index">
    <Author size="large" />

    <hr class="divider">

    <section class="recent-posts">
      <article v-for="post in posts" :key="post.slug" class="post">
        <time class="created-at" :datetime="post.date">{{ formatDate(post.date) }}</time>
        <h2 class="post-title">
          <NuxtLink :to="`/${post.slug}`">{{ post.title }}</NuxtLink>
        </h2>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
const { data: posts } = await usePostsList()

useHead({
  title: 'First Last',
  meta: [
    { name: 'description', content: 'meta content seo goodness' }
  ]
})

function formatDate (date: string) {
  return new Date(date).toLocaleDateString()
}
</script>

<style scoped>
.page-index {
  margin-top: 5em;
  text-align: center;
}

.divider {
  width: 83%;
  margin: 3em auto;
  border: none;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.recent-posts .post {
  margin-bottom: 3em;
}

.recent-posts .post-title {
  font-weight: 300;
}

.recent-posts .post-title a {
  font-size: 1.5em;
  color: var(--grey);
}

.recent-posts .post-title a:hover {
  text-decoration: underline;
}

.created-at {
  font-style: italic;
  color: var(--grey-light);
}
</style>
