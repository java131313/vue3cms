<template>
  <div class="auth-page">
    <h1>Log in</h1>

    <form class="auth-form" @submit.prevent="onSubmit">
      <label>
        Email
        <input v-model="email" type="email" name="email" required autocomplete="email">
      </label>
      <label>
        Password
        <input v-model="password" type="password" name="password" required autocomplete="current-password">
      </label>

      <p v-if="error" class="error">{{ error }}</p>

      <button type="submit" :disabled="pending">{{ pending ? 'Logging in…' : 'Log in' }}</button>
    </form>

    <p class="switch">
      No account yet? <NuxtLink to="/register">Register</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Log in' })

const route = useRoute()
const { login } = useAuth()

const email = ref('')
const password = ref('')
const error = ref('')
const pending = ref(false)

async function onSubmit () {
  error.value = ''
  pending.value = true
  try {
    await login({ email: email.value, password: password.value })
    await navigateTo(typeof route.query.redirect === 'string' ? route.query.redirect : '/')
  } catch (err: any) {
    error.value = err?.data?.statusMessage || 'Login failed, please try again'
  } finally {
    pending.value = false
  }
}
</script>

<style scoped>
.auth-page {
  max-width: 400px;
  margin: 5em auto 0;
  text-align: center;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25em;
  margin-top: 2em;
  text-align: left;
}

.auth-form label {
  display: flex;
  flex-direction: column;
  gap: 0.4em;
  color: var(--grey);
}

.auth-form input {
  padding: 0.6em 0.75em;
  font-size: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.auth-form button {
  padding: 0.7em;
  font-size: 1rem;
  color: #fff;
  background: var(--blue);
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.auth-form button:disabled {
  opacity: 0.6;
  cursor: default;
}

.error {
  color: var(--red);
}

.switch {
  margin-top: 2em;
  color: var(--grey-light);
}
</style>
