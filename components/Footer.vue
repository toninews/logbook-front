<template>
  <footer class="app-footer">
    <div class="footer-content">
      <i class="fa-solid fa-anchor footer-icon"></i>
      <span class="footer-text">
        {{ getFooterText(language) }} • {{ year }}
      </span>
    </div>
  </footer>
</template>

<script>
export default {
  props: ["language"],
  data() {
    return {
      year: new Date().getFullYear(),
      translations: {
        pt: "Diário de Bordo • Desenvolvido por toninews",
        en: "Logbook • Developed by toninews",
      },
    };
  },

  methods: {
    getFooterText(lang) {
      return this.translations[lang] || this.translations.pt;
    },
  },
};
</script>

<style scoped>
.app-footer {
  width: 100%;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  border-top: 1px solid #334155;
  padding: 22px 0;
  text-align: center;
}

.footer-content {
  display: inline-block;
}

.footer-icon {
  color: #38bdf8;
  font-size: 14px;
  margin-right: 6px;
  vertical-align: middle;
}

.footer-text {
  color: #e2e8f0;
  font-size: 14px;
  font-weight: 500;
  vertical-align: middle;
}
</style>
