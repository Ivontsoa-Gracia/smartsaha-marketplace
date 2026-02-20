<template>
  <div class="space-y-8 p-12 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Mes paiements</h1>
      </div>

      <div
        class="flex items-center gap-3 border border-gray-200 rounded px-4 py-2 bg-white shadow-sm transition mb-20"
      >
        <!-- Search -->
        <div class="relative flex-1">
          <i
            class="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          ></i>
          <input
            v-model="filterSearch"
            type="text"
            class="w-full pl-10 pr-3 py-2 text-sm bg-transparent focus:outline-none text-gray-800 placeholder-gray-400"
            placeholder="Rechercher utilisateur ou annonce"
          />
        </div>

        <!-- Divider -->
        <div class="w-px h-6 bg-gray-200"></div>

        <input
          type="date"
          v-model="filterDate"
          class="text-sm text-gray-600 bg-transparent focus:outline-none cursor-pointer hover:text-gray-800 transition"
        />

        <!-- Divider -->
        <div class="w-px h-6 bg-gray-200"></div>

        <!-- Date filter -->
        <select
          v-model="filterType"
          class="text-sm text-gray-600 bg-transparent focus:outline-none cursor-pointer hover:text-gray-800 transition"
        >
          <option value="all">Tous</option>
          <option value="sent">Paiements effectués</option>
          <option value="received">Paiements reçus</option>
        </select>
      </div>

      <div v-if="loading" class="text-center py-10">Chargement...</div>

      <div
        v-else-if="payments.length === 0"
        class="text-center py-10 text-gray-500"
      >
        Aucun paiement trouvé.
      </div>

      <div v-else class="overflow-x-auto bg-white rounded-2xl shadow-sm">
        <table class="w-full border-collapse">
          <thead class="bg-gray-50">
            <tr>
              <th
                @click="sortBy('transaction_date')"
                class="cursor-pointer px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wide border-b text-left"
              >
                Date <i class="bxr bx-carets-up-down"></i>
              </th>
              <th
                @click="sortBy('bid.post.title')"
                class="cursor-pointer px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wide border-b text-left"
              >
                Annonce <i class="bxr bx-carets-up-down"></i>
              </th>
              <th
                @click="sortBy('amount')"
                class="cursor-pointer px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wide border-b text-left"
              >
                Montant <i class="bxr bx-carets-up-down"></i>
              </th>
              <th
                class="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wide border-b text-left"
              >
                Utilisateur
              </th>
              <th
                class="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wide border-b text-center"
              >
                {{ t("status") }}
              </th>
              <th
                class="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wide border-b text-center"
              >
                {{ t("actions") }}
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="payment in paginatedPayments"
              :key="payment.id"
              class="hover:bg-gray-50 transition-colors duration-150"
            >
              <!-- Date -->
              <td class="px-6 py-3 text-sm text-gray-700 border-b">
                {{ formatDate(payment.transaction_date) }}
              </td>

              <!-- Annonce -->
              <td class="px-6 py-3 text-sm text-gray-700 border-b font-medium">
                {{ payment.bid.post.title }}
              </td>

              <!-- Montant -->
              <td class="px-6 py-3 text-sm text-gray-700 border-b font-medium">
                {{ payment.amount }} {{ payment.currency }}
              </td>

              <!-- Utilisateur -->
              <td class="px-6 py-3 text-sm text-gray-900 border-b">
                <span v-if="user?.username === payment.seller">
                  De <strong>{{ payment.buyer }}</strong>
                </span>
                <span v-else-if="user?.username === payment.buyer">
                  À <strong>{{ payment.seller }}</strong>
                </span>
                <span v-else>-</span>
              </td>

              <!-- Status -->
              <td class="px-6 py-3 border-b text-center">
                <span
                  class="px-3 py-1 rounded-full text-sm font-semibold border"
                  :class="statusClass(payment.status)"
                >
                  {{ payment.status }}
                </span>
              </td>

              <!-- Actions -->
              <td class="px-6 py-3 border-b text-center">
                <div class="flex items-center justify-center gap-2">
                  <button
                    v-if="
                      !payment.buyer_confirmation &&
                      isLoggedIn &&
                      user?.username === payment.buyer
                    "
                    @click="confirmBuyerPayment(payment)"
                    class="px-4 py-2 bg-[#10b481] text-white text-xs rounded-lg  transition"
                    title="Confirmer paiement"
                  >
                    Confirmer
                  </button>

                  <button
                    v-else-if="
                      !payment.seller_confirmation &&
                      isLoggedIn &&
                      user?.username === payment.seller
                    "
                    @click="confirmSellerPayment(payment)"
                    class="px-4 py-2 bg-[#10b481] text-white text-xs rounded-lg  transition"
                    title="Confirmer paiement"
                  >
                    Confirmer
                  </button>

                  <button
                    class="p-2 rounded-full hover:bg-red-100 transition"
                    title="Supprimer"
                  >
                    <i class="bx bx-trash text-red-600 text-lg"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div
          class="bg-white px-4 py-4 flex items-center justify-between sm:px-6"
        >
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
                <span class="font-medium">{{ currentPage }}</span>
                {{ t("a") }}
                <span class="font-medium">{{ totalPages }}</span>
                {{ t("sur") }} <span class="font-medium">{{ result }}</span>
                {{ t("résultats") }}
              </p>
            </div>
            <div>
              <nav
                class="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  @click="prevPage"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span class="sr-only">{{ t("prev") }}</span
                  ><i class="bx bx-chevron-left"></i>
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
                  <span class="sr-only">{{ t("next") }}</span
                  ><i class="bx bx-chevron-right"></i>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: "dashboard" });
import { ref, onMounted } from "vue";
import { API_URL } from "~/utils/config";
import { parseISO, formatDistanceToNow } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { useLanguageStore } from "~/stores/language";

const payments = ref([]);
const loading = ref(true);
const user = ref(null);
const isLoggedIn = ref(false);
const languageStore = useLanguageStore();
const t = (key) => translate[languageStore.lang][key] || key;

const result = ref(0);
const currentPage = ref(1);
const itemsPerPage = 4;
const sortKey = ref(null);
const sortAsc = ref(true);
const filterSearch = ref("");
const filterDate = ref("");
const filterType = ref("all");

function statusClass(status) {
  switch (status) {
    case "awaiting_payment":
      return "border-yellow-400 text-yellow-500 bg-yellow-100/50"; // en attente → jaune clair
    case "funds_secured":
      return "border-blue-500 text-blue-600 bg-blue-100/50"; // fonds sécurisés → bleu léger
    case "completed":
      return "border-[#10b481] text-[#10b481] bg-[#10b481]/10"; // payé → vert primary
    case "cancelled":
      return "border-red-400 text-red-600 bg-red-100/50"; // annulé → rouge clair
    case "failed":
      return "border-red-600 text-red-700 bg-red-200/50"; // échec → rouge foncé
    default:
      return "border-gray-300 text-gray-700 bg-gray-100/50"; // état par défaut → gris neutre
  }
}


// Vérifie l'utilisateur connecté
async function checkUser() {
  const token = localStorage.getItem("access_token");
  if (!token) return;

  try {
    const res = await fetch(`${API_URL}/api/me/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Unauthorized");
    const data = await res.json();
    user.value = data; // { username, ... }
    isLoggedIn.value = true;
  } catch {
    isLoggedIn.value = false;
  }
}

// Charge les paiements
async function loadPayments() {
  const token = localStorage.getItem("access_token");
  try {
    const res = await fetch(`${API_URL}/payments/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Erreur lors du chargement");
    payments.value = await res.json();
    console.log("Payments", JSON.stringify(payments.value, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

const filteredPayments = computed(() => {
  let data = [...payments.value];

  // Filtre par recherche
  if (filterSearch.value) {
    const search = filterSearch.value.toLowerCase();
    data = data.filter(
      (p) =>
        p.buyer?.toLowerCase().includes(search) ||
        p.seller?.toLowerCase().includes(search) ||
        p.bid?.post?.title?.toLowerCase().includes(search)
    );
  }

  // Filtre par date
  if (filterDate.value) {
    data = data.filter((p) => p.transaction_date?.startsWith(filterDate.value));
  }

  // Filtre par type
  if (filterType.value !== "all" && user.value) {
    if (filterType.value === "sent") {
      data = data.filter((p) => p.buyer === user.value.username);
    }
    if (filterType.value === "received") {
      data = data.filter((p) => p.seller === user.value.username);
    }
  }

  // Tri
  if (sortKey.value) {
    data.sort((a, b) => {
      const keys = sortKey.value.split(".");
      let valA = keys.reduce((acc, k) => acc?.[k], a) || "";
      let valB = keys.reduce((acc, k) => acc?.[k], b) || "";

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return sortAsc.value ? -1 : 1;
      if (valA > valB) return sortAsc.value ? 1 : -1;
      return 0;
    });
  }

  result.value = data.length;
  return data;
});

// Fonction pour changer la clé de tri
function sortBy(key) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value; // inverse si même clé
  } else {
    sortKey.value = key;
    sortAsc.value = true; // tri croissant par défaut
  }
}

const totalPages = computed(() =>
  Math.ceil(filteredPayments.value.length / itemsPerPage)
);

const paginatedPayments = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredPayments.value.slice(start, start + itemsPerPage);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};
const goToPage = (page) => {
  currentPage.value = page;
};

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

// Confirme le paiement côté acheteur
async function confirmBuyerPayment(payment) {
  const token = localStorage.getItem("access_token");
  try {
    const res = await fetch(
      `${API_URL}/payments/${payment.id}/confirm-buyer/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          buyer_confirmation: true,
          amount: payment.amount,
          buyer: payment.buyer,
          seller: payment.seller,
          bid: payment.bid,
          currency: payment.currency,
        }),
      }
    );
    if (!res.ok) throw new Error("Erreur lors de la confirmation");
    payment.buyer_confirmation = true; // mise à jour live
    alert("Paiement confirmé avec succès !");
  } catch (err) {
    console.error(err);
    alert("Impossible de confirmer le paiement.");
  }
}

async function confirmSellerPayment(payment) {
  const token = localStorage.getItem("access_token");
  try {
    const res = await fetch(
      `${API_URL}/payments/${payment.id}/confirm-seller/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          buyer_confirmation: true,
          amount: payment.amount,
          buyer: payment.buyer,
          seller: payment.seller,
          bid: payment.bid,
          currency: payment.currency,
        }),
      }
    );
    if (!res.ok) throw new Error("Erreur lors de la confirmation");
    payment.buyer_confirmation = true; // mise à jour live
    alert("Paiement confirmé avec succès !");
  } catch (err) {
    console.error(err);
    alert("Impossible de confirmer le paiement.");
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const date = parseISO(dateStr.replace(/\.(\d{3})\d+Z$/, ".$1Z"));
  const diffDays = Math.floor(
    (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays > 7)
    return date.toLocaleDateString(
      languageStore.lang === "fr" ? "fr-FR" : "en-US",
      { year: "numeric", month: "short", day: "numeric" }
    );
  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: languageStore.lang === "fr" ? fr : enUS,
  });
};

onMounted(async () => {
  await checkUser(); // Récupère l'utilisateur connecté
  await loadPayments(); // Charge les paiements
});
</script>
