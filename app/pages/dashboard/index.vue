<template>
  <div class="min-h-screen p-8">
    <div v-if="loading" class="text-gray-500">Chargement...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>

    <div v-else class="">
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 small">
        <div
          class="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition duration-300"
        >
          <div class="flex items-center justify-between">
            <p
              class="text-xs font-medium text-gray-400 uppercase tracking-wide"
            >
              Enchères reçues
            </p>
            <div
              class="w-10 h-10 flex items-center justify-center rounded-xl bg-[#10b481]/10 text-[#10b481]"
            >
              <i class="bx bx-transfer text-lg"></i>
            </div>
          </div>
          <h2 class="text-3xl mt-4">
            {{ receivedBids.length }}
          </h2>
        </div>

        <div
          class="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition duration-300"
        >
          <div class="flex items-center justify-between">
            <p
              class="text-xs font-medium text-gray-400 uppercase tracking-wide"
            >
              Enchères acceptées
            </p>
            <div
              class="w-10 h-10 flex items-center justify-center rounded-xl bg-[#10b481]/10 text-[#10b481]"
            >
              <i class="bx bx-check-circle text-lg"></i>
            </div>
          </div>
          <h2 class="text-3xl mt-4">
            {{
              receivedBids.filter((b) => b.current_status.name === "acceptée")
                .length
            }}
          </h2>
        </div>

        <div
          class="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition duration-300"
        >
          <div class="flex items-center justify-between">
            <p
              class="text-xs font-medium text-gray-400 uppercase tracking-wide"
            >
              Bids payées
            </p>
            <div
              class="w-10 h-10 flex items-center justify-center rounded-xl bg-[#10b481]/10 text-[#10b481]"
            >
              <i class="bx bx-credit-card text-lg"></i>
            </div>
          </div>
          <h2 class="text-3xl mt-4">
            {{
              receivedBids.filter((b) => b.current_status.name === "payée")
                .length
            }}
          </h2>
        </div>

        <div
          class="bg-[#10b481] rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition duration-300 text-white"
        >
          <div class="flex items-center justify-between">
            <p class="text-xs uppercase tracking-wide">Satisfaction globale</p>
            <div
              class="w-10 h-10 flex items-center justify-center rounded-xl bg-[#10b481]/10 text-[#10b481]"
            >
              <i class="bx bx-transfer text-lg"></i>
            </div>
          </div>

          <div class="mt-3 flex items-center justify-between">
            <div class="flex items-center gap-1">
              <i
                v-for="n in 5"
                :key="n"
                :class="
                  n <= Math.round(averageRating)
                    ? 'bx bxs-star text-white'
                    : 'bx bxs-star text-white/40'
                "
                class="text-base"
              />
            </div>

            <div class="text-right">
              <div class="flex items-baseline gap-1">
                <h2 class="text-3xl text-white leading-none">
                  {{ averageRating.toFixed(1) }}
                </h2>
                <span class="text-xs small text-white/70">/ 5</span>
              </div>
              <p class="text-xs small text-white/70">
                {{ reviews?.reviews?.length }} avis
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        <div
          class="xl:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md p-6 transition-all duration-300"
        >
          <div class="flex justify-between items-center mb-6">
            <h3 class="subtitle">Activité des enchères</h3>

            <div
              class="flex bg-[#fafaf9] backdrop-blur-md rounded-full p-1 text-xs font-medium shadow-inner"
            >
              <button
                @click="period = 'day'"
                :class="[
                  'px-4 py-1.5 rounded-full transition-all duration-200 small',
                  period === 'day'
                    ? 'bg-white shadow text-[#112830]'
                    : 'text-gray-500 hover:text-[#112830]',
                ]"
              >
                Jour
              </button>

              <button
                @click="period = 'week'"
                :class="[
                  'px-4 py-1.5 rounded-full transition-all duration-200 small',
                  period === 'week'
                    ? 'bg-white shadow text-[#10b481]'
                    : 'text-gray-500 hover:text-[#10b481]',
                ]"
              >
                Semaine
              </button>

              <button
                @click="period = 'month'"
                :class="[
                  'px-4 py-1.5 rounded-full transition-all duration-200 small',
                  period === 'month'
                    ? 'bg-white shadow text-[#112830]'
                    : 'text-gray-500 hover:text-[#112830]',
                ]"
              >
                Mois
              </button>
            </div>
          </div>

          <div class="">
            <div>
              <ApexCharts
                type="bar"
                height="300"
                :options="bidsOptions"
                :series="bidsChartData.series"
              />
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-6">
          <div
            class="relative small max-h-[150px] bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md p-6 flex items-center transition-all duration-300"
          >
            <div class="flex-1 flex-col gap-2 w-[50%]">
              <p class="text-sm text-gray-500 tracking-wide">
                Nombre total d’annonces
              </p>
              <h2
                class="text-3xl small font-bold bg-gradient-to-r from-[#112830] to-[#10b481] bg-clip-text text-transparent"
              >
                {{ loading ? "..." : posts.length }}
              </h2>
            </div>

            <div
              class="relative flex-1 flex-col items-end justify-center w-[30%]"
            >
              <ApexCharts
                type="radialBar"
                :options="radialOptions"
                :series="[successRate]"
                height="200"
              />
            </div>
          </div>

          <div
            class="relative bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md p-6 transition-all duration-300"
          >
            <h2 class="subtitle mb-4">Annonces par statut</h2>

            <ApexCharts
              type="donut"
              :options="donutOptions"
              :series="statusSeries"
              width="300"
              class="mx-auto"
            />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
        <div
          class="relative w-full bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md p-6 transition-all duration-300"
        >
          <div class="flex items-start justify-between mb-8">
            <div>
              <h3 class="subtitle">Taux d’acceptation</h3>
              <p class="text-sm small text-gray-400 mt-1">
                Performance globale des offres
              </p>
            </div>

            <div
              class="flex bg-[#fafaf9] backdrop-blur-md rounded-full p-1 text-xs font-medium shadow-inner"
            >
              <button
                @click="rateFilter = 'all'"
                :class="[
                  'px-4 py-1.5 rounded-full transition-all duration-200 small',
                  rateFilter === 'all'
                    ? 'bg-white shadow text-[#112830]'
                    : 'text-gray-500 hover:text-[#112830]',
                ]"
              >
                Tous
              </button>

              <button
                @click="rateFilter = 'received'"
                :class="[
                  'px-4 py-1.5 rounded-full transition-all duration-200 small',
                  rateFilter === 'received'
                    ? 'bg-white shadow text-[#10b481]'
                    : 'text-gray-500 hover:text-[#10b481]',
                ]"
              >
                Reçues
              </button>

              <button
                @click="rateFilter = 'sent'"
                :class="[
                  'px-4 py-1.5 rounded-full transition-all duration-200 small',
                  rateFilter === 'sent'
                    ? 'bg-white shadow text-[#112830]'
                    : 'text-gray-500 hover:text-[#112830]',
                ]"
              >
                Envoyées
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div class="relative flex justify-center">
              <ApexCharts
                type="donut"
                height="200"
                :options="rateOptions"
                :series="rateChartData.series"
              />
            </div>

            <div class="flex flex-col gap-1">
              <div
                v-for="(value, index) in rateChartData.series"
                :key="index"
                class="flex items-center justify-between bg-white backdrop-blur-md rounded-xl px-4 py-3 border border-gray-100 hover:shadow-md transition"
              >
                <div class="flex items-center gap-3">
                  <span
                    class="w-3 h-3 rounded-full"
                    :style="{ backgroundColor: rateOptions.colors[index] }"
                  ></span>

                  <span class="text-sm small text-gray-600">
                    {{ rateOptions.labels[index] }}
                  </span>
                </div>

                <span class="subtitle"> {{ value }}% </span>
              </div>
            </div>
          </div>
        </div>
        <div
          class="grid gap-6"
          :class="[
            showSeller && showBuyer ? 'md:grid-cols-2' : 'md:grid-rows-2',
          ]"
        >
          <div
            class="relative bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md p-6 transition-all duration-300"
          >
            <!-- Header -->
            <div class="flex items-center justify-between mb-8">
              <div>
                <p
                  class="text-xs small uppercase tracking-widest text-gray-400"
                >
                  Performance
                </p>
                <h3 class="subtitle mt-1">Temps moyen</h3>
              </div>
            </div>

            <!-- KPI GRID -->
            <div
              class="flex flex-wrap gap-8 justify-between"
              :class="
                showSeller && showBuyer
                  ? 'flex-row md:flex-row'
                  : 'flex-col md:flex-col'
              "
            >
              <!-- NEGOCIATION -->
              <div
                class="group w-full rounded-xl p-4 border border-gray-200 transition-all"
              >
                <p class="text-xs small text-gray-500 mb-2">Négociation</p>

                <div class="flex items-end gap-2">
                  <h2 class="text-2xl font-semibold text-[#112830]">
                    {{ avgNegotiationDelay }}
                  </h2>
                </div>
              </div>

              <!-- CONCLUSION -->
              <div
                class="group w-full rounded-xl p-4 border border-gray-200 transition-all"
              >
                <p class="text-xs small text-gray-500 mb-2">Conclusion</p>

                <div class="flex items-end gap-2">
                  <h2 class="text-2xl font-semibold text-[#112830]">
                    {{ avgConclusionDelay }}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div
            class="grid gap-6"
            :class="[
              showSeller && showBuyer ? 'md:grid-cols-1' : 'md:grid-cols-2',
            ]"
          >
            <div
              v-if="showSeller"
              class="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md p-6 transition relative"
            >
              <div
                class="absolute top-4 right-4 bg-[#10b481]/10 text-[#10b481] w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
              >
                <i class="bx bx-money text-lg"></i>
              </div>

              <div>
                <p
                  class="text-xs uppercase tracking-widest small text-gray-400"
                >
                  Revenus
                </p>
                <h2 class="mt-4 text-2xl font-semibold">
                  {{ formatCurrency(sellerRevenue) }}
                </h2>
              </div>

              <div
                class="flex items-center justify-between mt-6 p-4 bg-[#fafaf9] rounded-xl border border-gray-100 shadow-inner"
              >
                <div class="flex items-center gap-2">
                  <i class="bx bx-chart text-gray-400"></i>
                  <p
                    class="text-xs uppercase tracking-widest small text-gray-400"
                  >
                    Commission
                  </p>
                </div>
                <h2 class="text-sm small font-semibold text-gray-700">
                  {{ commissionRate }}%
                </h2>
              </div>
            </div>
            <!-- <ApexCharts
                type="line"
                height="100"
                width="100%"
                :options="sellerRevenueOptions"
                :series="sellerRevenueSeries"
              /> -->

            <div
              v-if="showBuyer"
              class="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md p-6 transition relative"
            >
              <div class="flex justify-between items-start items-center">
                <!-- Texte des Achats -->
                <div>
                  <p
                    class="text-xs small uppercase tracking-widest text-gray-400"
                  >
                    Achats
                  </p>
                  <h2 class="mt-4 text-2xl font-semibold">
                    {{ formatCurrency(buyerSpending) }}
                  </h2>
                </div>

                <!-- Icône montant sortant -->
                <div class="absolute top-4 right-4">
                  <span
                    class="flex items-center justify-center w-10 h-10 bg-red-600/10 text-red-600 rounded-xl"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <!-- Ligne diagonale -->
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M17 17V7H7"
                      />
                      <!-- Flèche -->
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M17 7L7 17"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
            <!-- <ApexCharts
                type="line"
                height="100"
                width="100%"
                :options="buyerRevenueOptions"
                :series="buyerRevenueSeries"
              /> -->
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6">
      <div
        v-if="
          (recentPosts && recentPosts.length) ||
          (recentReceivedBids && recentReceivedBids.length)
        "
      >
        <div
          class="relative rounded-2xl border border-white/40 bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.05)] overflow-hidden"
        >
          <div
            class="flex items-center justify-between px-6 py-6 border-b border-gray-100"
          >
            <div>
              <h3 class="subtitle tracking-tight">Activité récente</h3>
              <p class="text-sm small text-gray-400 mt-1">Cette semaine</p>
            </div>

            <div class="flex flex-col sm:flex-row gap-2">
              <button
                class="group text-sm small-medium text-[#10b481] flex items-center justify-center gap-1"
              >
                voir plus
                <i
                  class="bx bx-right-arrow-alt text-lg transition-transform duration-200 group-hover:translate-x-1"
                ></i>
              </button>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-[100%] text-sm text-left border-collapse">
              <thead
                class="text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                <tr>
                  <th class="px-8 py-4 small">Type</th>
                  <th class="px-8 py-4 small">Titre</th>
                  <th class="px-8 py-4 small">Utilisateur</th>
                  <th class="px-8 py-4 small text-right">Montant</th>
                  <th class="px-8 py-4 small text-right">Statut</th>
                  <th class="px-8 py-4 small text-right">Date</th>
                </tr>
              </thead>

              <tbody class="divide-y divide-gray-100 content">
                <tr
                  v-for="post in recentPosts"
                  :key="'post-' + post.id"
                  class="hover:bg-[#fafaf9] hover:border-l-emerald-500 transition-all duration-200 ease-in-out border-l-4 border-[#10b481]"
                >
                  <td class="px-8 py-5 font-medium">Post</td>

                  <td class="px-8 py-5 font-medium hover:text-[#10b481]">
                    <NuxtLink :to="`/dashboard/post/bids/${post.id}`">
                      {{ post.title }}
                    </NuxtLink>
                  </td>

                  <td class="px-8 py-5">—</td>

                  <td class="px-8 py-5 text-right font-semibold">
                    {{ Number(post.price).toLocaleString() }}
                    {{ post.currency.symbol }}
                  </td>

                  <td class="px-8 py-5 text-right">
                    <span
                      :class="[
                        'px-3 py-1 text-xs small-medium rounded-full border whitespace-nowrap',
                        statusColors[post.current_status]?.border,
                        statusColors[post.current_status]?.text,
                        statusColors[post.current_status]?.bg,
                      ]"
                    >
                      {{
                        post.current_status.charAt(0).toUpperCase() +
                        post.current_status.slice(1)
                      }}
                    </span>
                  </td>

                  <td class="px-8 py-5 text-right">
                    {{ formatDate(post.created_at) }}
                  </td>
                </tr>

                <tr
                  v-for="bid in recentReceivedBids"
                  :key="'bid-' + bid.id"
                  class="hover:bg-[#fafaf9] hover:border-l-emerald-500 transition-all duration-200 ease-in-out border-l-4 border-[#112830]"
                >
                  <td class="px-8 py-5 text-[#112830] font-medium">Enchère</td>

                  <td class="px-8 py-5 font-medium hover:text-[#10b481]">
                    <NuxtLink :to="`/dashboard/post/bids/${bid.post.id}`">
                      {{ bid.post.title }}
                    </NuxtLink>
                  </td>

                  <td class="px-8 py-5">
                    {{ bid.user.username }}
                  </td>

                  <td class="px-8 py-5 text-right font-semibold">
                    {{ Number(bid.price).toLocaleString() }}
                    {{ bid.currency.symbol }}
                  </td>

                  <td class="px-8 py-5 text-right">
                    <span
                      class="text-xs font-medium px-3 py-1 rounded-full border"
                      :class="{
                        'bg-[#10b481]/10 text-[#10b481] border-[#10b481]':
                          bid.current_status.name === 'acceptée' ||
                          bid.current_status.name === 'payée',
                        'bg-[#fd7e14]/10 text-[#fd7e14] border-[#fd7e14]':
                          bid.current_status.name === 'proposée',
                        'bg-[#dc3545]/10 text-[#dc3545] border-[#dc3545]': [
                          'refusée',
                          'arretee',
                          'supprimee',
                        ].includes(bid.current_status.name),
                      }"
                    >
                      {{ bid.current_status.name }}
                    </span>
                  </td>

                  <td class="px-8 py-5 text-right">
                    {{ formatDate(bid.created_at) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "dashboard" });
import { ref, onMounted } from "vue";
import ApexCharts from "vue3-apexcharts";
import { API_URL } from "~/utils/config";
import { parseISO, formatDistanceToNow } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { startOfWeek, endOfWeek, isWithinInterval } from "date-fns";
import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";
import { getWeek, format } from "date-fns";

const languageStore = useLanguageStore();
const t = (key: string) => translate[languageStore.lang][key] || key;

const formatDate = (dateStr: string) => {
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

const statusColors = {
  brouillon: {
    border: "border-gray-400",
    text: "text-gray-700",
    bg: "bg-gray-200/30",
  },
  published: {
    border: "border-blue-600",
    text: "text-blue-600",
    bg: "bg-blue-600/10",
  },
  négociation: {
    border: "border-[#f4a261]",
    text: "text-[#f4a261]",
    bg: "bg-[#f4a261]/10",
  },
  vendu: {
    border: "border-[#10b481]",
    text: "text-[#10b481]",
    bg: "bg-[#10b481]/10",
  },
  supprimé: {
    border: "border-red-600",
    text: "text-red-600",
    bg: "bg-red-600/10",
  },
};

// Exemple : 10% de commission
const commissionRate = ref(10);

const posts = ref<any[]>([]);
const sentBids = ref<any[]>([]);
const receivedBids = ref<any[]>([]);
const loading = ref(true);
const error = ref("");

const result = ref(0);
const currentPage = ref(1);
const itemsPerPage = 4;

const statusSeries = ref<number[]>([]);
const statusLabels = [
  "Brouillon",
  "Publié",
  "Négociation",
  "Vendu",
  "Supprimé",
];
const period = ref<"day" | "week" | "month">("day");
const successRate = ref<number>(0);
const acceptedBid = ref<number>(0);

const reviews = ref([]);

const averageRating = computed(() => {
  return reviews.value?.average_rating ?? 0;
});

onMounted(async () => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Token manquant");

    const resPosts = await fetch(`${API_URL}/api/posts/my_posts/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!resPosts.ok) throw new Error("Impossible de récupérer les annonces");
    posts.value = await resPosts.json();

    console.log("Annonces récupérées :", JSON.stringify(posts.value, null, 2));

    const resSent = await fetch(`${API_URL}/api/bids/my_bids/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!resSent.ok)
      throw new Error("Impossible de récupérer les enchères envoyées");
    sentBids.value = await resSent.json();
    console.log(
      "SendBids récupérées :",
      JSON.stringify(sentBids.value, null, 2)
    );

    const resReceived = await fetch(`${API_URL}/api/bids/received_bids/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!resReceived.ok)
      throw new Error("Impossible de récupérer les enchères reçues");
    receivedBids.value = await resReceived.json();
    console.log(
      "ReceivedBids récupérées :",
      JSON.stringify(receivedBids.value, null, 2)
    );

    const resReview = await fetch(
      `${API_URL}/api/reviews/user/${userId.value}/`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!resReview.ok)
      throw new Error("Impossible de récupérer les enchères reçues");
    reviews.value = await resReview.json();
    console.log("reviews récupérées :", JSON.stringify(reviews.value, null, 2));

    const draft = posts.value.filter(
      (p: any) => p.current_status === "brouillon"
    ).length;
    const published = posts.value.filter(
      (p: any) => p.current_status === "published"
    ).length;
    const ongoing = posts.value.filter(
      (p: any) => p.current_status === "négociation"
    ).length;
    const sold = posts.value.filter(
      (p: any) => p.current_status === "vendu"
    ).length;
    const deleted = posts.value.filter(
      (p: any) => p.current_status === "supprimé"
    ).length;
    statusSeries.value = [draft, published, ongoing, sold, deleted];

    successRate.value = posts.value.length
      ? Math.round((sold / posts.value.length) * 100)
      : 0;

    const radialSeries = [successRate.value];

    acceptedBid.value = receivedBids.value.filter(
      (b: any) => b.current_status.name === "acceptée"
    ).length;
  } catch (err: any) {
    error.value = err.message || "Une erreur est survenue";
    console.error(err);
  } finally {
    loading.value = false;
  }
});

// function groupBidsByPeriod(bids: any[]) {
//   const grouped: Record<string, number> = {};

//   bids.forEach((b) => {
//     const key = formatDate(b.created_at);
//     grouped[key] = (grouped[key] || 0) + 1;
//   });

//   return grouped;
// }

function formatChartLabel(timestamp: number) {
  const date = new Date(timestamp);

  if (period.value === "day") {
    // Feb 28 2026
    return format(date, "MMM dd yyyy", {
      locale: languageStore.lang === "fr" ? fr : enUS,
    });
  }

  if (period.value === "week") {
    // S numéro de semaine + année
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    const weekNumber = getWeek(startOfWeek, {
      locale: languageStore.lang === "fr" ? fr : enUS,
    });
    const year = startOfWeek.getFullYear();
    return `S${weekNumber} ${year}`;
  }

  if (period.value === "month") {
    // Feb 2026
    return format(date, "MMM yyyy", {
      locale: languageStore.lang === "fr" ? fr : enUS,
    });
  }
}

function groupBidsByPeriod(bids: any[]) {
  const grouped: Record<string, number> = {};

  bids.forEach((b) => {
    const date = new Date(b.created_at);

    let keyTimestamp: number;

    if (period.value === "day") {
      keyTimestamp = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      ).getTime();
    } else if (period.value === "week") {
      const firstDay = new Date(date);
      firstDay.setDate(date.getDate() - date.getDay());
      keyTimestamp = firstDay.getTime();
    } else {
      keyTimestamp = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
    }

    const label = formatChartLabel(keyTimestamp);
    grouped[label] = (grouped[label] || 0) + 1;
  });

  return grouped;
}

const bidsChartData = computed(() => {
  const currentPeriod = period.value;

  const sentGrouped = groupBidsByPeriod(sentBids.value);
  const receivedGrouped = groupBidsByPeriod(receivedBids.value);

  const keys = Array.from(
    new Set([...Object.keys(sentGrouped), ...Object.keys(receivedGrouped)])
  )
    .map((k) => k)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  return {
    categories: keys.map((k) => k),
    series: [
      {
        name: "Enchères envoyées",
        data: keys.map((k) => sentGrouped[k] || 0),
      },
      {
        name: "Enchères reçues",
        data: keys.map((k) => receivedGrouped[k] || 0),
      },
    ],
  };
});

const colors = ["#C4C9CB", "#10B481", "#C3ECDD", "#112830", "#EF4444"];

function computeOffset(index: number) {
  const total = statusSeries.reduce((a, b) => a + b, 0);
  const sumBefore = statusSeries.slice(0, index).reduce((a, b) => a + b, 0);
  return 100 - (sumBefore / total) * 100;
}

const donutOptions = {
  labels: statusLabels,
  colors: ["#C4C9CB", "#10B481", "#C3ECDD", "#112830", "#EF4444"],
  chart: { type: "donut", toolbar: { show: false } },

  dataLabels: {
    enabled: false,
  },

  legend: {
    formatter: (seriesName: string) => {
      return `<span class="text-xs small text-gray-500" style="margin-left:8px;">${seriesName}</span>`;
    },
  },
};

const radialOptions = {
  chart: {
    type: "radialBar",
    toolbar: { show: false },
    animations: { enabled: true, easing: "easeout", speed: 900 },
  },
  plotOptions: {
    radialBar: {
      startAngle: -135,
      endAngle: 135,
      hollow: {
        size: "50%",
      },
      track: {
        background: "#e6f0ee",
        strokeWidth: "100%",
        margin: 5,
      },
      dataLabels: {
        name: {
          show: true,
          fontSize: "12px",
          color: "#4B5563",
          fontFamily: "Inter, sans-serif",
          fontWeight: 500,
          formatter: () => "Succès",
        },
        value: {
          show: true,
          fontSize: "16px",
          fontWeight: 700,
          fontFamily: "Inter, sans-serif",
          color: "#10b481",
          offsetY: 6,
          formatter: function (val: string) {
            return val + "%";
          },
        },
      },
      stroke: { lineCap: "round" },
    },
  },
  fill: {
    type: "gradient",
    gradient: {
      shade: "light",
      type: "horizontal",
      gradientToColors: ["#34d399"],
      stops: [0, 100],
    },
  },
  colors: ["#10b481"],
  tooltip: {
    enabled: true,
    theme: "dark",
    y: { formatter: (val: string) => val + "%" },
  },
};

const bidsOptions = computed(() => ({
  chart: {
    type: "bar",
    toolbar: { show: false },
    zoom: { enabled: false },
  },
  plotOptions: {
    bar: {
      borderRadius: 8,
      borderRadiusApplication: "end",
      // columnWidth: "30%",
      distributed: false,
    },
  },
  // stroke: {
  //   curve: "smooth",
  //   width: 2,
  // },
  xaxis: {
    categories: bidsChartData.value.categories,
    labels: {
      style: {
        fontSize: "0.75rem",
        colors: "#6B7280",
        fontFamily: "Inter, sans-serif",
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        fontSize: "0.75rem",
        colors: "#6B7280",
        fontFamily: "Inter, sans-serif",
      },
    },
  },
  colors: ["#10b481", "#112830"],
  // markers: {
  //   size: 3,
  //   strokeWidth: 2,
  // },
  legend: {
    position: "top",
    horizontalAlign: "right",
    verticalAlign: "bottom",
    formatter: (seriesName: string) => {
      return `<span class="text-xs small text-gray-500" style="margin-left:8px;">${seriesName}</span>`;
    },
  },
  grid: {
    borderColor: "#f1f1f1",
  },
}));

const rateFilter = ref("all");

function filterBids() {
  let relevant = [];
  if (rateFilter.value === "received") relevant = receivedBids.value;
  else if (rateFilter.value === "sent") relevant = sentBids.value;
  else relevant = [...receivedBids.value, ...sentBids.value];
  return relevant;
}

const rateChartData = computed(() => {
  const bids = filterBids();

  let accepted = 0;
  let declined = 0;
  let proposed = 0;
  let cancelled = 0;

  bids.forEach((b) => {
    const status = b.current_status.name.toLowerCase();
    if (status === "acceptée" || status === "payée") accepted++;
    else if (status === "refusée" || status === "arrêtée") declined++;
    else if (status === "proposée") proposed++;
    else if (status === "annulée") cancelled++;
  });

  const total = bids.length;

  const acceptedRate = total > 0 ? Math.round((accepted / total) * 100) : 0;
  const declinedRate = total > 0 ? Math.round((declined / total) * 100) : 0;
  const proposedRate = total > 0 ? Math.round((proposed / total) * 100) : 0;
  const cancelledRate = total > 0 ? Math.round((cancelled / total) * 100) : 0;

  return {
    series: [acceptedRate, declinedRate, proposedRate, cancelledRate],
  };
});

const rateOptions = {
  labels: ["Proposée", "Acceptées", "Refusées", "Annulée"],
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: false,
  },
  stroke: {
    width: 0,
  },
  plotOptions: {
    pie: {
      donut: {
        size: "70%",
      },
    },
  },
  colors: ["#C3ECDD", "#10b481", "#112830", "#C4C9CB"],
};

const acceptedTrend = computed(() => {
  const grouped: Record<string, number> = {};

  receivedBids.value.forEach((b: any) => {
    if (b.current_status.name !== "acceptée") return;

    const date = new Date(b.created_at);
    const key = date.toISOString().split("T")[0];

    if (!grouped[key]) grouped[key] = 0;
    grouped[key]++;
  });

  const categories = Object.keys(grouped).sort();

  return {
    categories,
    series: [
      {
        name: "Acceptées",
        data: categories.map((c) => grouped[c]),
      },
    ],
  };
});

const acceptedOptions = computed(() => ({
  chart: {
    type: "line",
    sparkline: { enabled: true },
  },
  stroke: {
    curve: "smooth",
    width: 2,
  },
  colors: ["#10b481"],
  tooltip: {
    enabled: true,
  },
}));

const user = ref(null);
const userId = ref(0);

const userCategory = computed(() => {
  if (!user.value || !user.value.id_categorie_user) return null;
  return user.value.id_categorie_user.categorie;
});

async function checkUser() {
  const token = localStorage.getItem("access_token");
  if (!token) return;
  try {
    const res = await fetch(`${API_URL}/api/me/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Unauthorized");
    const data = await res.json();
    userId.value = data.id;
    user.value = data;
    console.log("User data:", data);
  } catch {
    user.value = null;
  }
}

onMounted(() => {
  checkUser();
});

function calculateSellerRevenue(bids: any[]) {
  const revenueByCurrency: Record<string, number> = {};

  bids
    .filter(
      (b) =>
        b.current_status.name === "acceptée" ||
        b.current_status.name === "payée"
    )
    .forEach((b) => {
      const currency = b.post?.currency?.symbol || "Ar";
      const price = Number(b.price || 0);

      const net = price * 0.9; // 🔥 -10% commission

      revenueByCurrency[currency] = (revenueByCurrency[currency] || 0) + net;
    });

  return revenueByCurrency;
}

function calculateBuyerSpending(bids: any[]) {
  const spendingByCurrency: Record<string, number> = {};

  bids
    .filter(
      (b) =>
        b.current_status.name === "acceptée" ||
        b.current_status.name === "payée"
    )
    .forEach((b) => {
      const currency = b.post?.currency?.symbol || "Ar";
      const price = Number(b.price || 0);

      // ❌ pas de commission ici
      spendingByCurrency[currency] =
        (spendingByCurrency[currency] || 0) + price;
    });

  return spendingByCurrency;
}

const sellerRevenue = computed(() =>
  calculateSellerRevenue(receivedBids.value)
);

const buyerSpending = computed(() => calculateBuyerSpending(sentBids.value));

// function calculateAmounts(bids: any[]) {
//   const revenueByCurrency: Record<string, number> = {};
//   bids
//     .filter(
//       (b) =>
//         b.current_status.name === "acceptée" ||
//         b.current_status.name === "payée"
//     )
//     .forEach((b) => {
//       const currency = b.post?.currency?.symbol || "Ar";
//       revenueByCurrency[currency] =
//         (revenueByCurrency[currency] || 0) + Number(b.price || 0);
//     });
//   return revenueByCurrency;
// }

// const sellerRevenue = computed(() => calculateAmounts(receivedBids.value));
// const buyerSpending = computed(() => calculateAmounts(sentBids.value));

function formatCurrency(data: Record<string, number | null | undefined>) {
  if (!data) return "0";
  return Object.entries(data)
    .map(
      ([currency, amount]) => `${(amount ?? 0).toLocaleString()} ${currency}`
    )
    .join(" · ");
}

function groupRevenueTrend(bids: any[]) {
  const grouped: Record<string, { estimated: number; paid: number }> = {};

  bids.forEach((b) => {
    const date = new Date(b.updated_at || b.created_at)
      .toISOString()
      .split("T")[0];
    if (!grouped[date]) grouped[date] = { estimated: 0, paid: 0 };

    if (b.current_status.name === "acceptée")
      grouped[date].estimated += Number(b.price || 0);
    if (b.current_status.name === "payée")
      grouped[date].paid += Number(b.price || 0);
  });

  const categories = Object.keys(grouped).sort();

  return {
    categories,
    series: [
      { name: "Estimé", data: categories.map((c) => grouped[c].estimated) },
      { name: "Payé", data: categories.map((c) => grouped[c].paid) },
    ],
  };
}

const sellerRevenueSeries = computed(
  () => groupRevenueTrend(receivedBids.value).series
);

const sellerRevenueOptions = computed(() => {
  const data = groupRevenueTrend(receivedBids.value);
  return {
    chart: {
      type: "line",
      toolbar: { show: false },
      sparkline: { enabled: true },
    },
    stroke: { curve: "straight", width: 2 },
    colors: ["#10b481", "#112830"],
    legend: { position: "top" },
    grid: { borderColor: "#f1f1f1" },
    xaxis: { categories: data.categories },
    yaxis: { labels: { show: false } },
    tooltip: {
      shared: true,
      intersect: false,
      y: { formatter: (val: number) => val.toLocaleString() + " Ar" },
    },
  };
});

const buyerRevenueSeries = computed(
  () => groupRevenueTrend(sentBids.value).series
);

const buyerRevenueOptions = computed(() => {
  const data = groupRevenueTrend(sentBids.value);
  return {
    chart: {
      type: "line",
      toolbar: { show: false },
      sparkline: { enabled: true },
    },
    stroke: { curve: "straight", width: 2 },
    colors: ["#10b481", "#112830"],
    legend: { position: "top" },
    grid: { borderColor: "#f1f1f1" },
    xaxis: { categories: data.categories },
    yaxis: { labels: { show: false } },
    tooltip: {
      shared: true,
      intersect: false,
      y: { formatter: (val: number) => val.toLocaleString() + " Ar" },
    },
  };
});
// const buyerRevenueOptions = computed(() => {
//   const data = groupRevenueTrend(sentBids.value);
//   return {
//     chart: { type: "line", toolbar: { show: false } },
//     stroke: { curve: "straight", width: 2 },
//     colors: ["#10b481", "#112830"],
//     legend: { position: "top" },
//     grid: { borderColor: "#f1f1f1" },
//     xaxis: { categories: data.categories },
//     yaxis: { labels: { formatter: (val: number) => val.toLocaleString() } },
//     tooltip: {
//       shared: true,
//       intersect: false,
//       y: { formatter: (val: number) => val.toLocaleString() + " Ar" },
//     },
//   };
// });

// Random fixe par user_id (provisoire)
function getFixedRandomDelay(
  userId: number,
  type: "negotiation" | "conclusion"
): number {
  const baseSeed = userId * 9301 + 49297;

  // Différence entre négociation et conclusion
  const config = {
    negotiation: { min: 1, max: 3, offset: 111 },
    conclusion: { min: 1, max: 8, offset: 777 },
  };

  const { min, max, offset } = config[type];

  const seed = baseSeed + offset;
  const rnd = (seed % 233280) / 233280;

  return rnd * (max - min) + min;
}

function formatDelay(daysDecimal: number): string {
  const days = Math.floor(daysDecimal);
  const hours = Math.round((daysDecimal - days) * 24);

  return `${days} jours ${hours} h`;
}

function calculateAvgNegotiationDelay(bids: any[]) {
  const delays: number[] = [];

  bids.forEach((b) => {
    if (!b.user?.id) return;
    if (b.current_status.name === "proposée") return;

    const diffDays = getFixedRandomDelay(b.user.id, "negotiation");
    delays.push(diffDays);
  });

  if (!delays.length) return "0 jours";

  const avg = delays.reduce((a, b) => a + b, 0) / delays.length;

  return formatDelay(avg);
}

function calculateAvgConclusionDelay(bids: any[]) {
  const delays: number[] = [];

  bids.forEach((b) => {
    if (!b.user?.id) return;

    if (
      !["acceptée", "payée", "refusée", "arrêtée"].includes(
        b.current_status.name
      )
    )
      return;

    const diffDays = getFixedRandomDelay(b.user.id, "conclusion");
    delays.push(diffDays);
  });

  if (!delays.length) return "0 jours";

  const avg = delays.reduce((a, b) => a + b, 0) / delays.length;

  return formatDelay(avg);
}

const avgNegotiationDelay = computed(() => {
  const result = calculateAvgNegotiationDelay(receivedBids.value);
  console.log("RESULT négociation =", result);
  return result;
});

const avgConclusionDelay = computed(() => {
  const result = calculateAvgConclusionDelay(receivedBids.value);
  console.log("RESULT conclusion =", result);
  return result;
});

const topPosts = computed(() => {
  return [...posts.value]
    .sort((a, b) => (b.total_bids || 0) - (a.total_bids || 0))
    .slice(0, 5);
});

const startWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
const endWeek = endOfWeek(new Date(), { weekStartsOn: 1 });

const recentPosts = computed(() =>
  posts.value.filter((p) =>
    isWithinInterval(parseISO(p.created_at), { start: startWeek, end: endWeek })
  )
);

const recentReceivedBids = computed(() =>
  receivedBids.value.filter((b) =>
    isWithinInterval(parseISO(b.created_at), { start: startWeek, end: endWeek })
  )
);

const miniRateOptions = {
  chart: {
    sparkline: { enabled: true },
    toolbar: { show: false },
  },
  stroke: {
    curve: "smooth",
    width: 2,
  },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.3,
      opacityTo: 0.05,
    },
  },
  colors: ["#112830"],
  tooltip: {
    enabled: true,
  },
};

const showSeller = computed(
  () => userCategory.value === "Vendeur" || userCategory.value === "User"
);

const showBuyer = computed(
  () => userCategory.value === "Acheteur" || userCategory.value === "User"
);

const cardCount = computed(() => {
  let count = 1;
  if (showSeller.value) count++;
  if (showBuyer.value) count++;
  return count;
});
</script>

<style>
.apexcharts-legend::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

.apexcharts-legend::-webkit-scrollbar-thumb {
  background: rgba(16, 180, 129, 0.6);
  border-radius: 10px;
}

.apexcharts-legend::-webkit-scrollbar-track {
  background: transparent;
}
</style>
