export default defineEventHandler(async (event) => {
  assertSameOrigin(event)
  await destroySession(event)
  return { ok: true }
})
