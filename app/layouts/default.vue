<template>
  <div>
    <nav class="site-nav">
      <NuxtLink to="/" class="brand">{{ appConfig.siteTitle }}</NuxtLink>
      <div class="nav-links">
        <template v-if="user">
          <span class="who">{{ user.name || user.email }}</span>
          <NuxtLink to="/my/posts">My posts</NuxtLink>
          <NuxtLink to="/my/posts/new" class="cta">+ New post</NuxtLink>
          <button type="button" @click="logout">Log out</button>
        </template>
        <template v-else>
          <NuxtLink to="/login">Log in</NuxtLink>
          <NuxtLink to="/register" class="cta">Register</NuxtLink>
        </template>
      </div>
    </nav>
    <slot />
  </div>
</template>

<script setup lang="ts">
const appConfig = useAppConfig()
const { user, logout } = useAuth()
</script>

<style scoped>
.site-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75em 1.5em;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.brand {
  font-weight: 600;
  color: var(--default-color);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.25em;
}

.who {
  color: var(--grey-light);
  font-size: 0.9em;
}

.cta {
  padding: 0.35em 0.9em;
  color: #fff;
  background: var(--green);
  border-radius: 4px;
}

.site-nav button {
  padding: 0;
  color: var(--grey);
  background: none;
  border: none;
  cursor: pointer;
}

.site-nav button:hover {
  color: var(--red);
}
</style>
