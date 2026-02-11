<template>
  <div>
    <p class="content-list">
      {{ previewText() }}
    </p>
    <button
      v-if="shouldShowSeeMore()"
      class="btn-see-more"
      type="button"
      @click="$emit('open')"
    >
      {{ t("seeMore") }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: "",
    },
    language: {
      type: String,
      default: "pt",
      validator: (value) => ["pt", "en"].includes(value),
    },
  },
  emits: ["open"],

  data() {
    return {
      limit: 210,
      translations: {
        pt: {
          seeMore: "Ver mais",
        },
        en: {
          seeMore: "See more",
        },
      },
    };
  },

  methods: {
    shouldShowSeeMore() {
      return (this.text || "").length > this.limit;
    },

    previewText() {
      const safeText = this.text || "";
      return safeText.length > this.limit
        ? safeText.slice(0, this.limit) + "..."
        : safeText;
    },

    t(key) {
      const languageTranslations =
        this.translations[this.language] || this.translations.pt || {};
      return languageTranslations[key] || key;
    },
  },
};
</script>

<style scoped>
.btn-see-more {
  margin-top: 12px;
  background: #ecfdf5;
  color: #047857;
  border: 1px solid #a7f3d0;
  border-radius: 8px;
  padding: 6px 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-see-more:hover {
  background: #d1fae5;
}

.content-list {
  max-width: 100%;
  word-break: break-word;
  overflow-wrap: break-word;
  white-space: normal;
}
</style>
