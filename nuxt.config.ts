// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  modules: ["@nuxt/icon", "@nuxtjs/google-fonts"],
  devtools: { enabled: true },
  css: ["~/assets/main.css", "~/assets/flexboxgrid.css", "~/assets/spinner.css"],
  runtimeConfig: {
    public: {
      apiBase:
        import.meta.env.NUXT_PUBLIC_API_URL ??
        import.meta.env.NEXT_PUBLIC_API_URL ??
        import.meta.env.baseUrl ??
        "http://localhost:4010",
      writeToken:
        import.meta.env.NUXT_PUBLIC_WRITE_TOKEN ??
        import.meta.env.NEXT_PUBLIC_WRITE_TOKEN ??
        "",
    },
  },
   app: {
    head: {
      title: 'Diário de Bordo / LogBook',
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;600&display=swap',
        },
                {
          rel: "stylesheet",
          href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css",
        },
          { rel: 'icon', type: 'public/svg', href: '/anchor.svg' }
      ],
    },
  },
});
