<template>
  <div class="page-post">
    <Author size="small" />
    <!--
      The page fetches the post and renders the header + body itself.
      The layout stays a dumb wrapper so a missing post reaches the
      page's 404 handling (a v-if here would drop the page entirely).
    -->
    <slot />
  </div>
</template>

<style scoped>
.page-post {
  margin-top: 5em;
}
</style>
