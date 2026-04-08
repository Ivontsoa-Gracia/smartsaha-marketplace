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
        class="relative bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4 overflow-hidden"
      >
        <!-- <div class="absolute top-0 left-0 w-full h-1 bg-[#10b481] rounded-b-2xl"></div> -->

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <img
              v-if="bid.post_detail?.user?.avatar_url"
              :src="bid.post_detail?.user?.avatar_url"
              alt="avatar"
              class="w-9 h-9 rounded-full cursor-pointer shadow object-cover"
            />

            <div
              v-else
              class="w-9 h-9 rounded-full flex items-center justify-center username text-md cursor-pointer shadow"
              :class="getAvatarColor(bid.post_detail?.user?.username)"
              @click="goToProfile(bid.post_detail?.user)"
            >
              {{ bid.post_detail?.user?.username.charAt(0).toUpperCase() }}
            </div>

            <div>
              <p class="text-sm username text-gray-700">
                {{ bid.post_detail?.user?.username || "Utilisateur" }}
              </p>
              <p class="text-xs text-gray-400 small">
                {{ formattedDate(bid.created_at) }}
              </p>
            </div>
          </div>

          <span
            class="px-3 py-1 border rounded-full text-xs small-medium flex items-center justify-center gap-1"
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
            {{
              bid.current_status?.name?.charAt(0).toUpperCase() +
              bid.current_status?.name?.slice(1)
            }}
          </span>
        </div>

        <div class="flex gap-2 items-center small-medium text-gray-700">
          <i class="bx bx-clipboard text-sm"></i>
          <h2 class="text-sm leading-snug">
            {{ bid.post?.title || "Post sans titre" }}
          </h2>
        </div>

        <div class="bg-white border border-gray-200 rounded-xl p-3">
          <p class="text-xs text-gray-400 smalll mb-1">
            {{ t("monOffre") }}
          </p>
          <p class="content">
            {{ bid.message }}
          </p>
        </div>

        <div class="flex gap-3">
          <div
            class="flex-1 flex items-center gap-2 bg-ahite border border-gray-200 rounded-xl p-2 text-sm small-medium"
          >
            <i class="bx bx-wallet text-gray-700"></i>
            <span class="text-gray-700">
              {{ bid.price || "-" }}
              {{ bid.post_detail?.currency?.symbol || "-" }}
            </span>
          </div>

          <div
            class="flex-1 flex items-center gap-2 bg-ahite border border-gray-200 rounded-xl p-2 text-sm small-medium"
          >
            <i class="bx bx-package text-gray-700"></i>
            <span class="text-gray-700">
              {{ bid.post_detail?.quantity || "-" }}
              {{ bid.post_detail?.product?.unit?.abbreviation || "-" }}
            </span>
          </div>
        </div>

        <div class="flex justify-between items-center pt-2">
          <button
            @click="openPostModal(bid.post_detail)"
            class="menu-item hover:underline"
          >
            {{ t("gotopost") }}
          </button>

          <button
            v-if="bid.current_status?.name !== 'acceptée'"
            @click="openCancelModal(bid.id)"
            class="text-sm text-red-600 small hover:underline"
          >
            {{ t("btnCancel") }}
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-400 small mt-12">
      {{ t("noFoundMyBid") }}
    </div>
  </div>

  <div
    v-if="showCancelModal"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-2xl p-6 w-80">
      <h3 class="subtitle mb-4">{{ t("comfirmCancel") }}</h3>
      <p class="mb-6 content">{{ t("confirmText") }}</p>
      <div class="flex justify-end gap-3">
        <button @click="showCancelModal = false" class="btn-neutre">
          {{ t("cancel") }}
        </button>
        <button @click="confirmCancelBid" class="btn-decline">
          {{ t("confirm") }}
        </button>
      </div>
    </div>
  </div>

  <transition name="fade">
    <div
      v-if="modalOpen"
      class="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-"
    >
      <div
        class="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh] relative p-6"
      >
        <button
          @click="closeModal"
          class="absolute top-4 right-4 text-gray-400 text-xl hover:text-gray-700 transition"
        >
          <i class="bx bx-x"></i>
        </button>

        <div class="flex flex-col md:flex-row gap-6">
          <div class="md:w-1/2 relative">
            <img
              v-if="selectedPost.image_url"
              :src="selectedPost.image_url"
              alt="product"
              class="w-full h-80 md:h-[32rem] object-cover rounded-2xl shadow-md"
            />
            <div
              v-else
              class="w-full h-80 md:h-[32rem] bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 font-medium"
            >
              No image available
            </div>
            <div
              class="absolute inset-0 rounded-2xl pointer-events-none"
              style="
                background: linear-gradient(
                  to bottom,
                  rgba(17, 40, 48, 0.4),
                  rgba(17, 40, 48, 0),
                  rgba(17, 40, 48, 0.4)
                );
              "
            ></div>

            <div
              class="absolute top-4 left-4 right-4 flex justify-between items-start"
            >
              <div class="flex flex-col gap-2">
                <div class="flex items-center gap-2">
                  <img
                    v-if="selectedPost.user?.avatar_url"
                    :src="selectedPost.user?.avatar_url"
                    alt="avatar"
                    class="w-11 h-11 rounded-full cursor-pointer shadow object-cover"
                  />

                  <div
                    v-else
                    class="w-11 h-11 rounded-full flex items-center justify-center username text-lg cursor-pointer shadow"
                    :class="getAvatarColor(selectedPost.user?.username)"
                    @click="goToProfile(selectedPost.user)"
                  >
                    {{ selectedPost.user?.username.charAt(0).toUpperCase() }}
                  </div>

                  <div class="text-white">
                    <div class="username leading-tight">
                      {{ selectedPost.user?.username }}
                    </div>
                    <div class="text-xs small">
                      {{ formattedDate(selectedPost.updated_at) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="absolute top-4 right-4 flex items-center gap-3 z-10">
              <button
                @click="addToFavorite"
                :disabled="favoriteLoading"
                class="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow hover:scale-110 transition"
                :class="isFavorite ? 'text-red-600' : 'text-gray-600'"
              >
                <i
                  :class="isFavorite ? 'bx bxs-heart' : 'bx bx-heart'"
                  class="text-xl"
                ></i>
              </button>

              <div class="relative">
                <button
                  @click="toggleReportMenu"
                  class="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow hover:scale-110 transition"
                >
                  <i
                    class="bx bx-dots-vertical-rounded text-xl text-gray-600"
                  ></i>
                </button>

                <div
                  v-if="showReportMenu"
                  class="absolute right-0 mt-2 w-36 bg-white rounded shadow-lg border z-20"
                >
                  <button
                    @click="openReportModal"
                    class="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50 rounded"
                  >
                    Signaler
                  </button>
                </div>
              </div>
            </div>

            <div class="absolute bottom-4 left-4 flex flex-row gap-3 small">
              <span
                class="rounded-full px-3 py-1 text-xs text-gray-600 shadow z-10"
                :class="
                  selectedPost.type_post?.type === 'Selling'
                    ? 'bg-white/90'
                    : 'bg-white/90'
                "
              >
                {{ selectedPost.type_post?.type }}
              </span>
              <div
                class="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs text-gray-600 shadow z-10"
              >
                <i class="bx bx-location-plus"></i>
                <span>{{
                  selectedPost.location || "Localisation inconnue"
                }}</span>
              </div>
            </div>
          </div>

          <div class="md:w-1/2 flex flex-col justify-between gap-4 py-6">
            <div>
              <h2 class="subtitle text-gray-900 mb-3">
                {{ selectedPost.title || "Product Name" }}
              </h2>

              <p class="content mb-3 text-sm">
                {{ selectedPost.description || "No description available." }}
              </p>

              <div
                class="flex-1 flex flex-col gap-2 text-gray-700 text-sm justify-between pt-4"
              >
                <div
                  class="w-full grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 bg-white overflow-hidden"
                >
                  <div class="px-2 flex flex-col gap-1items">
                    <div class="flex items-center justify-start gap-2 items">
                      <i class="bx bx-cube text-lg"></i>
                      <span class="text-sm">{{
                        selectedPost.product?.product
                      }}</span>
                    </div>
                  </div>

                  <div class="px-2 flex flex-col gap-1">
                    <div class="flex items-center justify-center gap-2 items">
                      <i class="bx bx-package text-lg"></i>
                      <span class="text-sm">
                        {{ selectedPost.quantity }}
                        {{ selectedPost.product?.unit?.abbreviation }}
                      </span>
                    </div>
                  </div>

                  <div class="px-2 flex flex-col gap-1">
                    <div class="flex items-center justify-end gap-2 items">
                      <i class="bx bx-wallet text-lg"></i>
                      <span class="text-sm">
                        {{ Number(selectedPost.price).toLocaleString() }}
                        {{ selectedPost.currency?.symbol }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-wrap gap-2">
              <span
                v-for="label in selectedPost.labels"
                :key="label.id"
                :style="{
                  backgroundColor: `${label.color}`,
                  // backgroundColor: `${label.color}20`,
                  // borderColor: label.color,
                  // color: label.color,
                }"
                class="px-3 py-1 rounded-full text-xs text-white small border whitespace-nowrap"
              >
                {{ label.name }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
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
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

const bids = ref([]);
const loading = ref(false);
const errorMsg = ref("");
const showFullDesc = reactive({});

const fetchMyBids = async () => {
  loading.value = true;
  errorMsg.value = "";
  try {
    const res = await fetch(`${API_URL}/api/bids/my_bids/`, {
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
    errorMsg.value = "Erreur lors du chargement des enchères";
  } finally {
    loading.value = false;
  }
};

const formatBidDate = (bid) => {
  if (!bid.created_at) return "";
  const date = new Date(bid.created_at);
  const daysDiff = differenceInDays(new Date(), date);

  if (daysDiff <= 3) {
    return formatDistanceToNow(date, { addSuffix: true, locale: fr });
  } else {
    return format(date, "dd MMM yyyy", { locale: fr });
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

const toggleDesc = (id) => {
  showFullDesc[id] = !showFullDesc[id];
};

const showCancelModal = ref(false);
const bidToCancel = ref(null);

const openCancelModal = (bidId) => {
  bidToCancel.value = bidId;
  showCancelModal.value = true;
};

const confirmCancelBid = async () => {
  if (!bidToCancel.value) return;

  try {
    const res = await fetch(`${API_URL}/api/bids/${bidToCancel.value}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    if (!res.ok) throw new Error("Erreur lors de l'annulation");

    showCancelModal.value = false;
    bidToCancel.value = null;

    await fetchMyBids(); // rafraîchir la liste
  } catch (err) {
    console.error(err);
    alert("Impossible d'annuler l'enchère.");
  }
};

const modalOpen = ref(false);
const selectedPost = ref({});

const openPostModal = (post) => {
  selectedPost.value = post;
  console.log(
    "Post selected :",
    JSON.parse(JSON.stringify(selectedPost.value, null, 2))
  );

  modalOpen.value = true;
};

const closeModal = () => {
  modalOpen.value = false;
};

onMounted(fetchMyBids);
</script>

<style scoped>
div:hover {
  transition: all 0.3s ease;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
