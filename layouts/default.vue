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

const darkCookie = useCookie("darkMode");
const languageCookie = useCookie("language");

const isDark = ref(false);
const language = ref("pt");
const hasHydrated = ref(false);

watch(isDark, (value) => {
  if (!hasHydrated.value) {
    return;
  }

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
  if (!hasHydrated.value) {
    return;
  }

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
    } else if (
      typeof languageCookie.value === "string" &&
      allowedLanguages.includes(languageCookie.value)
    ) {
      language.value = languageCookie.value;
    }

    if (
      savedDark !== "true" &&
      savedDark !== "false" &&
      (darkCookie.value === "true" || darkCookie.value === "false")
    ) {
      isDark.value = darkCookie.value === "true";
    }
  } catch (error) {
    // Keep cookie/default values when storage is unavailable.
    console.error("failed to read user preferences:", error);
  }

  hasHydrated.value = true;
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
