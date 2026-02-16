// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  nitro: {
    preset: "static",
  },
  compatibilityDate: "2025-07-15",
  modules: ["@nuxt/icon", "@nuxtjs/google-fonts"],
  icon: {
    serverBundle: false,
  },
  googleFonts: {
    families: {
      Roboto: [400, 600],
    },
    display: "swap",
    preload: true,
    download: false,
  },
  devtools: { enabled: true },
  css: ["~/assets/main.css", "~/assets/flexboxgrid.css"],
  runtimeConfig: {
    public: {
      apiBase: "",
      writeToken: "",
    },
  },

  app: {
    head: {
      title: "Diário de Bordo / LogBook",
      link: [{ rel: "icon", type: "image/svg+xml", href: "/anchor.svg" }],
      meta: [
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1, viewport-fit=cover",
        },
      ],
    },
  },
});
