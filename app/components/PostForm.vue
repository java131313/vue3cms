<template>
  <form class="post-form" @submit.prevent="onSubmit">
    <label>
      Title
      <input v-model="title" type="text" name="title" required maxlength="200">
    </label>

    <label>
      Description <span class="optional">(optional)</span>
      <input v-model="description" type="text" name="description" maxlength="300">
    </label>

    <label>
      Body (Markdown)
      <textarea v-model="body" name="body" rows="16" required />
    </label>

    <p v-if="error" class="error">{{ error }}</p>

    <div class="actions">
      <button type="submit" :disabled="pending">{{ pending ? 'Saving…' : (post ? 'Save changes' : 'Publish post') }}</button>
    </div>
  </form>
</template>

<script setup lang="ts">
const props = defineProps<{
  post?: { id: string, title: string, description: string, body: string } | null
}>()

const emit = defineEmits<{ saved: [post: any] }>()

const title = ref(props.post?.title || '')
const description = ref(props.post?.description || '')
const body = ref(props.post?.body || '')
const error = ref('')
const pending = ref(false)

async function onSubmit () {
  error.value = ''
  pending.value = true
  try {
    const payload = { title: title.value, description: description.value, body: body.value }
    const res = props.post
      ? await $fetch<{ post: any }>(`/api/my/posts/${props.post.id}`, { method: 'PUT', body: payload })
      : await $fetch<{ post: any }>('/api/my/posts', { method: 'POST', body: payload })
    emit('saved', res.post)
  } catch (err: any) {
    error.value = err?.data?.statusMessage || 'Save failed, please try again'
  } finally {
    pending.value = false
  }
}
</script>

<style scoped>
.post-form {
  display: flex;
  flex-direction: column;
  gap: 1.25em;
  margin-top: 2em;
  text-align: left;
}

.post-form label {
  display: flex;
  flex-direction: column;
  gap: 0.4em;
  color: var(--grey);
}

.post-form .optional {
  color: var(--grey-light);
  font-size: 0.85em;
}

.post-form input,
.post-form textarea {
  padding: 0.6em 0.75em;
  font-size: 1rem;
  font-family: inherit;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.post-form textarea {
  resize: vertical;
  line-height: 1.5;
}

.error {
  color: var(--red);
}

.actions {
  text-align: right;
}

.actions button {
  padding: 0.7em 2em;
  font-size: 1rem;
  color: #fff;
  background: var(--green);
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.actions button:disabled {
  opacity: 0.6;
  cursor: default;
}
</style>
