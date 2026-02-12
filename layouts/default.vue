<template>
  <div :class="{ dark: isDark }">
    <Header
      :isDark="isDark"
      @toggle-dark="toggleDark"
      :language="language"
      @change-language="changeLanguage"
    />
    <NuxtPage :language="language" />
    <Footer :language="language" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      isDark: false,
      language: "pt",
    };
  },

  beforeMount() {
    try {
      const saved = localStorage.getItem("darkMode");
      if (saved !== null) {
        this.isDark = saved === "true";
      }

      const savedLang = localStorage.getItem("language");
      if (savedLang && ["pt", "en"].includes(savedLang)) {
        this.language = savedLang;
      }
    } catch (error) {
      // Keep default values when storage is unavailable.
      console.error("failed to read user preferences:", error);
    }
  },

  methods: {
    toggleDark() {
      this.isDark = !this.isDark;
      try {
        localStorage.setItem("darkMode", this.isDark);
      } catch (error) {
        console.error("failed to persist dark mode:", error);
      }
    },

    changeLanguage(lang) {
      if (!["pt", "en"].includes(lang)) {
        return;
      }

      this.language = lang;
      try {
        localStorage.setItem("language", lang);
      } catch (error) {
        console.error("failed to persist language:", error);
      }
    },
  },
};
</script>
