<template>
  <header class="app-header">
    <div class="header-content">
      <div class="header-left">
        <i class="fa-solid fa-anchor header-icon anchor"></i>
        <span class="header-title">{{ getTitle(language) }}</span>
      </div>

      <div class="header-right">
        <span class="header-date">
          {{ getToday(language) }}
        </span>
        <button class="menu-btn" @click="toggleMenu">
          <i v-if="!menuOpen" class="fa-solid fa-bars"></i>
          <i v-else class="fa-solid fa-xmark"></i>
        </button>
        <transition name="dropdown">
          <div v-if="menuOpen" class="menu-dropdown">
            <div
              class="theme-toggle"
              :title="getThemeText(isDark, language)"
              @click="toggleDark"
            >
              <i class="fa-solid" :class="isDark ? 'fa-sun' : 'fa-moon'"></i>
              <span>{{ getThemeText(isDark, language) }}</span>
            </div>

            <div class="menu-item language-item" @click="toggleLanguage">
              <i class="fa-solid fa-globe"></i>
              <span class="menu-text">{{ getLanguageLabel(language) }}</span>
            </div>

            <transition name="dropdown">
              <div v-if="languageOpen" class="language-dropdown">
                <div class="language-option" @click="selectLanguage('pt')">
                  <span class="flag">🇧🇷</span>
                  {{ language === "pt" ? "Português" : "Portuguese" }}
                </div>

                <div class="language-option" @click="selectLanguage('en')">
                  <span class="flag">🇺🇸</span>
                  {{ language === "pt" ? "Inglês" : "English" }}
                </div>
              </div>
            </transition>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  props: ["isDark", "language"],
  data() {
    return {
      today: "",
      menuOpen: false,
      languageOpen: false,
      translations: {
        pt: {
          title: "Diário de Bordo",
          locale: "pt-BR",
          languageLabel: "Idioma",
          theme: { dark: "Modo escuro", light: "Modo claro" },
        },
        en: {
          title: "Logbook",
          locale: "en-US",
          languageLabel: "Language",
          theme: { dark: "Dark mode", light: "Light mode" },
        },
      },
    };
  },

  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
      if (!this.menuOpen) {
        this.languageOpen = false;
      }
    },

    toggleLanguage() {
      this.languageOpen = !this.languageOpen;
    },

    selectLanguage(lang) {
      this.$emit("change-language", lang);
      this.languageOpen = false;
      this.menuOpen = false;
    },

    toggleDark() {
      this.$emit("toggle-dark");
    },

    getTitle(lang) {
      return this.translations[lang]?.title || this.translations.pt.title;
    },

    getToday(lang) {
      const locale = this.translations[lang]?.locale || "pt-BR";
      let dateStr = new Date().toLocaleDateString(locale, {
        weekday: "long",
        day: "2-digit",
        month: "long",
      });

      if (lang === "pt") {
        dateStr = dateStr.replace(/,?\s?De\s/, " de ");
      }

      console.log("dateStr", dateStr);
      return dateStr;
    },

    getLanguageLabel(lang) {
      return this.translations[lang]?.languageLabel || "Idioma";
    },

    getThemeText(isDark, lang) {
      const theme =
        this.translations[lang]?.theme || this.translations.pt.theme;
      return isDark ? theme.light : theme.dark;
    },
  },
};
</script>

<style scoped>
.app-header {
  width: 100%;
  background: linear-gradient(135deg, #e0f2fe, #bae6fd);
  border-bottom: 1px solid #cbd5e1;
  padding: 36px 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 5px;
}

.header-left {
  display: inline-block;
  text-align: left;
}

.header-icon {
  color: #0284c7;
  margin-right: 8px;
  font-size: 18px;
}

.header-title {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: #0f172a;
}

.header-right {
  float: right;
  display: inline-flex;
  align-items: center;
  gap: 16px;
  position: relative;
}

.menu-btn {
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  cursor: pointer;
  color: #0f172a;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.menu-btn i {
  font-size: 24px;
}

.menu-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 200px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  padding: 10px;
  z-index: 1000;
}

.menu-item:hover {
  background: #f1f5f9;
}

.dark .menu-item {
  color: #fff;
}

.dark .menu-item:hover {
  background: #1e293b;
}

.dark .menu-dropdown {
  background: #0f172a;
}

.header-date {
  font-size: 16px;
  color: #64748b;
}

.header-date::first-letter {
  text-transform: uppercase;
}

.anchor {
  color: #0ea5e9;
  font-size: 24px;
  margin-right: 10px;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.theme-toggle:hover {
  background: #f1f5f9;
}

.dark .theme-toggle i {
  background: #1e293b;
  color: #facc15;
}

.dark .theme-toggle {
  color: #fff;
}

.dark .theme-toggle:hover {
  background: #1e293b;
  color: #fff;
}

.theme-toggle,
.menu-item {
  position: relative;
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px !important;
  text-align: center;
}

.theme-toggle i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #facc15;
}

.menu-text {
  display: inline-block;
  width: 100%;
  text-align: center;
  font-size: 16px;
}

.menu-item i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
}

.language-dropdown {
  position: absolute;
  top: 60px;
  left: 205px;
  width: 200px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  padding: 10px 10px 10px 10px;
}

.dark .language-dropdown {
  background: #0f172a;
}

.dark .language-option {
  color: #fff;
}

.dark .language-option:hover {
  background: #1e293b;
}

.language-item {
  position: relative;
}

.language-option {
  position: relative;
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  text-align: center;
}

.language-option:hover {
  background: #f1f5f9;
}

.flag {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
}

@media (max-width: 768px) {
  .language-dropdown {
    top: 100px;
    left: 0;
  }

  .header-content {
    text-align: center;
  }
  .header-title {
    font-size: 30px;
  }
}
</style>
