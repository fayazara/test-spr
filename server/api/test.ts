const runtimeConfig = useRuntimeConfig();

export default defineEventHandler((event) => {
  return {
    url: process.env.NUXT_PUBLIC_VERCEL_ENV,
  };
});
