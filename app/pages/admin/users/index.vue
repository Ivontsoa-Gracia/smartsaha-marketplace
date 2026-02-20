<template>
  <div class="space-y-8 p-12 min-h-screen bg-[#FAFAF9]">
    <Breadcrumb />
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
    >
      <h1 class="text-2xl font-bold text-gray-900 tracking-tight">
        {{ t("userTitle") }}
      </h1>

      <button
        @click="toggleUserForm"
        class="btn-primary flex items-center gap-2"
      >
        <i :class="showUserForm ? 'bx bx-x' : 'bx bx-plus'"></i>
        {{ showUserForm ? "" : t("add") }}
      </button>
    </div>

    <div
      v-if="showUserForm"
      class="bg-white border border-gray-200 rounded p-6 space-y-6"
    >
      <h2 class="text-lg font-semibold text-gray-800">
        {{ editUserId ? t("edit") : t("add") }}
      </h2>

      <form
        @submit.prevent="submitUser"
        class="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div class="flex flex-col gap-1">
          <label class="text-sm text-gray-600">{{ t("username") }}</label>
          <div
            class="flex items-center gap-2 border border-gray-300 rounded px-3 py-2 bg-gray-50"
          >
            <i class="bx bx-user text-gray-500 text-lg"></i>
            <input
              v-model="username"
              required
              maxlength="150"
              pattern="^[\\w.@+-]+$"
              placeholder="Ex: john_doe"
              class="flex-1 bg-transparent outline-none text-gray-900 text-sm"
            />
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm text-gray-600">{{ t("email") }}</label>
          <div
            class="flex items-center gap-2 border border-gray-300 rounded px-3 py-2 bg-gray-50"
          >
            <i class="bx bx-envelope text-gray-500 text-lg"></i>
            <input
              v-model="email"
              type="email"
              maxlength="254"
              placeholder="Ex: john@example.com"
              class="flex-1 bg-transparent outline-none text-gray-900 text-sm"
            />
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm text-gray-600">{{ t("password") }}</label>
          <div
            class="flex items-center gap-2 border border-gray-300 rounded px-3 py-2 bg-gray-50"
          >
            <i class="bx bx-lock text-gray-500 text-lg"></i>
            <input
              v-model="password"
              type="password"
              required
              placeholder="Mot de passe"
              class="flex-1 bg-transparent outline-none text-gray-900 text-sm"
            />
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm text-gray-600">{{ t("category") }}</label>
          <select
            v-model="categorieUserId"
            required
            class="border border-gray-300 rounded px-3 py-2 bg-gray-50 text-gray-900 text-sm focus:ring-2 focus:ring-[#10B481] outline-none transition"
          >
            <option v-for="c in categories" :key="c.id" :value="c.id">
              {{ c.categorie }}
            </option>
          </select>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm text-gray-600">{{
            t("justificatifUrl")
          }}</label>
          <div
            class="flex items-center gap-2 border border-gray-300 rounded px-3 py-2 bg-gray-50"
          >
            <i class="bx bx-link text-gray-500 text-lg"></i>
            <input
              v-model="justificatifUrl"
              type="url"
              maxlength="200"
              placeholder="Lien justificatif"
              class="flex-1 bg-transparent outline-none text-gray-900 text-sm"
            />
          </div>
        </div>

        <div class="md:col-span-2 flex justify-end">
          <button
            type="submit"
            class="px-6 py-2 rounded bg-[#10B481] text-white text-sm hover:bg-[#0d946e] transition flex items-center gap-2"
          >
            <i :class="editUserId ? 'bx bx-edit' : 'bx bx-user-plus'"></i>
            {{ editUserId ? t("edit") : t("add") }}
          </button>
        </div>
      </form>

      <p
        v-if="message"
        :class="['mt-4 p-3 rounded-lg text-sm font-medium', messageClass]"
      >
        {{ message }}
      </p>
    </div>

    <div class="flex border-b border-gray-200 mb-8">
      <button
        @click="showVerified = false"
        class="px-4 py-2 -mb-px text-sm font-medium transition flex items-center gap-1"
        :class="
          !showVerified
            ? 'border-b-2 border-[#10B481] text-[#10B481]'
            : 'text-gray-500 hover:text-gray-700'
        "
      >
        {{ t("userPending") }}
      </button>

      <button
        @click="showVerified = true"
        class="ml-6 px-4 py-2 -mb-px text-sm font-medium transition flex items-center gap-1"
        :class="
          showVerified
            ? 'border-b-2 border-[#10B481] text-[#10B481]'
            : 'text-gray-500 hover:text-gray-700'
        "
      >
        {{ t("userVerified") }}
      </button>
    </div>

    <!-- LISTE USERS - CARDS STYLE -->
    <div class="overflow-x-auto bg-white">
      <div class="grid grid-cols-12 bg-[#FAFAF9]">
        <div
          class="col-span-3 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
        >
          {{ t("user") }}
        </div>
        <div
          class="col-span-2 px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b text-center"
        >
          {{ t("category") }}
        </div>
        <div
          class="col-span-1 px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b text-center"
        >
          {{ t("verified") }}
        </div>
        <div
          class="col-span-1 px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b text-center"
        >
          {{ t("actif") }}
        </div>
        <div
          class="col-span-3 px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b text-center"
        >
          {{ t("justificatif") }}
        </div>
        <div
          class="col-span-2 px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b text-right"
        >
          {{ t("actions") }}
        </div>
      </div>

      <div
        v-for="u in paginatedUsers"
        :key="u.id"
        class="grid grid-cols-12 items-center px-5 py-4 bg-white border-b border-gray-200 rounded shadow-sm hover:shadow-md hover:bg-gray-50 transition"
      >
        <div
          class="col-span-3 flex items-center gap-2 cursor-pointer"
          @click="goToProfile(u)"
        >
          <img
            v-if="u.avatar_url"
            :src="u.avatar_url"
            alt="avatar"
            class="w-10 h-10 rounded-full object-cover"
          />

          <div
            v-else
            class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
            :class="getAvatarColor(u.username)"
          >
            {{ u.username.charAt(0).toUpperCase() }}
          </div>

          <div class="flex flex-col">
            <span class="font-semibold text-gray-900">{{ u.username }}</span>
            <span class="text-xs text-gray-500">{{ u.email }}</span>
          </div>
        </div>

        <div class="col-span-2 flex justify-center">
          <span
            class="px-3 py-1 bg-[#10b481]/10 border border-[#10b481] text-[#10b481] rounded-full text-xs"
          >
            {{ u.id_categorie_user?.categorie }}
          </span>
        </div>

        <div class="col-span-1 text-center">
          <i
            :class="
              u.is_verified
                ? 'bx bx-check-circle text-green-500'
                : 'bx bx-x-circle text-red-500'
            "
          ></i>
        </div>

        <div class="col-span-1 text-center">
          <i
            :class="
              u.is_active
                ? 'bx bx-check-circle text-green-500'
                : 'bx bx-x-circle text-red-500'
            "
          ></i>
        </div>

        <div class="col-span-3 truncate text-center">
          <button
            v-if="u.justificatif_url"
            @click="openDoc(u.justificatif_url)"
            class="text-gray-600 text-sm hover:underline hover:text-[#10b481]"
          >
            {{ t("viewDoc") }}
          </button>
          <span v-else>—</span>
        </div>

        <div class="col-span-2 flex justify-end gap-3">
          <button
            v-if="!u.is_verified"
            class="btn-neutre"
            @click="verifyUser(u.id)"
          >
            {{ t("verify") }}
          </button>

          <button
            v-if="!u.is_active"
            class="btn-primary"
            @click="activeUser(u.id)"
          >
            {{ t("activer") }}
          </button>

          <button
            class="text-red-600 hover:text-red-800 text-xl"
            @click="deleteUser(u.id)"
          >
            <i class="bx bx-trash"></i>
          </button>
        </div>
      </div>
      <div class="bg-white px-4 py-3 flex items-center justify-between sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            {{ t("prev") }}
          </button>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            {{ t("next") }}
          </button>
        </div>
        <div
          class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"
        >
          <div>
            <p class="text-sm text-gray-700">
              {{ t("affichage") }}
              <span class="font-medium">{{ currentPage }}</span> {{ t("a") }}
              <span class="font-medium">{{ totalPages }}</span> {{ t("sur") }}
              <span class="font-medium">{{ result }}</span> {{ t("résultats") }}
            </p>
          </div>
          <div>
            <nav
              class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span class="sr-only">{{ t("prev") }}</span>
                <i class="bx bx-chevron-left"></i>
              </button>

              <button
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                  currentPage === page
                    ? 'z-10 bg-[#10b481]/10 border-[#10b481] text-[#10b481]'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                ]"
                v-if="page !== '...'"
              >
                {{ page }}
              </button>
              <span v-else class="px-2">...</span>

              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span class="sr-only">{{ t("next") }}</span>
                <i class="bx bx-chevron-right"></i>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Modal justificatif -->
  <transition name="fade">
    <div
      v-if="showDocModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white p-16 rounded-lg max-w-[90vw] max-h-[90vh] overflow-auto relative"
      >
        <button
          @click="showDocModal = false"
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-2xl"
        >
          &times;
        </button>

        <div
          v-if="currentDocUrl"
          class="w-full h-full flex justify-center items-center"
        >
          <iframe
            v-if="isPdf(currentDocUrl)"
            :src="currentDocUrl"
            class="w-full h-full"
            frameborder="0"
          ></iframe>
          <img
            v-else
            :src="currentDocUrl"
            alt="Justificatif"
            class="max-w-full max-h-full object-contain"
          />
        </div>
      </div>
    </div>
  </transition>

  <transition name="slide-right">
    <div
      v-if="notification.visible"
      class="fixed bottom-4 right-4 z-[9999] bg-[#112830] rounded shadow-xl px-6 py-4 flex items-center gap-4 w-80 text-left border-l-4 transition-all duration-300"
      :class="
        notification.type === 'success' ? 'border-[#10b481]' : 'border-red-500'
      "
    >
      <div
        :class="notification.type === 'success' ? 'bg-[#10b481]' : 'bg-red-500'"
        class="w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl"
      >
        <i
          :class="notification.type === 'success' ? 'bx bx-check' : 'bx bx-x'"
        ></i>
      </div>
      <div>
        <p class="font-medium text-sm text-gray-100">
          {{ notification.message }}
        </p>
        <p class="text-gray-300 text-xs">
          {{
            notification.type === "success"
              ? "Success!"
              : "Something went wrong."
          }}
        </p>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
definePageMeta({ layout: "dashboard" });
import { ref, onMounted } from "vue";
import { API_URL } from "~/utils/config";
import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";
import { useRouter } from "vue-router";
import Breadcrumb from "~/components/Breadcrumb.vue";
const router = useRouter();

const languageStore = useLanguageStore();
const t = (key: string) => {
  const lang = languageStore.lang;
  return translate[lang][key] || key;
};

const showUserForm = ref(false);

const username = ref("");
const email = ref("");
const password = ref("");
const categorieUserId = ref("");
const justificatifUrl = ref("");
const editUserId = ref<number | null>(null);

const users = ref<any[]>([]);
const categories = ref<any[]>([]);

const message = ref("");
const messageClass = ref("");

function toggleUserForm() {
  showUserForm.value = !showUserForm.value;
  if (!showUserForm.value) resetForm();
}

const avatarColors = [
  "bg-red-200 text-red-700",
  "bg-orange-200 text-orange-700",
  "bg-amber-200 text-amber-700",
  "bg-lime-200 text-lime-700",
  "bg-green-200 text-green-700",
  "bg-teal-200 text-teal-700",
  "bg-cyan-200 text-cyan-700",
  "bg-blue-200 text-blue-700",
  "bg-indigo-200 text-indigo-700",
  "bg-purple-200 text-purple-700",
  "bg-pink-200 text-pink-700",
];

function getAvatarColor(username: string) {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

function resetForm() {
  username.value = "";
  email.value = "";
  password.value = "";
  categorieUserId.value = "";
  justificatifUrl.value = "";
  editUserId.value = null;
}

const showVerified = ref(false);

const filteredUsers = computed(() =>
  users.value.filter((u) =>
    showVerified.value ? u.is_verified : !u.is_verified
  )
);

function toggleShowVerified() {
  showVerified.value = !showVerified.value;
}

const notification = ref({ visible: false, message: "", type: "success" });

const showNotification = (
  message: string,
  type: "success" | "error" = "success",
  duration = 3000
) => {
  notification.value.message = message;
  notification.value.type = type;
  notification.value.visible = true;
  setTimeout(() => (notification.value.visible = false), duration);
};

async function fetchUsers() {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${API_URL}/api/users/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.ok) {
    users.value = await res.json();
    result.value = users.value.length;
    console.log("Users:", JSON.stringify(users.value, null, 2));
  } else if (res.status === 401) {
    message.value = "Non autorisé : veuillez vous reconnecter.";
    messageClass.value = "bg-red-100 text-red-800";
  } else {
    message.value = "Erreur lors du chargement des utilisateurs.";
    messageClass.value = "bg-red-100 text-red-800";
  }
}

async function fetchCategories() {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${API_URL}/api/categorieuser/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (res.ok) {
    categories.value = await res.json();
  } else if (res.status === 401) {
    message.value = "Non autorisé : veuillez vous reconnecter.";
    messageClass.value = "bg-red-100 text-red-800";
  } else {
    message.value = "Erreur lors du chargement des catégories.";
    messageClass.value = "bg-red-100 text-red-800";
  }
}

async function submitUser() {
  const token = localStorage.getItem("access_token");
  const payload = {
    username: username.value,
    email: email.value,
    password: password.value,
    id_categorie_user_id: categorieUserId.value,
    justificatif_url: justificatifUrl.value,
  };

  const url = editUserId.value
    ? `${API_URL}/api/users/${editUserId.value}/`
    : `${API_URL}/api/users/`;
  const method = editUserId.value ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (res.ok) {
    message.value = editUserId.value
      ? "Utilisateur modifié !"
      : "Utilisateur ajouté !";
    messageClass.value = "bg-green-100 text-green-800";

    await fetchUsers();
    resetForm();
    showUserForm.value = false;
  } else {
    message.value = "Erreur : " + JSON.stringify(data);
    messageClass.value = "bg-red-100 text-red-800";
  }
}

function startEditUser(u: any) {
  showUserForm.value = true;
  editUserId.value = u.id;
  username.value = u.username;
  email.value = u.email;
  password.value = "";
  categorieUserId.value = u.id_categorie_user_id;
  justificatifUrl.value = u.justificatif_url;
}

async function deleteUser(id: number) {
  if (!confirm("Supprimer cet utilisateur ?")) return;
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${API_URL}/api/users/${id}/`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.ok) fetchUsers();
}

onMounted(() => {
  fetchUsers();
  fetchCategories();
});

async function verifyUser(userId: number) {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${API_URL}/api/users/${userId}/verify/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (res.ok) {
    showNotification("Utilisateur vérifié!", "success");
    fetchUsers();
  } else {
    const data = await res.json();
    showNotification("Erreur : " + JSON.stringify(data), "success");
  }
}

async function activeUser(userId: number) {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${API_URL}/api/users/${userId}/activer/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (res.ok) {
    showNotification("Utilisateur vérifié!", "success");
    fetchUsers();
  } else {
    const data = await res.json();
    showNotification("Erreur : " + JSON.stringify(data), "success");
  }
}

const currentPage = ref(1);
const itemsPerPage = 6;

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredUsers.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() =>
  Math.ceil(filteredUsers.value.length / itemsPerPage)
);

const result = computed(() => filteredUsers.value.length);

const nextPage = () =>
  currentPage.value < totalPages.value && currentPage.value++;
const prevPage = () => currentPage.value > 1 && currentPage.value--;

const visiblePages = computed(() => {
  const pages = [];
  if (totalPages.value <= 15) {
    for (let i = 1; i <= totalPages.value; i++) pages.push(i);
  } else {
    if (currentPage.value <= 7) {
      pages.push(
        ...Array.from({ length: 8 }, (_, i) => i + 1),
        "...",
        totalPages.value
      );
    } else if (currentPage.value >= totalPages.value - 6) {
      pages.push(
        1,
        "...",
        ...Array.from({ length: 8 }, (_, i) => totalPages.value - 7 + i)
      );
    } else {
      pages.push(
        1,
        "...",
        currentPage.value - 2,
        currentPage.value - 1,
        currentPage.value,
        currentPage.value + 1,
        currentPage.value + 2,
        "...",
        totalPages.value
      );
    }
  }
  return pages;
});

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
}

function goToProfile(user: { id: any }) {
  router.push(`/admin/users/${user.id}`);
}

const showDocModal = ref(false);
const currentDocUrl = ref("");

function openDoc(url: string) {
  currentDocUrl.value = url;
  showDocModal.value = true;
}

function isPdf(url: string) {
  return url.endsWith(".pdf");
}
</script>

<style>
/* Pour les scrollbars modernes */
.scrollbar-thin {
  scrollbar-width: thin;
}
.scrollbar-thumb-rounded {
  scrollbar-color: #9ca3af #f3f4f6; /* thumb color / track color */
}
.scrollbar-thumb-rounded::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.scrollbar-thumb-rounded::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 8px;
}
.scrollbar-thumb-rounded::-webkit-scrollbar-thumb {
  background-color: #9ca3af;
  border-radius: 8px;
  border: 2px solid #f3f4f6;
}
</style>
