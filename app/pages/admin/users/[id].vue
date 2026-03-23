<template>
  <div class="space-y-8 p-12 min-h-screen">
    <div v-if="!user.id" class="text-gray-500">
      <div
        class="w-8 h-8 border-4 border-gray-300 border-t-[#10b481] rounded-full animate-spin"
      ></div>
    </div>
    <div class="flex items-center gap-4 mb-10">
      <img
        v-if="user.avatar_url"
        :src="user.avatar_url"
        alt="avatar"
        class="w-20 h-20 rounded-full object-cover"
      />

      <div
        v-else
        class="w-20 h-20 rounded-full flex items-center username justify-center font-bold text-4xl"
        :class="getAvatarColor(user.username)"
      >
        {{ user.username.charAt(0).toUpperCase() }}
      </div>

      <div>
        <h1 class="text-2xl font-bold username text-gray-900">
          {{ user.username }}
        </h1>
        <p class="text-gray-600 small text-sm">{{ user.email }}</p>

        <div class="mt-1 flex items-center gap-8">
          <p
            class="text-sm flex items-center gap-1 small"
            :class="user.is_verified ? 'text-[#10b481]' : 'text-red-600'"
          >
            <i
              :class="user.is_verified ? 'bx bx-badge-check' : 'bx bx-error'"
            ></i>
            {{
              user.is_verified ? t("verifiedAccount") : t("notverifiedAccount")
            }}
          </p>

          <button
            v-if="!user.is_verified"
            class="btn-primary"
            @click="verifyUser(user.id)"
          >
            {{ t("verify") }}
          </button>
        </div>
      </div>
    </div>

    <div class="mb-12">
      <div
        class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
      >
        <div>
          <h3 class="subtitle">
            {{ t("userReview") }}
          </h3>
          <div class="flex items-center gap-1 mt-2">
            <template v-for="star in 5" :key="star">
              <i
                class="bxr text-xl"
                :class="
                  star <= Math.round(user.rating_avg || 0)
                    ? 'bxs-star text-yellow-400'
                    : 'bxs-star bx-star-empty text-gray-300'
                "
              ></i>
            </template>
            <span class="text-gray-500 text-sm ml-2 small">
              ({{ (user.rating_avg || 0).toFixed(1) }})
            </span>
          </div>
        </div>

        <button
          @click="toggleSlideReport"
          class="inline-flex items-center gap-2 btn-neutre transition"
        >
          {{ t("viewReports") }}
          <i class="bxr bx-arrow-right-stroke-circle text-xl"></i>
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 small">
        <div
          class="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition duration-300"
        >
          <div class="flex items-center justify-between">
            <p
              class="text-xs font-medium text-gray-400 uppercase tracking-wide"
            >
              {{ t("category") }}
            </p>
            <div
              class="w-10 h-10 flex items-center justify-center rounded-xl"
            ></div>
          </div>
          <h2 class="text-xl mt-4">
            {{ user.id_categorie_user?.categorie }}
          </h2>
        </div>

        <div
          class="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition duration-300"
        >
          <div class="flex items-center justify-between">
            <p
              class="text-xs font-medium text-gray-400 uppercase tracking-wide"
            >
              {{ t("status") }}
            </p>
            <div
              class="w-10 h-10 flex items-center justify-center rounded-xl"
            ></div>
          </div>
          <h2 class="text-xl mt-4">
            {{ user.is_active ? t("actif") : t("inactif") }}
          </h2>
        </div>

        <div
          class="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition duration-300"
        >
          <div class="flex items-center justify-between">
            <p
              class="text-xs font-medium text-gray-400 uppercase tracking-wide"
            >
              {{ t("annonces") }}
            </p>
            <div
              class="w-10 h-10 flex items-center justify-center rounded-xl bg-[#10b481]/10 text-[#10b481]"
            >
              <i class="bx bx-clipboard text-lg"></i>
            </div>
          </div>
          <h2 class="text-3xl mt-4">
            {{ posts.length }}
          </h2>
        </div>

        <div
          class="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition duration-300"
        >
          <div class="flex items-center justify-between">
            <p
              class="text-xs font-medium text-gray-400 uppercase tracking-wide"
            >
              {{ t("reports") }}
            </p>
            <div
              class="w-10 h-10 flex items-center justify-center rounded-xl bg-red-600/10 text-red-600"
            >
              <i class="bx bx-error text-lg"></i>
            </div>
          </div>
          <h2 class="text-3xl mt-4">
            {{ totalReports }}
          </h2>
        </div>
      </div>

      <div
        class="mt-8 border-t pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-gray-500"
      >
        <span class="small">
          {{ t("justificatif") }} :
          <strong class="small-medium">
            {{ user.justificatif_url ? t("available") : t("notAvailable") }}
          </strong>
        </span>

        <a
          v-if="user.justificatif_url"
          :href="user.justificatif_url"
          target="_blank"
          class="text-[#10b481] font-medium hover:underline small"
        >
          {{ t("viewDoc") }}
        </a>
      </div>
    </div>

    <h2 class="subtitle mb-4">
      {{ t("annonces") }}
    </h2>

    <div v-if="posts.length === 0" class="text-gray-500">
      {{ t("noAnnoncesFound") }}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card
        v-for="post in posts"
        :key="post.id"
        :post="post"
        class="flex-shrink-0 w-80"
      />
    </div>
  </div>

  <transition name="fade">
    <div
      v-if="slideReportOpen"
      class="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
      @click="toggleSlideReport"
    ></div>
  </transition>

  <transition name="slide-right">
    <div
      v-if="slideReportOpen"
      class="fixed top-0 right-0 w-[450px] h-screen bg-[#fafaf9] z-40 flex flex-col shadow-xl"
    >
      <div class="flex items-center justify-between px-5 py-4 border-b">
        <div class="flex items-center gap-2">
          <h2 class="subtitle">
            {{ t("reportstitle") }}
          </h2>
        </div>

        <button
          @click="toggleSlideReport"
          class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#fafaf9] text-gray-400 transition"
        >
          <i class="bx bx-x text-lg"></i>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        <div
          v-for="group in groupedReports"
          :key="group.postId"
          class="bg-[#fafaf9] rounded-xl border border-gray-100 p-6 hover:shadow-sm transition"
        >
          <h3 class="text-sm small-medium text-gray-700 mb-1 line-clamp-2">
            {{ getPostById(group.postId)?.title || `Post #${group.postId}` }}
          </h3>

          <p class="text-xs text-gray-500 mb-3 small">
            {{ group.reports.length }} report(s)
          </p>

          <button
            v-if="group.reports.some((r) => r.status === 'pending')"
            @click="openConfirmModal(group.postId)"
            class="w-full mb-4 btn-decline"
          >
            {{ t("approveReports") }}
          </button>

          <ul class="space-y-2">
            <li
              v-for="r in group.reports"
              :key="r.id"
              class="flex items-center justify-between text-sm"
            >
              <div class="flex items-center gap-2">
                <img
                  v-if="getUserById(r.id_user)?.avatar_url"
                  :src="getUserById(r.id_user)?.avatar_url"
                  alt="avatar"
                  class="w-8 h-8 rounded-full object-cover"
                />

                <div
                  v-else
                  class="w-8 h-8 rounded-full flex items-center username justify-center font-bold text-sm"
                  :class="getAvatarColor(getUserById(r.id_user)?.username)"
                >
              {{ getUserById(r.id_user)?.username.charAt(0).toUpperCase() }}
              </div>
                

                <span class="content truncate max-w-[170px]">
                  {{ r.reason }}
                </span>
              </div>

              <span
                class="text-xs px-2 py-1 rounded-full justify-center items-center small border"
                :class="
                  r.status === 'pending'
                    ? 'bg-[#f4a261]/10 border-[#f4a261] text-[#f4a261]'
                    : 'bg-[#10b481]/10 border-[#10b481] text-[#10b481]'
                "
              >
                {{ r.status }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </transition>

  <transition name="fade">
    <div
      v-if="confirmModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    >
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h3 class="subtitle mb-3">
          {{ t("confirmDelete") }}
        </h3>

        <p class="content mb-6" v-html="t('confirmDeleteReport')"></p>

        <div class="flex justify-end gap-3">
          <button
            @click="closeConfirmModal"
            class="btn-neutre"
          >
            {{ t("cancel") }}
          </button>

          <button
            @click="confirmApprove"
            class="btn-decline"
          >
            {{ t("confirm") }}
          </button>
        </div>
      </div>
    </div>
  </transition>

  <transition name="slide-down">
    <div
      v-if="notification.visible"
      class="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg"
    >
      <div
        :class="[
          'flex items-start justify-between gap-4 px-6 py-4 rounded-xl shadow-xl border backdrop-blur-md transition-all',
          notification.type === 'success' && 'bg-white border-[#10b481]/30',
          notification.type === 'error' && 'bg-white border-red-400/40',
          notification.type === 'inactive' && 'bg-white border-white',
        ]"
      >
        <div class="flex items-start gap-4">
          <div
            :class="[
              'w-10 h-10 rounded-full flex items-center justify-center',
              notification.type === 'success' &&
                'bg-[#10b481]/15 text-[#10b481]',
              notification.type === 'error' && 'bg-red-100 text-red-500',
              notification.type === 'inactive' && 'bg-red-500/20 text-red-500',
            ]"
          >
            <i
              :class="[
                'text-xl',
                notification.type === 'success' && 'bx bx-check',
                notification.type === 'error' && 'bx bx-x',
                notification.type === 'inactive' && 'bx bx-lock-alt',
              ]"
            ></i>
          </div>

          <div>
            <p class="text-gray-700 username text-sm">
              {{ notification.message }}
            </p>

            <p
              v-if="notification.type === 'inactive'"
              class="text-xs text-gray-600 small mt-1"
            >
              {{ t("accountinactive") }}
            </p>

            <p
              v-if="notification.type === 'success'"
              class="text-xs text-gray-600 small mt-1"
            >
            Success!
            </p>

            <p
              v-if="notification.type === 'error'"
              class="text-xs text-gray-600 small mt-1"
            >
            Something went wrong.
            </p>
          </div>
        </div>

        <button
          @click="closeNotification"
          class="text-gray-400 hover:text-gray-700 transition"
        >
          <i class="bx bx-x text-xl"></i>
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
definePageMeta({ layout: "dashboard" });

import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
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

const route = useRoute();

const user = ref<any>({
  username: "",
  email: "",
  id_categorie_user: { categorie: "" },
  justificatif_url: "",
  is_verified: false,
  is_active: false,
  id: null,
});

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

const notification = ref({
  visible: false,
  message: "",
  type: "success" as "success" | "error" | "inactive",
});

const showNotification = (
  message: string,
  type: "success" | "error" | "inactive" = "success",
  duration = 5000
) => {
  notification.value = { visible: true, message, type };

  if (duration) {
    setTimeout(() => {
      notification.value.visible = false;
    }, duration);
  }
};

const closeNotification = () => {
  notification.value.visible = false;
};

const posts = ref<any[]>([]);

function getColor(name?: string) {
  if (!name) return "hsl(0, 0%, 70%)";
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 60%, 45%)`;
}

async function fetchUser() {
  const id = route.params.id;
  const token = localStorage.getItem("access_token");

  const res = await fetch(`${API_URL}/api/users/${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.ok) user.value = await res.json();
  await fetchUserRating(id);
}

async function fetchPosts() {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${API_URL}/api/posts/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.ok) {
    const all = await res.json();
    if (user.value.id) {
      posts.value = all.filter((p: any) => p.user?.id === user.value.id);
      console.log(
        "Posts de l'utilisateur :",
        JSON.stringify(posts.value, null, 2)
      );
    } else {
      posts.value = [];
    }
  }
}

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
    showNotification("Utilisateur vérifié !", "success", 7000);
    fetchUser();
  } else {
    const data = await res.json();
    alert("Erreur : " + JSON.stringify(data));
    showNotification(JSON.stringify(data), "error", 7000);

  }
}

const reports = ref<any[]>([]);
async function fetchReport() {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${API_URL}/api/reports/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.ok) {
    const all = await res.json();
    // reports.value = all;
    reports.value = all.filter(
      (r: any) =>
        r.id_post !== null && posts.value.some((p: any) => p.id === r.id_post)
    );
    console.log(
      "Signalement de l'utilisateur :",
      JSON.stringify(reports.value, null, 2)
    );
  } else {
    reports.value = [];
  }
}

const totalReports = computed(() => reports.value.length);

const slideReportOpen = ref(false);
function toggleSlideReport() {
  slideReportOpen.value = !slideReportOpen.value;
}

const groupedReports = computed(() => {
  const map: Record<number, any> = {};

  for (const report of reports.value) {
    const postId = report.id_post;
    if (!map[postId]) {
      map[postId] = {
        postId,
        reports: [],
      };
    }
    map[postId].reports.push(report);
  }

  return Object.values(map);
});

const confirmModalOpen = ref(false);
const selectedPostId = ref<number | null>(null);

function openConfirmModal(postId: number) {
  selectedPostId.value = postId;
  confirmModalOpen.value = true;
}

function closeConfirmModal() {
  confirmModalOpen.value = false;
  selectedPostId.value = null;
}

async function approveReport() {
  if (!selectedPostId.value) return;

  const token = localStorage.getItem("access_token");

  const res = await fetch(`${API_URL}/api/reports/approve/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ post_id: selectedPostId.value }),
  });

  const data = await res.json();

  if (!res.ok) {
    alert(
      "Erreur : " +
        (data.detail || data.error || "Impossible d'approuver les reports")
    );
    return;
  }

  alert("Tous les reports du post approuvés et post supprimé");

  // Refresh
  await fetchPosts();
  await fetchReport();

  closeConfirmModal();
}

async function confirmApprove() {
  if (!selectedPostId.value) return;

  await approveReport(selectedPostId.value);
  closeConfirmModal();
}

function getPostById(postId: number) {
  return posts.value.find((p) => p.id === postId);
}

const users = ref<any[]>([]);
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
    console.log("Users:", JSON.stringify(users.value, null, 2));
  } else if (res.status === 401) {
    router.push("/login");
  } else {
    users.value = [];
  }
}

function getUserById(userId: number) {
  return users.value.find((u) => u.id === userId);
}

async function fetchUserRating(userId: number) {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${API_URL}/api/reviews/user/${userId}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.ok) {
    const data = await res.json();
    user.value.rating_avg = data.average_rating || 0;
  } else {
    user.value.rating_avg = 0;
  }
}

onMounted(async () => {
  await fetchUser();
  await fetchPosts();
  await fetchReport();
  await fetchUsers();
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-right-enter-active {
  transition: transform 0.3s ease;
}
.slide-right-leave-active {
  transition: transform 0.3s ease;
}
.slide-right-enter-from {
  transform: translateX(100%);
}
.slide-right-enter-to {
  transform: translateX(0%);
}
.slide-right-leave-from {
  transform: translateX(0%);
}
.slide-right-leave-to {
  transform: translateX(100%);
}
</style>
