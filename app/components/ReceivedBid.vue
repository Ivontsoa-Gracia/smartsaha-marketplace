<template>
  <div class="">
    <div v-if="loading" class="flex justify-center mt-10">
      <div
        class="w-8 h-8 border-4 border-gray-300 border-t-[#10b481] rounded-full animate-spin"
      ></div>
    </div>
    <div v-if="errorMsg" class="text-center text-red-500">{{ errorMsg }}</div>

    <div
      v-if="bids.length"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="bid in bids"
        :key="bid.id"
        class="relative bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4 overflow-hidden"
      >
        <!-- <div class="absolute top-0 left-0 w-full h-1 bg-[#10b481]"></div> -->

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
              :class="getAvatarColor(bid.user?.username)"
            >
              {{ bid.user?.username?.charAt(0).toUpperCase() || "U" }}
            </div>

            <div>
              <p class="text-sm font-medium text-gray-900">
                {{ bid.user?.username || "Utilisateur" }}
              </p>
              <p class="text-xs text-gray-400">
                {{ formattedDate(bid.created_at) }}
              </p>
            </div>
          </div>

          <span
            class="px-3 py-1 border rounded-full text-xs font-medium flex items-center justify-center gap-1"
            :class="{
              'bg-yellow-100 border-yellow-500 text-yellow-500':
                bid.current_status?.name === 'proposée',
              'bg-[#10b481]/10 border-[#10b481] text-[#10b481]':
                bid.current_status?.name === 'acceptée',
              'bg-[#10b481]/10 border-[#10b481] text-[#10b481]':
                bid.current_status?.name === 'payée',
              'bg-red-100 border-red-600 text-red-600':
                bid.current_status?.name === 'arrêtée' ||
                bid.current_status?.name === 'annulée' ||
                bid.current_status?.name === 'refusée',
            }"
          >
            <i
              v-if="
                (bid.current_status?.name === 'acceptée' ||
                  bid.current_status?.name === 'proposée') &&
                bid.is_highest
              "
              class="bx bxs-star text-sm"
            ></i>
            {{ bid.current_status?.name?.charAt(0).toUpperCase() + bid.current_status?.name?.slice(1) }}
          </span>
        </div>

        <h2 class="text-sm font-semibold text-gray-900 leading-snug">
          {{ bid.post?.title || "Post sans titre" }}
        </h2>

        <div class="bg-gray-50 border border-gray-200 rounded p-3">
          <p class="text-xs text-gray-500 mb-1">
            {{ t("monOffre") }}
          </p>
          <p class="text-sm text-gray-700">
            {{ bid.message }}
          </p>
        </div>

        <div class="flex gap-3">
          <div
            class="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded p-2 text-sm"
          >
            <i class="bx bx-wallet text-gray-500"></i>
            <span class="text-gray-800">
              {{ bid.price || "-" }}
              {{ bid.post_detail?.currency?.symbol || "-" }}
            </span>
          </div>

          <div
            class="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded p-2 text-sm"
          >
            <i class="bx bx-package text-gray-500"></i>
            <span class="text-gray-800">
              {{ bid.post_detail?.quantity || "-" }}
              {{ bid.post_detail?.product?.unit?.abbreviation || "-" }}
            </span>
          </div>
        </div>

        <div class="flex justify-between items-center pt-2">
          <NuxtLink
            :to="`/dashboard/post/bids/${bid.post.id}`"
            class="text-sm text-gray-600 hover:underline"
          >
            {{ t("gotopost") }}
          </NuxtLink>

          <NuxtLink
          v-if="bid.current_status?.name === 'proposée'"
          :to="`/dashboard/chatbox?post=${bid.post.id}&bid=${bid.id}`"
          class="text-sm text-[#10b481] hover:underline"
        >
          {{ t("negocier") }}
        </NuxtLink>
        </div>


      </div>
    </div>

    <div v-else class="text-center text-gray-500 mt-12">
      {{ t("noReceivedBidFound") }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { API_URL } from "~/utils/config";
import { parseISO, formatDistanceToNow } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";
import { useRouter } from "vue-router";
const router = useRouter();

const languageStore = useLanguageStore();
const t = (key) => {
  const lang = languageStore.lang;
  return translate[lang][key] || key;
};

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
  if (!username) return avatarColors[0];
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

const bids = ref([]);
const loading = ref(false);
const errorMsg = ref("");

const fetchReceivedBids = async () => {
  loading.value = true;
  errorMsg.value = "";
  try {
    const res = await fetch(`${API_URL}/api/bids/received_bids/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    if (!res.ok) throw new Error("Erreur lors de la récupération des enchères");
    const data = await res.json();

    // Récupérer chaque post séparément
    for (const bid of data) {
      try {
        const postRes = await fetch(`${API_URL}/api/posts/${bid.post.id}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        const postData = await postRes.json();
        bid.post_detail = postData; // Attacher le post au bid
      } catch (err) {
        console.error(`Erreur post ${bid.post.id}:`, err);
        bid.post_detail = {};
      }
    }

    bids.value = data;
    console.log("Mes bids avec post:", JSON.stringify(bids.value, null, 2));
  } catch (err) {
    console.error(err);
    errorMsg.value = "Erreur lors du chargement des enchères reçues";
  } finally {
    loading.value = false;
  }
};

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

onMounted(fetchReceivedBids);
</script>
