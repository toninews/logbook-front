<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div
      ref="modalBox"
      class="modal-box"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
      tabindex="-1"
    >
      <div class="modal-header">
        <h2 :id="titleId">{{ title }}</h2>
        <button
          class="close-btn"
          type="button"
          aria-label="Fechar modal"
          @click="closeModal"
        >
          ✕
        </button>
      </div>

      <div class="modal-content">
        <p>{{ content }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
  },
  emits: ["close"],
  data() {
    return {
      titleId: "text-modal-title",
      previousFocusedElement: null,
    };
  },
  mounted() {
    this.previousFocusedElement = document.activeElement;
    document.addEventListener("keydown", this.handleKeydown);

    this.$nextTick(() => {
      if (this.$refs.modalBox?.focus) {
        this.$refs.modalBox.focus();
      }
    });
  },
  beforeUnmount() {
    document.removeEventListener("keydown", this.handleKeydown);
    if (this.previousFocusedElement?.focus) {
      this.previousFocusedElement.focus();
    }
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },

    handleKeydown(event) {
      if (event.key === "Escape") {
        this.closeModal();
      }

      if (event.key === "Tab") {
        const focusableElements = this.$refs.modalBox.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      }
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9999;
  padding: 15px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-box {
  background: #fff;
  max-width: 100%;
  width: 100%;
  max-height: 80vh;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin: 0;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
}

.modal-content {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
  line-height: 1.6;
}

.modal-content p {
  max-width: 100%;
  word-break: break-word;
  overflow-wrap: break-word;
  white-space: normal;
}

.close-btn {
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
}

.dark .close-btn {
  color: #e5e7eb;
}

.dark .modal-content {
  background: #020617;
  color: #e5e7eb;
}

.dark .modal-header {
  background: #020617;
  color: #e5e7eb;
}

.dark .modal-overlay {
  background: rgba(0, 0, 0, 0.8);
}

@media (min-width: 601px) {
  .modal-overlay {
    padding: 0;
  }

  .modal-box {
    width: 90%;
    max-width: 800px;
  }
}
</style>
