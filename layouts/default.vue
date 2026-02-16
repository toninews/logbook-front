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

<script setup>
useHead({
  htmlAttrs: {
    lang: "pt",
  },
  title: "Diário de Bordo / LogBook",
  meta: [
    { name: "description", content: "Aplicativo de registro diário LogBook" },
  ],
});

const allowedLanguages = ["pt", "en"];

const darkCookie = useCookie("darkMode", { default: () => "false" });
const languageCookie = useCookie("language", { default: () => "pt" });

const isDark = ref(darkCookie.value === "true");
const language = ref(
  allowedLanguages.includes(languageCookie.value) ? languageCookie.value : "pt",
);

watch(isDark, (value) => {
  const serialized = value ? "true" : "false";
  darkCookie.value = serialized;

  if (import.meta.client) {
    try {
      localStorage.setItem("darkMode", serialized);
    } catch (error) {
      console.error("failed to persist dark mode:", error);
    }
  }
});

watch(language, (value) => {
  languageCookie.value = value;

  if (import.meta.client) {
    try {
      localStorage.setItem("language", value);
    } catch (error) {
      console.error("failed to persist language:", error);
    }
  }
});

onMounted(() => {
  try {
    const savedDark = localStorage.getItem("darkMode");
    if (savedDark === "true" || savedDark === "false") {
      isDark.value = savedDark === "true";
    }

    const savedLang = localStorage.getItem("language");
    if (savedLang && allowedLanguages.includes(savedLang)) {
      language.value = savedLang;
    }
  } catch (error) {
    // Keep cookie/default values when storage is unavailable.
    console.error("failed to read user preferences:", error);
  }
});

function toggleDark() {
  isDark.value = !isDark.value;
}

function changeLanguage(lang) {
  if (!allowedLanguages.includes(lang)) {
    return;
  }

  language.value = lang;
}
</script>
