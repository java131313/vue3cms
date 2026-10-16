<template>
  <div id="disqus_thread" class="disqus-comments" />
</template>

<script setup lang="ts">
/*
** Minimal Vue 3 replacement for the old `vue-disqus` package (Vue 2 only).
** Implements the universal DISQUS embed: loads embed.js once, then uses
** DISQUS.reset() when the identifier changes. The parent re-mounts this
** component via :key, so reset() handles in-place slug changes too.
*/
const props = defineProps<{
  shortname: string
  identifier: string
  url: string
}>()

onMounted(() => {
  const win = window as any

  win.disqus_config = function (this: any) {
    this.page.url = props.url
    this.page.identifier = props.identifier
  }

  if (!document.getElementById('dsq-embed-script')) {
    const script = document.createElement('script')
    script.id = 'dsq-embed-script'
    script.src = `https://${props.shortname}.disqus.com/embed.js`
    script.setAttribute('data-timestamp', String(Date.now()))
    script.async = true
    document.body.appendChild(script)
  } else if (win.DISQUS) {
    win.DISQUS.reset({
      reload: true,
      config: function (this: any) {
        this.page.url = props.url
        this.page.identifier = props.identifier
      }
    })
  }
})
</script>

<style scoped>
.disqus-comments {
  margin-top: 3em;
}
</style>
