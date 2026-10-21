/*
** D1 access. In production the binding comes from the Cloudflare runtime;
** in `nuxt dev` the nitro-cloudflare-dev module serves the same bindings
** (including D1) from .wrangler/state, so this works in both environments.
*/
export function getDb (event: any) {
  const db = event.context?.cloudflare?.env?.DB
  if (!db) {
    throw createError({
      statusCode: 500,
      statusMessage: 'D1 database binding "DB" is missing. Run via `npm run dev` (nitro-cloudflare-dev) or deploy to Cloudflare.'
    })
  }
  return db as any
}

export function now () {
  return Date.now()
}
