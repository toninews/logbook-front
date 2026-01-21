<template>
  <div class="container">
    <div class="new-register-wrapper">
      <div class="col-xs-11 col-sm-11 col-md-8 col-lg-6 new-register">
        <h1 class="new-title">{{ t("newRegister") }}</h1>

        <form @submit.prevent="handleSubmit" class="col-xs-12 diario-form">
          <div class="row">
            <div class="col-xs-12 form-group">
              <span>{{ t("title") }}</span>
              <input v-model="titulo" :placeholder="t('titlePlaceholder')" />
            </div>

            <div class="col-xs-12 form-group">
              <span>{{ t("content") }}</span>
              <textarea
                v-model="conteudo"
                :placeholder="t('contentPlaceholder')"
                class="content-textarea"
              ></textarea>
            </div>

            <div class="col-xs-12 form-group">
              <span>{{ t("tags") }}</span>
              <input v-model="tagsInput" :placeholder="t('tagsPlaceholder')" />
            </div>

            <div class="col-xs-12 end-xs">
              <button type="submit" class="btn">
                {{ t("save") }} <i class="fa-solid fa-floppy-disk"></i>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <div class="row center-xs">
      <div class="col-xs-12 col-sm-10 col-md-8 col-lg-6 search-box">
        <i class="fa-solid fa-magnifying-glass search-icon"></i>

        <input
          v-model="search"
          :placeholder="t('searchPlaceholder')"
          @keyup.enter="loadLogs(1)"
        />

        <button class="btn-search" @click="loadLogs(1)">
          {{ t("search") }}
        </button>

        <button class="btn-clear" @click="clearSearch">
          {{ t("showAll") }}
        </button>
      </div>
    </div>

    <div class="row center-xs">
      <div class="col-xs-11 col-sm-10 col-md-8 col-lg-6 my-title-main">
        <h1 class="title-list">
          <i class="fa-solid fa-book-open"></i>{{ t("myLogs") }}
        </h1>

        <div v-if="loading" class="loading-text">
          <i class="fa-solid fa-spinner fa-spin"></i> {{ t("loading") }}
        </div>

        <div v-else-if="registros.length === 0" class="no-records">
          {{ t("noRecords") }}
        </div>

        <div
          v-for="registro in registros"
          :key="registro._id"
          class="my-register"
        >
          <div class="registro-header">
            <h3 class="my-title">{{ registro.title }}</h3>
            <span class="registro-time"
              ><i class="fa-regular fa-clock"></i>
              {{ elapsedTime(registro.createdAt) }}
            </span>
          </div>

          <TruncatedText
            :text="registro.content"
            :language="language"
            @open="openRegistro(registro)"
          />

          <button class="btn-delete" @click="handleDelete(registro._id)">
            {{ t("delete") }}
          </button>
          <div class="chips" v-if="registro.tags && registro.tags.length">
            <span
              class="chip has-tooltip"
              v-for="(tag, index) in registro.tags"
              :key="index"
            >
              {{ tag }}
              <span class="tooltip">Tag: {{ tag }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="pagination">
      <button
        v-for="page in totalPages"
        :key="page"
        class="page-btn"
        :class="{ active: page === currentPage }"
        @click="loadLogs(page)"
      >
        {{ page }}
      </button>
    </div>

    <TextModal
      v-if="selectedRegistro"
      :title="selectedRegistro.title"
      :content="selectedRegistro.content"
      @close="closeModal"
    />
  </div>
</template>

<script>
import Swal from "sweetalert2";

const translations = {
  pt: {
    newRegister: "Novo Registro",
    title: "Título",
    titlePlaceholder: "Título do registro",
    content: "Conteúdo",
    contentPlaceholder: "O que aconteceu hoje?",
    tags: "Tags",
    tagsPlaceholder: "Ex: estudo, trabalho, backend",
    save: "Salvar",
    searchPlaceholder: "Buscar por título, conteúdo ou tag...",
    search: "Buscar",
    myLogs: "Meus Registros",
    delete: "Excluir",
    showAll: "Mostrar todos",
    noRecords: "Nenhum registro encontrado",
    swalWarningTitle: "Ops...",
    swalWarningText: "Você precisa preencher título e conteúdo!",
    swalSuccessTitle: "Sucesso!",
    swalSuccessText: "Novo registro inserido com sucesso!",
    swalErrorTitle: "Erro",
    swalErrorText: "Algo deu errado!",
    swalRateLimitTitle: "Muitas requisições",
    swalRateLimitText:
      "Você fez muitas requisições em pouco tempo. Tente novamente em alguns segundos.",
  },
  en: {
    newRegister: "New Entry",
    title: "Title",
    titlePlaceholder: "Entry title",
    content: "Content",
    contentPlaceholder: "What happened today?",
    tags: "Tags",
    tagsPlaceholder: "Ex: study, work, backend",
    save: "Save",
    searchPlaceholder: "Search by title, content or tag...",
    search: "Search",
    myLogs: "My Logs",
    delete: "Delete",
    showAll: "Show all",
    noRecords: "No records found",
    swalWarningTitle: "Oops...",
    swalWarningText: "You need to fill in title and content!",
    swalSuccessTitle: "Success!",
    swalSuccessText: "New entry added successfully!",
    swalErrorTitle: "Error",
    swalErrorText: "Something went wrong!",
    swalRateLimitTitle: "Too many requests",
    swalRateLimitText:
      "You have made too many requests in a short period. Please try again in a few seconds.",
  },
};

export default {
  props: ["language"],
  data() {
    return {
      registros: [],
      titulo: "",
      conteudo: "",
      tagsInput: "",
      search: "",
      apiBase: "",
      selectedRegistro: null,
      currentPage: 1,
      totalPages: 1,
      isDark: false,
      translations,
      loading: false,
    };
  },

  mounted() {
    const { apiBase } = useApiBase();
    this.apiBase = apiBase;

    const savedDark = localStorage.getItem("darkMode");
    if (savedDark !== null) {
      this.isDark = savedDark === "true";
    }

    this.loadLogs(1);
  },

  methods: {
    clearSearch() {
      this.search = "";
      this.loadLogs(1);
    },

    t(key) {
      return this.translations[this.language][key] || key;
    },

    openRegistro(registro) {
      this.selectedRegistro = registro;
    },

    closeModal() {
      this.selectedRegistro = null;
    },

    async loadLogs(page = 1) {
      try {
        this.loading = true;
        const response = await fetch(
          `${this.apiBase}/getList?page=${page}&search=${this.search}`,
        );

        console.log("response.ok:", response.ok);
        console.log("status:", response.status);

        if (response.status === 429) {
          Swal.fire({
            icon: "warning",
            title: this.t("swalRateLimitTitle"),
            text: this.t("swalRateLimitText"),
          });
          return;
        }

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text);
        }

        const data = await response.json();

        this.registros = data.data;
        this.totalPages = data.totalPages;
        this.currentPage = data.currentPage;

        this.loading = false;
      } catch (err) {
        console.error("error loading logs:", err);

        Swal.fire({
          icon: "error",
          title: this.t("swalErrorTitle"),
          text: this.t("swalErrorText"),
        });
      }
    },

    async handleSubmit() {
      if (!this.titulo || !this.conteudo) {
        Swal.fire({
          icon: "warning",
          title: this.t("swalWarningTitle"),
          text: this.t("swalWarningText"),
        });
        return;
      }

      const rawTags = this.tagsInput.split(",");
      const tags = [];

      for (let i = 0; i < rawTags.length; i++) {
        const tag = rawTags[i].trim();
        if (tag) {
          tags.push(tag);
        }
      }

      const registrationData = {
        title: this.titulo,
        content: this.conteudo,
        tags,
      };

      const config = {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(registrationData),
      };
      console.log("config", config);

      try {
        const response = await fetch(`${this.apiBase}/insertTask`, config);
        console.log("http status:", response.status);

        if (response.status === 429) {
          Swal.fire({
            icon: "warning",
            title: this.t("swalRateLimitTitle"),
            text: this.t("swalRateLimitText"),
          });
          return;
        }

        if (!response.ok) {
          const text = await response.text();

          Swal.fire({
            icon: "error",
            title: this.t("swalErrorTitle"),
            text: this.t("swalErrorText"),
          });

          throw new Error(text);
        }

        const data = await response.json();
        console.log("response from backend", data);

        this.titulo = "";
        this.conteudo = "";
        this.tagsInput = "";

        this.loadLogs();

        Swal.fire({
          icon: "success",
          title: this.t("swalSuccessTitle"),
          text: this.t("swalSuccessText"),
        });

        console.log("success!");
      } catch (error) {
        console.error("unexpected error:", error);
      }
    },

    async handleDelete(id) {
      console.log("id sent:", id);

      const config = {
        method: "DELETE",
      };

      try {
        const response = await fetch(`${this.apiBase}/${id}`, config);
        console.log("status delete:", response.status);
        console.log("response ok?", response.ok);

        this.loadLogs();
      } catch (error) {
        console.error("unexpected error:", error);
        alert("error deleting record");
      }
    },

    elapsedTime(createdAt) {
      const agora = new Date();
      const dataRegistro = new Date(createdAt);

      const diffMs = agora - dataRegistro;
      const diffSeg = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSeg / 60);
      const diffHora = Math.floor(diffMin / 60);
      const diffDia = Math.floor(diffHora / 24);
      const diffMes = Math.floor(diffDia / 30);
      const diffAno = Math.floor(diffDia / 365);

      const lang = this.language || "pt";

      const texts = {
        pt: {
          now: "agora mesmo",
          minute: "minuto",
          hour: "hora",
          day: "dia",
          month: "mês",
          year: "ano",
          plural: (count) => (count > 1 ? "s" : ""),
          format: (value, unit) => `há ${value} ${unit}`,
        },
        en: {
          now: "just now",
          minute: "minute",
          hour: "hour",
          day: "day",
          month: "month",
          year: "year",
          plural: (count) => (count > 1 ? "s" : ""),
          format: (value, unit) => `${value} ${unit} ago`,
        },
      };

      const t = texts[lang];

      if (diffSeg < 60) return t.now;
      if (diffMin < 60)
        return t.format(diffMin, `${t.minute}${t.plural(diffMin)}`);
      if (diffHora < 24)
        return t.format(diffHora, `${t.hour}${t.plural(diffHora)}`);
      if (diffDia < 30)
        return t.format(diffDia, `${t.day}${t.plural(diffDia)}`);
      if (diffMes < 12)
        return t.format(diffMes, `${t.month}${t.plural(diffMes)}`);
      return t.format(diffAno, `${t.year}${t.plural(diffAno)}`);
    },
  },
};
</script>

<style scoped>
.new-register-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}

.form-group {
  margin-bottom: 1rem;
}
.diario-form input {
  width: 100%;
  padding: 10px 12px;
  margin-top: 2px;
  background-color: #fbf7e6;
  border: 1px solid #d6d3c8;
  border-radius: 5px;
  font-size: 14px;
  outline: none;
  transition:
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.diario-form input:focus {
  border-color: #0284c7;
  box-shadow:
    0 0 0 1px rgb(13 148 136),
    0 0 0 4px #c8e6c9;
}

.new-register {
  background: linear-gradient(135deg, #ffffff, #f0f9ff);
  border: 1px solid #d6d3c8;
  border-radius: 15px;
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.06),
    0 4px 12px rgba(0, 0, 0, 0.08);
  text-align: left;
  padding: 20px 20px 20px 20px;
  margin-top: 30px;
}

.my-register {
  background: linear-gradient(135deg, #ffffff);
  border: 1px solid #d6d3c8;
  border-radius: 15px;
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.06),
    0 4px 12px rgba(0, 0, 0, 0.08);
  text-align: left;
  padding: 0px 20px 10px 20px;
  margin-top: 20px;
}

.end-xs {
  justify-content: flex-end;
  text-align: end;
}

.new-title {
  color: #0284c7;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.my-title-main {
  text-align: left;
}

.my-title {
  color: #0284c7;
  font-size: 20px;
}

.title-list {
  color: #334155;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
}

.title-list i {
  margin-right: 8px;
}

.content-textarea {
  width: 100%;
  min-height: 120px;
  padding: 10px 12px;
  background-color: #fbf7e6;
  border: 1px solid #d6d3c8;
  border-radius: 5px;
  font-size: 14px;
  resize: vertical;
  outline: none;
}

.content-textarea:focus {
  border-color: #0284c7;
  box-shadow:
    0 0 0 1px rgb(13 148 136),
    0 0 0 4px #c8e6c9;
}

.registro-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.registro-time {
  font-size: 14px;
  color: #64748b;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-delete {
  margin-top: 12px;
  background: #fff;
  color: #b91c1c;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 6px 14px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-delete:hover {
  background: #fee2e2;
  border-color: #fca5a5;
  color: #991b1b;
}

.btn-delete:active {
  transform: translateY(1px);
}

.pagination {
  padding: 20px 20px 20px 20px;
  text-align: center;
}

.page-btn {
  margin: 0 6px;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.page-btn:hover {
  background: #e0f2fe;
}

.page-btn.active {
  background: #0284c7;
  color: #fff;
  border-color: #0284c7;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 20px 5px 20px 5px;
}

.search-box input {
  flex: 1;
  padding: 10px 12px 10px 36px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-size: 14px;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #64748b;
  font-size: 14px;
}

.btn-search {
  padding: 10px 14px;
  border-radius: 8px;
  border: none;
  background: #0284c7;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-search:hover {
  background: #0369a1;
}

.chips {
  text-align: center;
  margin-top: 12px;
}

.chip {
  display: inline-block;
  background: #eef2ff;
  color: #3730a3;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  margin: 4px;
  white-space: nowrap;
}

.has-tooltip {
  position: relative;
}

.tooltip {
  position: absolute;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  background: #1e293b;
  color: #fff;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.has-tooltip:hover .tooltip {
  opacity: 1;
}

.dark .container {
  background: #0f172a;
  color: #e5e7eb;
}

.dark {
  background: #0f172a;
  color: #e5e7eb;
}

.dark .new-register,
.dark .my-register {
  background: linear-gradient(135deg, #020617, #020617);
  border-color: #1e293b;
}

.dark input {
  background: #020617;
  color: #e5e7eb;
  border-color: #334155;
}

.dark input::placeholder {
  color: #94a3b8;
}

.dark .title-list,
.dark .my-title,
.dark .new-title {
  color: #e5e7eb;
}

.dark .registro-time {
  color: #94a3b8;
}

.dark .chip {
  background: #1e293b;
  color: #e5e7eb;
}

.dark .btn-search {
  background: #2563eb;
}

.dark .btn-search:hover {
  background: #1d4ed8;
}

.dark .content-textarea {
  width: 100%;
  min-height: 120px;
  padding: 10px 12px;
  background-color: #020617;
  border-color: #334155;
  border-radius: 5px;
  font-size: 14px;
  resize: vertical;
  outline: none;
  color: #e5e7eb;
}

.debug {
  border: #991b1b;
  border: solid;
}

.theme-toggle {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #ffffff;
  color: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
  transition: all 0.25s ease;
  z-index: 999;
}

.theme-toggle:hover {
  transform: scale(1.08);
}

.dark .theme-toggle {
  background: #1e293b;
  color: #facc15;
}

.btn-clear {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #0284c7;
  background: #ffffff;
  color: #0284c7;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  display: inline-flex;
  align-items: center;
}

.btn-clear:hover {
  background: #0284c7;
  color: #ffffff;
  border-color: #0284c7;
}

.btn-clear:active {
  transform: translateY(1px);
}

.loading-text {
  text-align: center;
  font-size: 18px;
  margin: 20px 0;
}

.no-records {
  text-align: center;
  font-size: 18px;
  color: #777;
  margin: 20px 0;
}

@media (max-width: 768px) {
  .new-register-wrapper {
    justify-content: start;
    margin-left: 15px;
  }

  .search-box {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  .search-box input {
    margin-bottom: 0.5rem;
  }

  .search-box .btn-search,
  .search-box .btn-clear {
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .search-box .btn-clear {
    margin-bottom: 0;
  }

  .search-icon {
    top: 33px;
  }

  .title-list {
    font-size: 26px;
    text-align: center;
  }

  .btn-search {
    font-size: 16px;
  }

  .search-box .btn-search,
  .search-box .btn-clear {
    justify-content: center;
  }
}
</style>
