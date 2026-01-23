<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-box">
      <div class="modal-header">
        <h2>{{ title }}</h2>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>

      <div class="modal-content">
        <p>{{ content }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["title", "content"],
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9999;

  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-box {
  background: #fff;
  max-width: 800px;
  width: 90%;
  max-height: 80vh;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
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

@media (max-width: 600px) {
  .modal-overlay {
    padding: 15px;
  }

  .modal-box {
    width: 100%;
    max-width: 100%;
    margin: 0;
  }
}
</style>
