<template>
  <div class="container">
    <div class="new-register-wrapper">
      <div class="col-xs-11 col-sm-11 col-md-8 col-lg-6 new-register">
        <h1 class="new-title">{{ t("newRegister") }}</h1>

        <form @submit.prevent="handleSubmit" class="col-xs-12 diario-form">
          <div class="row">
            <div class="col-xs-12 form-group">
              <label for="titulo">{{ t("title") }}</label>
              <input
                id="titulo"
                v-model="titulo"
                :placeholder="t('titlePlaceholder')"
              />
            </div>

            <div class="col-xs-12 form-group">
              <label for="conteudo">{{ t("content") }}</label>
              <textarea
                id="conteudo"
                v-model="conteudo"
                :placeholder="t('contentPlaceholder')"
                class="content-textarea"
              ></textarea>
            </div>

            <div class="col-xs-12 form-group">
              <label for="tagsInput">{{ t("tags") }}</label>
              <input
                id="tagsInput"
                v-model="tagsInput"
                :placeholder="t('tagsPlaceholder')"
              />
            </div>

            <div class="col-xs-12 end-xs">
              <button type="submit" class="btn">
                {{ t("save") }} <Icon name="fa6-solid:floppy-disk" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <div class="row center-xs">
      <div class="col-xs-12 col-sm-10 col-md-8 col-lg-6 search-box">
        <Icon name="fa6-solid:magnifying-glass" class="search-icon" />

        <label for="searchInput" class="sr-only">
          {{ t("search") }}
        </label>
        <input
          id="searchInput"
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
          <Icon name="fa6-solid:book-open" class="title-list-icon" />{{
            t("myLogs")
          }}
        </h1>

        <div v-if="loading" class="loading-text">
          <Icon name="fa6-solid:spinner" /> {{ t("loading") }}
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
              ><Icon name="fa6-regular:clock" />
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
import { translations } from "~/utils/translations";
import { API_ROUTES } from "~/utils/apiRoutes";
import { alertError, alertWarning, alertSuccess } from "~/utils/alerts";
import { elapsedTime } from "~/utils/elapsedTime";

export default {
  props: ["language"],
  data() {
    const config = useRuntimeConfig();
    return {
      registros: [],
      titulo: "",
      conteudo: "",
      tagsInput: "",
      search: "",
      selectedRegistro: null,
      currentPage: 1,
      totalPages: 1,
      loading: false,
      apiBase: config.public.apiBase,
      writeToken: config.public.writeToken,
    };
  },

  mounted() {
    this.loadLogs(1);
  },

  methods: {
    debugLog(...args) {
      if (import.meta.dev) {
        console.log(...args);
      }
    },

    clearSearch() {
      this.search = "";
      this.loadLogs(1);
    },

    t(key) {
      const languageTranslations =
        translations[this.language] || translations.pt || {};
      return languageTranslations[key] || key;
    },

    openRegistro(registro) {
      this.selectedRegistro = registro;
    },

    closeModal() {
      this.selectedRegistro = null;
    },

    getWriteTokenHeader() {
      if (!this.writeToken) {
        return {};
      }

      return {
        "x-write-token": this.writeToken,
      };
    },

    async loadLogs(page = 1) {
      try {
        this.loading = true;
        const queryParams = new URLSearchParams({
          page: String(page),
          search: this.search,
        });
        const response = await fetch(
          `${this.apiBase}${API_ROUTES.GET_LIST}?${queryParams.toString()}`,
        );

        this.debugLog("response.ok:", response.ok);
        this.debugLog("status:", response.status);

        if (response.status === 429) {
          alertWarning(
            this.t("swalRateLimitTitle"),
            this.t("swalRateLimitText"),
          );
          return;
        }

        if (!response.ok) {
          const text = await response.text();
          alertError(this.t("swalErrorTitle"), this.t("swalErrorText"));
          throw new Error(text);
        }

        const data = await response.json();

        this.registros = data.data;
        this.totalPages = data.totalPages;
        this.currentPage = data.currentPage;
      } catch (err) {
        console.error("error loading logs:", err);
        alertError(this.t("swalErrorTitle"), this.t("swalErrorText"));
      } finally {
        this.loading = false;
      }
    },

    async handleSubmit() {
      if (!this.titulo || !this.conteudo) {
        alertWarning(this.t("swalWarningTitle"), this.t("swalWarningText"));
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
          ...this.getWriteTokenHeader(),
        },
        body: JSON.stringify(registrationData),
      };
      this.debugLog("config", config);

      try {
        const response = await fetch(
          `${this.apiBase}${API_ROUTES.INSERT_TASK}`,
          config,
        );
        this.debugLog("http status:", response.status);

        if (response.status === 429) {
          alertWarning(
            this.t("swalRateLimitTitle"),
            this.t("swalRateLimitText"),
          );
          return;
        }

        if (!response.ok) {
          const text = await response.text();
          alertError(this.t("swalErrorTitle"), this.t("swalErrorText"));
          throw new Error(text);
        }

        const data = await response.json();
        this.debugLog("response from backend", data);

        this.titulo = "";
        this.conteudo = "";
        this.tagsInput = "";

        this.loadLogs();

        alertSuccess(this.t("swalSuccessTitle"), this.t("swalSuccessText"));

        this.debugLog("success!");
      } catch (error) {
        console.error("unexpected error:", error);
        alertError(this.t("swalErrorTitle"), this.t("swalErrorText"));
      }
    },

    async handleDelete(id) {
      this.debugLog("id sent:", id);

      const result = await Swal.fire({
        title: this.t("swalDeleteTitle"),
        text: this.t("swalDeleteText"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: this.t("delete"),
        cancelButtonText: this.t("cancel"),
      });

      if (!result.isConfirmed) {
        this.debugLog("Delete cancelled");
        return;
      }

      const config = {
        method: "DELETE",
        headers: {
          ...this.getWriteTokenHeader(),
        },
      };

      try {
        const response = await fetch(
          `${this.apiBase}${API_ROUTES.DELETE_TASK(id)}`,
          config,
        );
        this.debugLog("status delete:", response.status);
        this.debugLog("response ok?", response.ok);

        if (response.ok) {
          alertSuccess(
            this.t("swalSuccessTitle"),
            this.t("swalDeleteSuccessText"),
          );
          this.loadLogs();
        } else {
          alertError(this.t("swalErrorTitle"), this.t("swalErrorText"));
        }
      } catch (error) {
        console.error("unexpected error:", error);
        alertError(this.t("swalErrorTitle"), this.t("swalErrorText"));
      }
    },

    elapsedTime(createdAt) {
      return elapsedTime(createdAt, this.language);
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
  font-size: 26px;
  font-weight: 600;
  margin-bottom: 16px;
  text-align: center;
}

.title-list-icon {
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
  flex-direction: column;
  align-items: stretch;
  gap: 5px;
  padding: 20px 12px;
}

.search-box input {
  flex: 1;
  padding: 10px 12px 10px 36px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-size: 14px;
  margin-bottom: 0.5rem;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 33px;
  color: #64748b;
  font-size: 14px;
}

.btn-search {
  padding: 10px 14px;
  border-radius: 8px;
  border: none;
  background: #0284c7;
  color: #fff;
  font-size: 16px;
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

.dark .no-records {
  color: #cbd5e1;
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
  background: #1e40af;
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

.btn-clear {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #0284c7;
  background: #e2e8f0;
  color: #1e293b;
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

.search-box .btn-search {
  width: 100%;
  margin-bottom: 0.5rem;
  justify-content: center;
}

.search-box .btn-clear {
  width: 100%;
  margin-bottom: 0;
  justify-content: center;
}

.loading-text {
  text-align: center;
  font-size: 18px;
  margin: 20px 0;
}

.no-records {
  text-align: center;
  font-size: 18px;
  color: #475569;
  margin: 20px 0;
}

@media (min-width: 769px) {
  .search-box {
    flex-direction: row;
    align-items: center;
  }

  .search-box input {
    margin-bottom: 0;
  }

  .search-box .btn-search,
  .search-box .btn-clear {
    width: auto;
    margin-bottom: 0;
  }

  .search-icon {
    top: 50%;
    transform: translateY(-50%);
  }

  .title-list {
    font-size: 24px;
    text-align: left;
  }

  .btn-search {
    font-size: 14px;
  }
}
</style>
