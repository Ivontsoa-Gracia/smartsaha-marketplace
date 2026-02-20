<template>
  <div class="space-y-8 p-12 bg-gray-50/60">
    <Breadcrumb />

    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Mes paiements</h1>
      </div>

      <div
      class="flex items-center gap-3 border border-gray-200 rounded px-4 py-2 bg-white shadow-sm  transition mb-20"
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

      <input type="date" v-model="filterDate" class="text-sm text-gray-600 bg-transparent focus:outline-none cursor-pointer hover:text-gray-800 transition" />

      <!-- Divider -->
      <div class="w-px h-6 bg-gray-200"></div>

      <!-- Date filter -->
      <select v-model="filterType" class="text-sm text-gray-600 bg-transparent focus:outline-none cursor-pointer hover:text-gray-800 transition">
          <option value="all">Tous</option>
          <option value="sent">Paiements effectués</option>
          <option value="received">Paiements reçus</option>
        </select>
    </div>

      <!-- Table -->
      <div 
      v-if="filteredPayments.length"
      class="overflow-x-auto bg-white rounded shadow-sm"
      >
        <table class="min-w-[700px] w-full text-left border-collapse">
          <thead class="bg-[#FAFAF9]">
            <tr>
              <th class="cursor-pointer px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Date <i class="bxr bx-carets-up-down"></i></th>
              <th class="cursor-pointer px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Montant <i class="bxr bx-carets-up-down"></i></th>
              <th class="cursor-pointer px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Méthode <i class="bxr bx-carets-up-down"></i></th>
              <th class="cursor-pointer px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Référence</th>
              <th class="cursor-pointer px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Utilisateur <i class="bxr bx-carets-up-down"></i></th>
              <th class="cursor-pointer px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Post <i class="bxr bx-carets-up-down"></i></th>
              <th class="cursor-pointer px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Type</th>
              <th
              class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
            >
              {{ t("status") }}
            </th>
            <th
              class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b text-center"
            >
              {{ t("actions") }}
            </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="payment in filteredPayments" :key="payment.id" class="hover:bg-gray-50 transition">
              <td class="px-6 py-3 border-b text-sm text-gray-900">{{ formatDate(payment.payment_date || payment.created_at) }}</td>
              <td class="px-6 py-3 border-b text-sm text-gray-900 font-semibold">{{ payment.amount }} {{ payment.bid.currency.symbol }}</td>
              <td class="px-6 py-3 border-b text-sm text-gray-900">{{ payment.payment_method }}</td>
              <td class="px-6 py-3 border-b text-sm text-gray-900">{{ payment.transaction_reference }}</td>
              <td class="px-6 py-3 border-b text-sm text-gray-900">
                <span v-if="payment.type === 'received'">De <strong>{{ payment.fromUser }}</strong></span>
                <span v-else-if="payment.type === 'sent'">À <strong>{{ payment.toUser }}</strong></span>
                <span v-else>-</span>
              </td>
              <td class="px-6 py-3 border-b text-sm text-gray-900 ">{{ payment.postTitle }}</td>
              <td class="px-6 py-3 border-b text-sm text-gray-900">
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium border"
                  :class="payment.type === 'sent' ? 'bg-blue-100 text-blue-700 border-blue-700' : 'bg-[#10b481]/10 text-[#10b481] border-[#10b481]'"
                >
                  {{ payment.type === 'sent' ? 'Payé' : 'Reçu' }}
                </span>
              </td>
              <td class="px-6 py-3 border-b text-sm text-gray-900">
                <span class="px-2 py-1 rounded-full text-xs font-medium border" :class="statusClass(payment.status)">
                  {{ payment.status }}
                </span>
              </td>
              <td class="px-6 py-3 border-b text-center">
              <div class="flex items-center justify-center gap-2">
                <button
                  class="p-2 rounded hover:bg-[#e63946]/10 transition"
                  title="Supprimer"
                >
                  <i class="bx bx-trash text-[#e63946] text-lg"></i>
                </button>
              </div>
            </td>
            </tr>

            <tr v-if="!filteredPayments.length">
              <td colspan="8" class="text-center py-6 text-gray-400">Aucun paiement trouvé</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { API_URL } from "~/utils/config"
import Breadcrumb from "~/components/Breadcrumb.vue"
import { parseISO, formatDistanceToNow } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";
definePageMeta({ layout: "dashboard" })

// =========================
// State
// =========================
const payments = ref([])
const filterType = ref("all")
const filterDate = ref("")
const filterSearch = ref("")
const user = ref(null)
const isLoggedIn = ref(false)
const userId = ref(null)

const router = useRouter();
const languageStore = useLanguageStore();
const t = (key) => translate[languageStore.lang][key] || key;

// =========================
// Charger utilisateur
// =========================
async function loadUser() {
  const token = localStorage.getItem("access_token")
  if (!token) return

  try {
    const res = await fetch(`${API_URL}/api/me/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error("Unauthorized")

    user.value = await res.json()
    userId.value = user.value.id
    isLoggedIn.value = true
  } catch (err) {
    console.error(err)
    user.value = null
    isLoggedIn.value = false
  }
}

// =========================
// Charger paiements
// =========================
async function fetchPayments() {
  const token = localStorage.getItem("access_token")
  if (!token || !userId.value) return

  const res = await fetch(`${API_URL}/payments/me/`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()

  console.log("Payments", data)
  payments.value = data.map(p => {
    const isSent = p.bid?.user?.id === userId.value
    const isReceived = p.post?.user?.id === userId.value

    return {
      ...p,
      type: isSent ? "sent" : isReceived ? "received" : "unknown",
      fromUser: isReceived ? p.bid?.user?.username : null,
      toUser: isSent ? p.post?.user?.username : null,
      postTitle: p.post?.title || "-",
    }
  })
}

// =========================
// Filtres
// =========================
const filteredPayments = computed(() => {
  return payments.value.filter(p => {
    const matchType = filterType.value === "all" || p.type === filterType.value
    const dateSource = p.payment_date || p.created_at
    const matchDate = !filterDate.value || dateSource?.startsWith(filterDate.value)
    const matchSearch =
      !filterSearch.value ||
      p.fromUser?.toLowerCase().includes(filterSearch.value.toLowerCase()) ||
      p.toUser?.toLowerCase().includes(filterSearch.value.toLowerCase()) ||
      p.postTitle?.toLowerCase().includes(filterSearch.value.toLowerCase())
    return matchType && matchDate && matchSearch
  })
})

// =========================
// Utils
// =========================
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

function statusClass(status) {
  if (status === "SUCCESS") return "bg-[#10b481]/10 text-[#10b481] border-[#10b481]"
  if (status === "FAILED") return "bg-red-100 text-red-700 border-red-700"
  return "bg-yellow-100 text-yellow-700"
}

// =========================
// Lifecycle
// =========================
onMounted(async () => {
  await loadUser()
  await fetchPayments()
})
</script>
