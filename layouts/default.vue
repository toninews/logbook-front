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

  mounted() {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) {
      this.isDark = saved === "true";
    }

    const savedLang = localStorage.getItem("language");
    if (savedLang) {
      this.language = savedLang;
    }
  },

  methods: {
    toggleDark() {
      this.isDark = !this.isDark;
      localStorage.setItem("darkMode", this.isDark);
    },

    changeLanguage(lang) {
      this.language = lang;
      localStorage.setItem("language", lang);
    },
  },
};
</script>
