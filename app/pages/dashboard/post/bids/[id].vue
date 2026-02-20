<template>
  <div class="flex h-full">
    <div class="flex-1 space-y-8 p-8">
      <Breadcrumb />
      <h2 class="text-2xl font-bold text-gray-800">
        {{ t("bidFor") }} "{{ postTitle }}"
      </h2>

      <div
        v-if="bids.length"
        class="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2"
      >
        <div
          v-for="bid in bids"
          :key="bid.id"
          class="relative bg-white rounded-2xl p-5 border transition-all duration-300"
          :class="
            bid.is_highest
              ? 'border-[#10b481]/50 bg-[#f0fdf8]'
              : 'border-gray-200'
          "
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div
                class="w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg"
                :class="getAvatarColor(bid.user.username)"
              >
                {{ bid.user.username.charAt(0).toUpperCase() }}
              </div>

              <div class="flex flex-col leading-tight">
                <span class="font-medium text-gray-900 text-sm">
                  {{ bid.user.username }}
                </span>
                <div class="flex items-center gap-1 text-xs text-gray-400">
                  <span>{{ formattedDate(bid.created_at) }}</span>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <span
                class="px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1"
                :class="{
                  'bg-yellow-100 border-yellow-500 text-yellow-500':
                    bid.current_status?.name === 'proposée',
                  'bg-[#10b481]/10 border-[#10b481] text-[#10b481]':
                    bid.current_status?.name === 'acceptée',
                    'bg-[#10b481]/10 border-[#10b481] text-[#10b481]':
                    bid.current_status?.name === 'payée',
                  'bg-red-100 border-red-600 text-red-600':
                    bid.current_status?.name === 'refusée',
                  'bg-gray-100 border-gray-400 text-gray-400': ['arrêtée', 'annulée'].includes(
                    bid.current_status?.name
                  ),
                }"
              >
                <template
                  v-if="
                    ['acceptée', 'proposée'].includes(
                      bid.current_status?.name
                    ) && bid.is_highest
                  "
                >
                  <i class="bx bxs-star text-sm"></i>
                </template>
                {{
                  bid.current_status?.name
                    ? bid.current_status.name.charAt(0).toUpperCase() +
                      bid.current_status.name.slice(1)
                    : "Enchère"
                }}
              </span>
            </div>
          </div>

          <div class="bg-gray-50 border border-gray-200 rounded p-3 mt-4">
            <p class="text-sm text-gray-700 leading-relaxed">
              {{ truncated(bid.message, 150) }}
            </p>
          </div>

          <div class="flex gap-3 mt-4">
            <div
              class="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded p-2 text-sm"
            >
              <i class="bx bx-package text-gray-500"></i>
              <span class="text-gray-800">
                {{ postDetails?.quantity }}
                {{ postDetails?.product?.unit?.abbreviation }}
              </span>
            </div>

            <div
              class="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded p-2 text-sm"
            >
              <i
                class="bx bx-wallet"
                :class="bid.is_highest ? 'text-[#10b481]' : 'text-gray-800'"
              ></i>
              <span
                class="font-semibold"
                :class="bid.is_highest ? 'text-[#10b481]' : 'text-gray-800'"
              >
                {{ bid.price }} {{ bid.currency.symbol }}
              </span>
            </div>
          </div>

          <hr class="my-4 border-gray-200" />

          <!-- ACTIONS -->
          <div class="flex justify-between items-center">
            <NuxtLink
              v-if="bid.current_status?.name === 'proposée'"
              :to="`/dashboard/chatbox?post=${bid.post.id}&bid=${bid.id}`"
              class="text-sm font-medium text-[#10b481] hover:opacity-80 transition"
            >
              {{ t("negocier") }}
            </NuxtLink>
            <button
              v-if="
                !postDetails?.accepted_bid &&
                !['refusée', 'annulée','arrêtée', 'supprimée'].includes(
                  bid.current_status?.name
                )
              "
              class="bg-[#10b481] text-white text-sm w-1/2 py-2 rounded shadow hover:bg-[#10b481]/80 transition"
              @click="openBidConfirmation(bid, 'accept')"
            >
              {{ t("btnaccept") }}
            </button>

          </div>
        </div>
      </div>

      <div v-else class="text-gray-500 italic">
        {{ t("noBidFound") }}
      </div>
    </div>

    <div
      class="hidden lg:flex w-96 border-l border-[#f1f1f1] bg-[#fff] p-4 overflow-y-auto justify-center"
    >
      <div
        class="fixed rounded shadow-sm border border-white/5 overflow-hidden mt-6 w-[350px]"
      >
        <div v-if="postDetails?.image_url" class="relative">
          <div class="relative w-full rounded-2xl overflow-hidden shadow-sm">
            <img
              v-if="postDetails.image_url"
              :src="postDetails.image_url"
              class="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
              alt="Post image"
            />
            <div
              v-else
              class="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 font-medium"
            >
              No image
            </div>

            <div
              class="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs text-gray-700 shadow z-10"
            >
              <i class="bx bx-time"></i>
              <span>{{ t("publishedOn") }} {{ getPublishedDate() }}</span>
            </div>

            <div class="absolute bottom-3 left-3 flex flex-wrap gap-2">
              <span
                class="px-3 py-1 text-xs font-medium rounded-full text-gray-700 bg-white/90 shadow z-10"
              >
                {{ postDetails.type_post?.type || "Type inconnu" }}
              </span>

              <div
                class="flex items-center gap-1 px-3 py-1 text-xs text-gray-700 font-medium rounded-full bg-white/90 shadow z-10"
              >
                <i class="bx bx-location-plus"></i>
                <span>{{ postDetails.location || "Localisation inconnue" }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 flex flex-col gap-2">
          <h3 class="text-2xl font-bold text-gray-700">
            {{ postDetails?.title }}
          </h3>
          <p class="text-gray-600 text-sm leading-relaxed">
            {{ postDetails?.description }}
          </p>

          <div class="flex flex-wrap gap-3 pt-3">
            <div
              class="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded p-2 text-sm"
            >
              <i class="bx bx-package text-gray-500"></i>
              <span class="text-gray-800">
                {{ postDetails?.product?.product }}
              </span>
            </div>

            <div
              class="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded p-2 text-sm"
            >
              <i class="bx bx-package text-gray-500"></i>
              <span class="text-gray-800">
                {{ postDetails?.quantity }}
                {{ postDetails?.product?.unit?.abbreviation }}
              </span>
            </div>

            <div
              class="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded p-2 text-sm"
            >
              <i class="bx bx-wallet text-gray-500"></i>
              <span class="text-gray-800">
                {{ postDetails?.price }}
                {{ postDetails?.currency?.symbol }}
              </span>
            </div>
          </div>
          <div class="flex flex-wrap gap-2 pt-3">
            <span
              v-for="label in postDetails?.labels"
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
      </div>
    </div>
  </div>
  <div
    v-if="confirmBidOpen"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30"
  >
    <div class="bg-white rounded p-6 w-96">
      <h3 class="text-lg font-semibold mb-4">
        {{
          bidAction === "accept"
            ? "Confirmer l’acceptation"
            : "Confirmer le refus"
        }}
      </h3>
      <p class="mb-4">
        {{
          bidAction === "accept"
            ? "Voulez-vous vraiment accepter cette enchère ?"
            : "Voulez-vous vraiment refuser cette enchère ? Cette action est irréversible."
        }}
      </p>

      <div v-if="bidAction === 'decline'" class="mb-4">
        <label class="block text-sm mb-1">{{ t("MsgBuyer") }} :</label>
        <textarea
          v-model="declineMessage"
          class="w-full border rounded p-2"
          rows="3"
        ></textarea>
      </div>

      <div class="flex justify-end gap-3">
        <button
          @click="cancelBid"
          class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          {{ t("cancel") }}
        </button>
        <button
          @click="performBidAction"
          :class="
            bidAction === 'accept'
              ? 'bg-[#10b481] hover:bg-[#10b481]/90'
              : 'bg-red-600 hover:bg-red-700'
          "
          class="px-4 py-2 text-white rounded"
        >
          {{ bidAction === "accept" ? t("btnAccept") : t("btnDecline") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: "dashboard" });
import { ref, onMounted } from "vue";
import { parseISO, formatDistanceToNow } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { useRoute } from "vue-router";
import { API_URL } from "~/utils/config";
import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";
import { useRouter } from "vue-router";
import Breadcrumb from "~/components/Breadcrumb.vue";
const router = useRouter();

const languageStore = useLanguageStore();
const t = (key) => {
  const lang = languageStore.lang;
  return translate[lang][key] || key;
};

const route = useRoute();
const postId = route.params.id;

const bids = ref([]);
const postTitle = ref("");
const postDetails = ref(null);

const truncated = (text, length = 60) =>
  text.length > length ? text.slice(0, length) + "..." : text;

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

const getPublishedDate = () => {
  const history = postDetails.value?.status_history;
  if (!history) return null;

  const published = history.find((h) => h.status === "published");

  return published ? formattedDate(published.date_changed) : null;
};

const fetchBids = async () => {
  try {
    const res = await fetch(`${API_URL}/api/posts/${postId}/bids/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    if (!res.ok) throw new Error("Erreur lors de la récupération des enchères");
    const data = await res.json();
    bids.value = data;
    console.log("Bids:", JSON.stringify(bids.value, null, 2));

    postTitle.value = data[0]?.post?.title || "Post";
  } catch (err) {
    console.error(err);
  }
};

const fetchPostDetails = async () => {
  try {
    const res = await fetch(`${API_URL}/api/posts/${postId}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    if (!res.ok) throw new Error("Erreur lors du chargement du post");
    postDetails.value = await res.json();
    console.log("Post details:", JSON.stringify(postDetails.value, null, 2));
  } catch (err) {
    console.error(err);
  }
};
onMounted(() => {
  fetchPostDetails();
  fetchBids();
});

async function api(url, method = "GET", body = null) {
  const token = localStorage.getItem("access_token");
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return await res.json();
}

const confirmBidOpen = ref(false);
const bidToConfirm = ref(null);
const bidAction = ref(null);
const declineMessage = ref("");

function openBidConfirmation(bid, action) {
  bidToConfirm.value = bid;
  bidAction.value = action;
  declineMessage.value = "";
  confirmBidOpen.value = true;
}

function cancelBid() {
  confirmBidOpen.value = false;
  bidToConfirm.value = null;
  bidAction.value = null;
  declineMessage.value = "";
}

async function performBidAction() {
  if (!bidToConfirm.value || !bidAction.value) return;

  try {
    if (bidAction.value === "accept") {
      await acceptBid(bidToConfirm.value);
    } else if (bidAction.value === "decline") {
      if (!declineMessage.value.trim()) {
        alert("Veuillez saisir un message pour l'acheteur !");
        return;
      }
      await declineBidWithMessage(bidToConfirm.value, declineMessage.value);
    }
  } catch (err) {
    console.error(err);
  } finally {
    cancelBid();
  }
}

async function declineBidWithMessage(bid, message) {
  const payload = {
    continue_negotiation: false,
    message: message,
  };
  const res = await api(
    `${API_URL}/api/bids/${bid.id}/reject/`,
    "POST",
    payload
  );
  console.log("Bid rejected:", res);
  await fetchBids();
}

async function acceptBid(bid) {
  if ((bid.current_status.name || "").toLowerCase() !== "proposée") {
    console.warn(
      "Cette enchère ne peut pas être acceptée :",
      bid.current_status
    );
    return;
  }

  const payload = {
    price: bid.price.toString(),
    post_id: bid.post_id,
    message: bid.message || "",
    is_active: bid.is_active ?? true,
    currency_id: bid.currency_id || null,
  };

  try {
    const res = await api(
      `${API_URL}/api/bids/${bid.id}/accept/`,
      "POST",
      payload
    );
    console.log("Bid accepted:", res);
    await fetchBids();
  } catch (err) {
    console.error("Erreur acceptBid :", err);
  }
}

async function declineBid(bid) {
  if (!bid?.id) return console.warn("Enchère invalide !");

  const continueNegotiation = !!confirm(
    "Voulez-vous continuer la négociation ?"
  );
  let msg = "";

  if (!continueNegotiation) {
    msg = prompt("Veuillez saisir un message pour l'acheteur");
    if (!msg) return alert("Message requis pour arrêter la négociation !");
  }

  const payload = {
    continue_negotiation: continueNegotiation,
    message: msg,
  };

  try {
    const res = await api(
      `${API_URL}/api/bids/${bid.id}/reject/`,
      "POST",
      payload
    );
    console.log("Bid rejected:", res);

    if (res.status >= 400) {
      console.warn("Erreur côté API :", res.status, res.data || res);
      alert(
        "Erreur lors du refus de l'enchère : " + JSON.stringify(res.data || res)
      );
      return;
    }

    await fetchBids();

    if (!continueNegotiation) {
      console.warn("La négociation est terminée avec l'acheteur.");
      return;
    }
    console.warn("La négociation continue avec l'acheteur.");
  } catch (err) {
    console.error("Erreur declineBid :", err.response?.data || err);
    alert(
      "Erreur lors du refus de l'enchère : " +
        JSON.stringify(err.response?.data || err)
    );
  }
}
</script>
