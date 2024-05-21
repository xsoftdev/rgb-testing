export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt', "@nuxt/image"],
  shadcn: {
    componentDir: './components/ui'
  },
  runtimeConfig: {
    privateRuntimeConfig: {
      mongodb_url: process.env.MONGO_URI,
      secret_key: process.env.SECRET_KEY,
      cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
      cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET
    }
  },
  nitro: {
    plugins: ["~/server/index.ts"],
  },
})