<template>
  <div class="space-y-8 p-12 bg-gray-50/60 min-h-screen">
    <Breadcrumb />
    <h1 class="text-2xl font-bold mb-4">{{ t("validationPosts") }}</h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div
        v-for="post in draftPosts"
        :key="post.id"
        class="bg-white rounded-3xl shadow-sm p-1 w-full max-w-[600px] border border-gray-100"
      >
        <div class="relative h-72 group">
          <img
            v-if="post.image_url"
            :src="post.image_url"
            class="absolute inset-0 w-full h-full object-cover rounded-2xl"
          />
          <div
            v-else
            class="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-500 rounded-2xl"
          >
            No image
          </div>

          <div
            class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent rounded-2xl"
          ></div>

          <div class="absolute top-4 left-4 z-10 flex items-center gap-3">
            <img
              v-if="post.user?.avatar_url"
              :src="post.user?.avatar_url"
              alt="avatar"
              class="w-10 h-10 rounded-full object-cover"
            />

            <div
              v-else
              class="w-10 h-10 bg-[#10b481] text-white rounded-full flex items-center justify-center font-bold text-lg"
            >
              {{ post.user?.username.charAt(0).toUpperCase() }}
            </div>

            <div class="text-white">
              <div class="font-semibold leading-tight">
                {{ post.user?.username }}
              </div>
              <div class="text-xs text-white/80">
                {{ formattedDate(post.updated_at) }}
              </div>
            </div>
          </div>

          <div class="absolute bottom-4 left-4 flex flex-row gap-3">
            <span
              class="rounded-full px-3 py-1 text-xs text-gray-600 shadow z-10"
              :class="
                post.type_post?.type === 'Selling'
                  ? 'bg-white/90'
                  : 'bg-white/90'
              "
            >
              {{ post.type_post?.type }}
            </span>
            <div
              class="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs text-gray-600 shadow z-10"
            >
              <i class="bx bx-location-plus"></i>
              <span>{{ post.location || "Localisation inconnue" }}</span>
            </div>
          </div>
        </div>

        <div class="p-6 space-y-2">
          <h2 class="text-xl font-bold text-gray-900 leading-snug">
            {{ post.title || "Sans titre" }}
          </h2>

          <p class="text-gray-700 text-sm leading-relaxed">
            {{
              showFullDescription
                ? post.description
                : post.description?.slice(0, 120) +
                  (post.description?.length > 120 ? "..." : "")
            }}
            <button
              v-if="post.description?.length > 120"
              @click="toggleDescription"
              class="text-[#10b481] ml-1 hover:underline"
            >
              {{ showFullDescription ? "Voir moins" : "Voir plus" }}
            </button>
          </p>

          <div
            class="w-full grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 bg-white overflow-hidden"
          >
            <div class="px-2 flex flex-col gap-1 text-gray-700">
              <div
                class="flex items-center justify-start gap-2 text-gray-900 font-semibold"
              >
                <i class="bx bx-package text-lg text-gray-700"></i>
                <span class="text-sm text-gray-700">{{
                  post.product?.product
                }}</span>
              </div>
            </div>

            <div class="px-2 flex flex-col gap-1 text-gray-700">
              <div
                class="flex items-center justify-center gap-2 text-gray-900 font-semibold"
              >
                <i class="bx bx-cube text-lg text-gray-700"></i>
                <span class="text-sm text-gray-700">
                  {{ post.quantity }} {{ post.product?.unit?.abbreviation }}
                </span>
              </div>
            </div>

            <div class="px-2 flex flex-col gap-1 text-gray-700">
              <div
                class="flex items-center justify-end gap-2 text-gray-900 font-semibold"
              >
                <i class="bx bx-wallet text-lg text-gray-700"></i>
                <span class="text-sm text-gray-700">
                  {{ post.price }} {{ post.currency?.symbol }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between gap-4 w-full pt-6">
            <div class="flex flex-wrap gap-2">
              <span
                v-for="label in post.labels"
                :key="label.id"
                :style="{
                  backgroundColor: `${label.color}20`,
                  borderColor: label.color,
                  color: label.color,
                }"
                class="px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap"
              >
                {{ label.name }}
              </span>
            </div>
          </div>

          <div class="flex gap-2 pt-10">
            <button
              class="flex-1 btn-primary"
              @click="openValidationModal(post.id, true)"
            >
              {{ t("validate") }}
            </button>
            <button
              class="flex-1 btn-decline"
              @click="openValidationModal(post.id, false)"
            >
              {{ t("reject") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="loading" class="flex justify-center mt-10">
    <div
      class="w-8 h-8 border-4 border-gray-300 border-t-[#10b481] rounded-full animate-spin"
    ></div>
  </div>

  <div
    v-if="showValidationModal"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
      <h3 class="text-lg font-semibold mb-4">
        {{ isValidAction ? t("validatePost") : t("rejectPost") }}
      </h3>
      <textarea
        v-model="validationMessage"
        placeholder="Message optionnel..."
        class="w-full border border-gray-300 rounded-lg p-2 resize-none h-24 mb-4"
      ></textarea>
      <div class="flex justify-end gap-3">
        <button
          class="btn-neutre"
          @click="closeValidationModal"
        >
          {{ t("cancel") }}
        </button>
        <button
          :class="isValidAction ? 'btn-primary' : 'btn-decline'"
          @click="submitValidation"
        >
          {{ t("confirm") }}
        </button>
      </div>
    </div>
  </div>

  <transition name="slide-right">
    <div
      v-if="notification.visible"
      class="fixed bottom-4 right-4 z-[9999] bg-[#112830] rounded-2xl shadow-xl px-6 py-4 flex items-center gap-4 w-80 text-left border-l-4 transition-all duration-300"
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

<script setup>
definePageMeta({ layout: "dashboard" });
import { ref, onMounted, computed } from "vue";
import { API_URL } from "~/utils/config";
import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";
import { parseISO, formatDistanceToNow } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import Breadcrumb from "~/components/Breadcrumb.vue";

const languageStore = useLanguageStore();
const t = (key) => translate[languageStore.lang][key] || key;

const posts = ref([]);
const loading = ref(false);

const showFullDescription = ref(false);
function toggleDescription() {
  showFullDescription.value = !showFullDescription.value;
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
function getAvatarColor(username) {
  let hash = 0;
  for (let i = 0; i < username.length; i++)
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

// const draftPosts = computed(() => posts.value);
const draftPosts = computed(() =>
  posts.value.filter((post) => post.current_status === "brouillon")
);

const formattedDate = (dateStr) => {
  if (!dateStr) return "-";

  try {
    // Tronquer les microsecondes si présentes
    const cleanDateStr = dateStr.replace(/\.(\d{3})\d+Z$/, ".$1Z");

    const date = parseISO(cleanDateStr);

    const diffDays = Math.floor(
      (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays > 7) {
      return date.toLocaleDateString(
        languageStore.lang === "fr" ? "fr-FR" : "en-US",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        }
      );
    }

    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: languageStore.lang === "fr" ? fr : enUS,
    });
  } catch (e) {
    console.error("Invalid date:", dateStr);
    return "-";
  }
};

const showValidationModal = ref(false);
const validationMessage = ref("");
const currentPostId = ref(null);
const isValidAction = ref(true);

function openValidationModal(postId, isValid) {
  currentPostId.value = postId;
  isValidAction.value = isValid;
  validationMessage.value = "";
  showValidationModal.value = true;
}
function closeValidationModal() {
  showValidationModal.value = false;
  validationMessage.value = "";
}

const notification = ref({ visible: false, message: "", type: "success" });
function showNotification(message, type = "success", duration = 3000) {
  notification.value = { visible: true, message, type };
  setTimeout(() => (notification.value.visible = false), duration);
}

async function submitValidation() {
  try {
    const token = localStorage.getItem("access_token");
    const response = await fetch(
      `${API_URL}/api/posts/${currentPostId.value}/validation_post/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment: validationMessage.value }),
      }
    );
    const data = await response.json();
    if (response.ok) {
      showNotification(data.message, "success");
      await fetchPosts();
      closeValidationModal();
    } else showNotification("Erreur: " + JSON.stringify(data), "error");
  } catch (err) {
    console.error(err);
    showNotification("Erreur serveur.", "error");
  }
}

async function fetchPosts() {
  loading.value = true;
  try {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${API_URL}/api/posts/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (response.ok) posts.value = data;
    else
      showNotification("Erreur: impossible de récupérer les posts.", "error");
  } catch (err) {
    console.error(err);
    showNotification("Erreur serveur.", "error");
  }
  loading.value = false;
}

onMounted(fetchPosts);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
