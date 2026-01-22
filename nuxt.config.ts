// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  modules: ["@nuxt/icon", "@nuxtjs/google-fonts"],
  devtools: { enabled: true },
  css: ["~/assets/main.css", "~/assets/flexboxgrid.css", "~/assets/spinner.css"],
  runtimeConfig: {
    public: {
      apiBase: process.env.baseUrl ?? "http://localhost:8080",
    },
  },
   app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;600&display=swap',
        },
                {
          rel: "stylesheet",
          href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css",
        },
      ],
    },
  },
});
