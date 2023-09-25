const runtimeConfig = useRuntimeConfig();

export default defineEventHandler((event) => {
  return runtimeConfig;
});
