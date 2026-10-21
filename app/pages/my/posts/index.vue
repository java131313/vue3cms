<template>
  <div class="my-posts">
    <header class="page-header">
      <h1>My posts</h1>
      <NuxtLink class="new-post" to="/my/posts/new">+ New post</NuxtLink>
    </header>

    <p v-if="error" class="error">{{ error }} <NuxtLink to="/login">Log in</NuxtLink></p>

    <p v-else-if="!posts.length" class="empty">
      You haven't written any posts yet.
      <NuxtLink to="/my/posts/new">Write your first post</NuxtLink>.
    </p>

    <table v-else class="post-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Date</th>
          <th class="actions">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="post in posts" :key="post.id">
          <td>
            <NuxtLink :to="`/${post.slug}`">{{ post.title }}</NuxtLink>
          </td>
          <td>{{ formatDate(post.date) }}</td>
          <td class="actions">
            <NuxtLink :to="`/my/posts/${post.id}/edit`">Edit</NuxtLink>
            <button type="button" class="delete" :disabled="deleting === post.id" @click="onDelete(post)">
              {{ deleting === post.id ? 'Deleting…' : 'Delete' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

useHead({ title: 'My posts' })

const { data, error } = await useFetch<{ posts: any[] }>('/api/my/posts')
const posts = computed(() => data.value?.posts || [])

const deleting = ref('')

async function onDelete (post: any) {
  if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) { return }
  deleting.value = post.id
  try {
    await $fetch(`/api/my/posts/${post.id}`, { method: 'DELETE' })
    data.value = { posts: posts.value.filter(p => p.id !== post.id) }
  } finally {
    deleting.value = ''
  }
}

function formatDate (date: string) {
  return new Date(date).toLocaleDateString()
}
</script>

<style scoped>
.my-posts {
  max-width: var(--content-width);
  margin: 5em auto 0;
  padding: 0 1em;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.new-post {
  padding: 0.5em 1em;
  color: #fff;
  background: var(--green);
  border-radius: 4px;
}

.empty {
  margin-top: 3em;
  color: var(--grey-light);
  text-align: center;
}

.error {
  margin-top: 3em;
  color: var(--red);
  text-align: center;
}

.post-table {
  width: 100%;
  margin-top: 2em;
  border-collapse: collapse;
}

.post-table th,
.post-table td {
  padding: 0.75em 0.5em;
  text-align: left;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.post-table th {
  color: var(--grey-light);
  font-weight: normal;
  font-size: 0.85em;
  text-transform: uppercase;
}

.actions {
  white-space: nowrap;
  text-align: right !important;
}

.actions > * + * {
  margin-left: 1em;
}

.delete {
  padding: 0;
  color: var(--red);
  background: none;
  border: none;
  cursor: pointer;
}

.delete:disabled {
  opacity: 0.5;
  cursor: default;
}
</style>
