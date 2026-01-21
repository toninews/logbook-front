<template>
  <div>
    <p class="content-list">
      {{ previewText() }}
    </p>
    <button
      v-if="text.length > limit"
      class="btn-see-more"
      @click="$emit('open')"
    >
      {{ t("seeMore") }}
    </button>
  </div>
</template>

<script>
export default {
  props: ["text", "language"],

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

  mounted() {},

  methods: {
    previewText() {
      if (!this.text) return "";
      return this.text.length > this.limit
        ? this.text.slice(0, this.limit) + "..."
        : this.text;
    },

    t(key) {
      return this.translations[this.language]
        ? this.translations[this.language][key]
        : this.translations["pt"][key];
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
</style>
