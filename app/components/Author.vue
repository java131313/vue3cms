<template>
  <div class="author" :class="size">
    <img class="avatar" :src="appConfig.authorAvatar" alt="Author avatar">
    <h1 class="site-title" :class="{ 'spaced': isLarge }">
      <NuxtLink to="/">{{ appConfig.siteTitle }}</NuxtLink>
    </h1>
    <h2 class="site-subtitle" :class="{ 'spaced': isLarge }">{{ appConfig.siteSubtitle }}</h2>
    <p v-if="isLarge" class="custom-links">
      <template v-for="(link, index) in appConfig.customLinks" :key="link.url">
        <a :href="link.url">{{ link.label }}</a><span v-if="index < appConfig.customLinks.length - 1"> - </span>
      </template>
    </p>
    <div v-if="isLarge" class="social">
      <a
        v-for="link in appConfig.socialLinks"
        :key="link.network"
        class="social-item"
        :href="link.url"
        :aria-label="link.network"
      >
        <svg v-if="link.network === 'twitter'" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <svg v-else-if="link.network === 'linkedin'" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125M7.119 20.452H3.555V9h3.564zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0" />
        </svg>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
const appConfig = useAppConfig()

const props = defineProps<{
  size: 'small' | 'large'
}>()

const isLarge = computed(() => props.size === 'large')
</script>

<style scoped>
.author {
  text-align: center;
}

.avatar {
  width: 25%;
  border-radius: 500px;
  border: 5px solid #ddd;
}

@media (min-width: 992px) {
  .avatar {
    width: 10%;
  }
}

.spaced {
  margin-top: 0.75em;
}

.custom-links {
  margin-top: 1.5em;
}

.social {
  display: flex;
  justify-content: center;
  margin-top: 0.5em;
  color: var(--blue);
  font-size: 2em;
}

.social-item {
  margin: 0 0.5em;
}

/* Compact variant shown at the top of blog posts */
.small .site-title {
  font-size: 2.5em;
  margin-bottom: 0.5em;
}

.small .site-subtitle {
  font-size: 1.5em;
  margin-bottom: 0.5em;
}
</style>
