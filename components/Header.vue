<template>
  <header class="app-header">
    <div class="header-content">
      <div class="header-left">
        <Icon
          name="fa6-solid:anchor"
          class="header-icon anchor"
          aria-hidden="true"
        />
        <h1 class="header-title">{{ getTitle(language) }}</h1>
      </div>

      <div class="header-right">
        <span class="header-date">
          {{ getToday(language) }}
        </span>
        <button
          class="menu-btn"
          type="button"
          :aria-label="getMenuButtonLabel(language, menuOpen)"
          :aria-expanded="menuOpen"
          aria-controls="header-menu-dropdown"
          @click="toggleMenu"
        >
          <Icon
            v-if="!menuOpen"
            name="fa6-solid:bars"
            aria-hidden="true"
            class="menu-btn-icon"
          />
          <Icon
            v-else
            name="fa6-solid:xmark"
            aria-hidden="true"
            class="menu-btn-icon"
          />
        </button>
        <transition name="dropdown">
          <div
            v-if="menuOpen"
            id="header-menu-dropdown"
            class="menu-dropdown"
            role="menu"
          >
            <button
              class="theme-toggle"
              :title="getThemeText(isDark, language)"
              type="button"
              @click="toggleDark"
            >
              <Icon
                :name="isDark ? 'fa6-solid:sun' : 'fa6-solid:moon'"
                class="theme-icon"
                aria-hidden="true"
              />

              <span>{{ getThemeText(isDark, language) }}</span>
            </button>

            <button
              class="menu-item language-item"
              role="menuitem"
              type="button"
              @click="toggleLanguage"
            >
              <span class="flag">
                {{ language === "pt" ? "🇧🇷" : "🇺🇸" }}
              </span>

              <span class="menu-text">{{ getLanguageLabel(language) }}</span>
            </button>

            <transition name="dropdown">
              <div v-if="languageOpen" class="language-dropdown">
                <button
                  class="language-option"
                  type="button"
                  @click="selectLanguage('pt')"
                >
                  <span class="flag">🇧🇷</span>
                  {{ language === "pt" ? "Português" : "Portuguese" }}
                </button>

                <button
                  class="language-option"
                  type="button"
                  @click="selectLanguage('en')"
                >
                  <span class="flag">🇺🇸</span>
                  {{ language === "pt" ? "Inglês" : "English" }}
                </button>
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
  props: {
    isDark: {
      type: Boolean,
      default: false,
    },
    language: {
      type: String,
      default: "pt",
      validator: (value) => ["pt", "en"].includes(value),
    },
  },
  data() {
    return {
      menuOpen: false,
      languageOpen: false,
      translations: {
        pt: {
          title: "Diário de Bordo",
          locale: "pt-BR",
          menu: { open: "Abrir menu", close: "Fechar menu" },
          languageLabel: "Idioma",
          theme: { dark: "Modo escuro", light: "Modo claro" },
        },
        en: {
          title: "Logbook",
          locale: "en-US",
          menu: { open: "Open menu", close: "Close menu" },
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

      return dateStr;
    },

    getLanguageLabel(lang) {
      return this.translations[lang]?.languageLabel || "Idioma";
    },

    getMenuButtonLabel(lang, isOpen) {
      const menuTranslations =
        this.translations[lang]?.menu || this.translations.pt.menu;
      return isOpen ? menuTranslations.close : menuTranslations.open;
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
  padding: 20px 0 0 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 5px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  flex-direction: column;
}

.header-left {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.header-icon {
  color: #0284c7;
  margin-right: 8px;
  font-size: 18px;
}

.header-title {
  font-size: 30px;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: #0f172a;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  width: 100%;
  justify-content: flex-end;
  padding: 20px 0 0 0;
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

.menu-btn:focus-visible {
  outline: 2px solid #0284c7;
  outline-offset: 2px;
}

.menu-btn-icon {
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
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dark .menu-dropdown {
  background: #0f172a;
  border-color: #1e293b;
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
  border: none;
  background: transparent;
  width: 100%;
  font-size: 16px !important;
  text-align: center;
}

.theme-toggle .theme-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #facc15;
}

.menu-item .menu-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
}

.menu-text {
  display: inline-block;
  width: 100%;
  text-align: center;
  font-size: 16px;
}

.language-dropdown {
  border: 1px solid #e2e8f0;
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  padding: 10px 10px 10px 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.dark .language-dropdown {
  background: #0f172a;
  border-color: #1e293b;
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
  border: none;
  background: transparent;
  width: 100%;
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

.dark .menu-btn {
  color: #64748b;
}

.dark .theme-toggle {
  color: #facc15;
  background: #1e293b;
}

.dark .theme-toggle:hover {
  background: #2563eb;
}

.dark .menu-item,
.dark .language-option {
  color: #e5e7eb;
  background: #1e293b;
}

.dark .menu-item:hover,
.dark .language-option:hover {
  background: #2563eb;
}

@media (min-width: 769px) {
  .header-content {
    flex-direction: row;
  }

  .header-right {
    width: auto;
    padding: 0;
  }

  .app-header {
    padding: 36px 0;
  }

  .header-title {
    font-size: 28px;
  }
}
</style>
