<template>
  <div class="auth-page">
    <h1>Register</h1>

    <form class="auth-form" @submit.prevent="onSubmit">
      <label>
        Name <span class="optional">(optional)</span>
        <input v-model="name" type="text" name="name" autocomplete="name">
      </label>
      <label>
        Email
        <input v-model="email" type="email" name="email" required autocomplete="email">
      </label>
      <label>
        Password <span class="optional">(min 8 characters)</span>
        <input v-model="password" type="password" name="password" required minlength="8" autocomplete="new-password">
      </label>

      <p v-if="error" class="error">{{ error }}</p>

      <button type="submit" :disabled="pending">{{ pending ? 'Registering…' : 'Register' }}</button>
    </form>

    <p class="switch">
      Already registered? <NuxtLink to="/login">Log in</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Register' })

const { register } = useAuth()

const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const pending = ref(false)

async function onSubmit () {
  error.value = ''
  pending.value = true
  try {
    await register({ email: email.value, password: password.value, name: name.value })
    await navigateTo('/')
  } catch (err: any) {
    error.value = err?.data?.statusMessage || 'Registration failed, please try again'
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

.auth-form .optional {
  color: var(--grey-light);
  font-size: 0.85em;
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
  background: var(--green);
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
