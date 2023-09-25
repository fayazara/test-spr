// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "nuxt-icon"],
  colorMode: {
    preference: "light",
  },
  runtimeConfig: {
    baseUrl:
      process.env.NUXT_PUBLIC_VERCEL_ENV === "production"
        ? "https://test-spr-alpha.vercel.app/"
        : process.env.NUXT_PUBLIC_VERCEL_ENV === "preview"
        ? `https://${process.env.NUXT_PUBLIC_VERCEL_URL}/`
        : `${process.env.NGROK_URL}`,
    replicateApiToken: process.env.REPLICATE_API_TOKEN,
    replicateWebhookSecret: process.env.REPLICATE_WEBHOOK_SECRET,
    mongoDbURI: process.env.MONGO_URL,
    s3AccessKeyId: process.env.S3_ACCESS_KEY_ID,
    s3SecretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    s3BucketUrl: process.env.S3_BUCKET_URL,
  },
});
