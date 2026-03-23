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
              {{ t("totalUsers") }}
            </p>
            <div
              class="w-10 h-10 flex items-center justify-center rounded-xl bg-[#10b481]/10 text-[#10b481]"
            >
              <i class="bx bx-transfer text-lg"></i>
            </div>
          </div>
          <h2 class="text-3xl mt-4">
            {{ stats.users.total }}
          </h2>
        </div>

        <div
          class="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition duration-300"
        >
          <div class="flex items-center justify-between">
            <p
              class="text-xs font-medium text-gray-400 uppercase tracking-wide"
            >
              {{ t("verifiedUsers") }}
            </p>
            <div
              class="w-10 h-10 flex items-center justify-center rounded-xl bg-[#10b481]/10 text-[#10b481]"
            >
              <i class="bx bx-check-circle text-lg"></i>
            </div>
          </div>
          <h2 class="text-3xl mt-4">
            {{ stats.users.verified }}
          </h2>
        </div>

        <div
          class="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition duration-300"
        >
          <div class="flex items-center justify-between">
            <p
              class="text-xs font-medium text-gray-400 uppercase tracking-wide"
            >
              Totale annonces actif
            </p>
            <div
              class="w-10 h-10 flex items-center justify-center rounded-xl bg-[#10b481]/10 text-[#10b481]"
            >
              <i class="bx bx-credit-card text-lg"></i>
            </div>
          </div>
          <h2 class="text-3xl mt-4">
            {{
              posts.filter(
                (p) =>
                  p.current_status === "published" ||
                  p.current_status === "négociation"
              ).length
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

      <div class="grid grid-cols-1 xl:grid-cols-5 gap-6 mt-6">
        <div
          class="xl:col-span-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md p-6 transition-all duration-300"
        >
          <div class="flex justify-between items-center mb-6">
            <h3 class="subtitle">Nombre total d’utilisateurs actifs</h3>

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
                type="line"
                height="240"
                :options="usersOptions"
                :series="usersChartData.series"
              />
            </div>
          </div>
        </div>

        <div
          class="xl:col-span-2 relative w-full bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md p-6 transition-all duration-300"
        >
          <div class="flex items-start justify-between mb-8">
            <div>
              <h3 class="subtitle">Répartition par rôle</h3>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div class="relative flex justify-center">
              <ApexCharts
                type="donut"
                height="180"
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

                <span class="subtitle"> {{ value }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-5 gap-6 mt-6 auto-rows-fr">
        <!-- Annonces conclues -->
        <div class="xl:col-span-3 h-full">
          <div
            class="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 transition-all duration-300 h-full flex flex-col"
          >
            <!-- Header et filtres -->
            <div class="flex justify-between items-center mb-6">
              <h3 class="subtitle">Annonces conclus</h3>

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

            <!-- Chart -->
            <div class="flex-1">
              <ApexCharts
                type="bar"
                :options="soldPostsOptions"
                :series="soldPostsChartData.series"
                height="200"
                width="100%"
              />
            </div>
          </div>
        </div>

        <!-- Reports récents -->
        <div class="xl:col-span-2 h-full">
          <div
            class="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 h-full flex flex-col"
          >
            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
              <h2 class="subtitle">Reports récents</h2>

              <span
                v-if="reports.length > 0"
                class="min-w-[20px] small h-[20px] px-1 flex items-center justify-center text-[10px] bg-red-600 text-white rounded-full shadow"
              >
                {{ reports.length > 9 ? "9+" : reports.length }}
              </span>
            </div>

            <!-- Contenu -->
            <div class="flex-1 overflow-y-auto">
              <div
                v-if="!reports.length"
                class="text-sm text-gray-400 text-center py-10"
              >
                Aucun signalement
              </div>

              <div v-else class="divide-y divide-gray-100">
                <div
                  v-for="report in reports"
                  :key="report.id"
                  class="py-4 group flex items-start justify-between gap-4"
                >
                  <div class="flex flex-col flex-1">
                    <p
                      class="content leading-relaxed line-clamp-2 group-hover:text-gray-900 transition"
                    >
                      {{ report.reason }}
                    </p>

                    <span class="text-xs small text-gray-400 mt-1">
                      {{ formatDate(report.created_at) }}
                    </span>
                  </div>

                  <span
                    class="text-xs small px-2.5 py-1 rounded-full whitespace-nowrap"
                    :class="{
                      'bg-[#f4a261]/10 text-[#f4a261] border border-[#f4a261]':
                        report.status === 'pending',
                      'bg-[#10b481]/10 text-[#10b481] border border-[#10b481]':
                        report.status === 'resolved',
                      'bg-red-50 text-red-600 border border-red-200':
                        report.status === 'rejected',
                    }"
                  >
                    {{ report.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-6">
      <div v-if="recentPosts && recentPosts.length">
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
                Voir plus
                <i
                  class="bx bx-right-arrow-alt text-lg transition-transform duration-200 group-hover:translate-x-1"
                ></i>
              </button>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left border-collapse">
              <thead
                class="text-xs small text-gray-400 uppercase tracking-wider"
              >
                <tr>
                  <th class="px-6 py-4 small">Utilisateur</th>
                  <th class="px-6 py-4 small">Titre</th>
                  <th class="px-6 py-4 small text-left">Montant</th>
                  <th class="px-6 py-4 small text-right">Date</th>
                  <th class="px-6 py-4 small text-center">Statut</th>
                  <th class="px-6 py-4 small text-center">Actions</th>
                </tr>
              </thead>

              <tbody class="divide-y divide-gray-100 content">
                <tr
                  v-for="post in recentPosts"
                  :key="'post-' + post.id"
                  class="hover:bg-[#fafaf9] transition-all duration-200 ease-in-out"
                >
                  <td class="px-6 py-4 font-medium">
                    <NuxtLink
                      :to="`/admin/users/${post.user.id}`"
                      class="flex items-center gap-3 username hover:text-[#10b481] transition"
                    >
                      <img
                        v-if="post.user.avatar_url"
                        :src="post.user.avatar_url"
                        alt="avatar"
                        class="w-10 h-10 rounded-full object-cover"
                      />
                      <div
                        v-else
                        class="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                        :class="getAvatarColor(post.user.username)"
                      >
                        {{ post.user.username.charAt(0).toUpperCase() }}
                      </div>
                      <span>{{ post.user.username || post.user.email }}</span>
                    </NuxtLink>
                  </td>

                  <td class="px-6 py-4 font-medium hover:text-[#10b481]">
                    <NuxtLink :to="`/dashboard/post/bids/${post.id}`">
                      {{ post.title }}
                    </NuxtLink>
                  </td>

                  <td class="px-6 py-4 text-left small-medium">
                    {{ Number(post.price).toLocaleString() }}
                    {{ post.currency.symbol }}
                  </td>

                  <td class="px-6 py-4 text-right">
                    {{ formatDate(post.created_at) }}
                  </td>

                  <td class="px-6 py-4 text-center">
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

                  <td class="px-6 py-4 text-center flex justify-center gap-2">
                    <button
                      @click="deletePost(post.id)"
                      class="p-2 text-red-600 hover:bg-red-50 rounded-full transition"
                      title="Supprimer"
                    >
                      <i class="bx bx-trash text-lg"></i>
                    </button>

                    <NuxtLink
                      :to="`/dashboard/post/bids/${post.id}`"
                      class="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition"
                      title="Voir détails"
                    >
                      <i class="bx bx-show-alt text-lg"></i>
                    </NuxtLink>
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

const period = ref<"day" | "week" | "month">("day");
const users = ref([]);
const userActif = ref([]);
const successRate = ref<number>(0);
const stats = ref({
  users: { total: 0, verified: 0, unverified: 0, byCategory: {} },
});

async function fetchUsers() {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${API_URL}/api/users/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return;

  users.value = await res.json();
  console.log("Utilisateurs récupérés :", JSON.stringify(users.value, null, 2));

  stats.value.users.total = users.value.length;
  stats.value.users.verified = users.value.filter((u) => u.is_verified).length;
  stats.value.users.unverified = users.value.filter(
    (u) => !u.is_verified
  ).length;
  userActif.value = users.value.filter((u) => u.is_active);
  stats.value.users.byCategory = users.value.reduce((acc, u) => {
    if (
      !u.id_categorie_user?.categorie ||
      u.id_categorie_user?.categorie.toLowerCase() === "admin"
    )
      return acc;

    const role = u.id_categorie_user?.categorie.toLowerCase();
    let cat = "Other";

    if (role.includes("acheteur") || role === "buyer") cat = "Acheteur";
    else if (role.includes("vendeur") || role === "seller") cat = "Vendeur";
    else if (role.includes("user")) cat = "Both";

    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

onMounted(fetchUsers);

// --- chart logic ---
function groupUsersByPeriod(users: any[]) {
  const grouped: Record<string, number> = {};
  users.forEach((u) => {
    if (!u.date_joined) return;
    const date = new Date(u.date_joined);
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

const usersChartData = computed(() => {
  const activeGrouped = groupUsersByPeriod(userActif.value);
  const newUsersGrouped = groupUsersByPeriod(users.value);

  const allKeys = [
    ...new Set([
      ...Object.keys(activeGrouped),
      ...Object.keys(newUsersGrouped),
    ]),
  ].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  return {
    categories: allKeys,
    series: [
      {
        name: "Utilisateurs actifs",
        data: allKeys.map((k) => activeGrouped[k] || 0),
      },
      {
        name: "Nouveaux inscrits",
        data: allKeys.map((k) => newUsersGrouped[k] || 0),
      },
    ],
  };
});

const usersOptions = computed(() => ({
  chart: {
    type: "line",
    toolbar: { show: false },
    zoom: { enabled: false },
  },
  stroke: { curve: "straight", width: 2 },
  xaxis: {
    categories: usersChartData.value.categories,
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
  markers: { size: 3, strokeWidth: 2 },

  legend: {
    position: "top",
    horizontalAlign: "right",
    verticalAlign: "bottom",
    formatter: (seriesName: string) => {
      return `<span class="text-xs small text-gray-500" style="margin-left:8px;">${seriesName}</span>`;
    },
  },
  grid: { borderColor: "#f1f1f1" },
}));

const posts = ref<any[]>([]);
const statusSeries = ref<number[]>([]);
const statusLabels = [
  "Brouillon",
  "Publié",
  "Négociation",
  "Vendu",
  "Supprimé",
];

async function fetchPosts() {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${API_URL}/api/posts/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.ok) posts.value = await res.json();
  console.log("Posts récupérés :", JSON.stringify(posts.value, null, 2));

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
}

onMounted(fetchPosts);

const receivedBids = ref<any[]>([]);
const loading = ref(true);
const error = ref("");

const reviews = ref([]);

const averageRating = computed(() => {
  return reviews.value?.average_rating ?? 0;
});

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

const donutOptions = {
  labels: statusLabels,
  colors: ["#C4C9CB", "#10B481", "#C3ECDD", "#112830", "#EF4444"],
  chart: { type: "donut", toolbar: { show: false } },

  dataLabels: {
    enabled: false,
  },

  legend: {
    formatter: (seriesName: string) => {
      return `<span class="text-xs small text-gray-400" style="margin-left:8px;">${seriesName}</span>`;
    },
  },
};

function groupSoldPostsByPeriod(posts: any[]) {
  const grouped: Record<string, number> = {};

  posts
    .filter((p) => p.current_status === "vendu")
    .forEach((p) => {
      if (!p.created_at) return;
      const date = new Date(p.created_at);
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
        // month
        keyTimestamp = new Date(
          date.getFullYear(),
          date.getMonth(),
          1
        ).getTime();
      }

      const label = formatChartLabel(keyTimestamp);
      grouped[label] = (grouped[label] || 0) + 1;
    });

  return grouped;
}

const soldPostsChartData = computed(() => {
  const grouped = groupSoldPostsByPeriod(posts.value);
  const keys = Object.keys(grouped).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  return {
    categories: keys,
    series: [
      {
        name: "Annonces vendues",
        data: keys.map((k) => grouped[k] || 0),
      },
    ],
  };
});

const soldPostsOptions = computed(() => ({
  chart: {
    type: "bar",
    toolbar: { show: false },
    zoom: { enabled: false },
    fontFamily: "Inter, sans-serif",
  },

  plotOptions: {
    bar: {
      borderRadius: 8,
      borderRadiusApplication: "end",
      columnWidth: "15%",
      distributed: false,
    },
  },

  colors: ["#10B481"],

  dataLabels: {
    enabled: false,
  },

  xaxis: {
    categories: soldPostsChartData.value.categories,
    axisBorder: { show: false },
    axisTicks: { show: false },
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
      formatter: (val: number) => val.toString(),
    },
  },

  grid: {
    borderColor: "#F3F4F6",
    strokeDashArray: 4,
  },

  tooltip: {
    theme: "light",
    y: {
      formatter: (val: number) => `${val} annonces`,
    },
  },
}));
const rateChartData = computed(() => {
  const categories = stats.value.users.byCategory;

  const acheteur = categories["Acheteur"] || 0;
  const vendeur = categories["Vendeur"] || 0;
  const both = categories["Both"] || 0;

  const total = acheteur + vendeur + both;

  return {
    series: [
      total ? Math.round(acheteur) : 0,
      total ? Math.round(vendeur) : 0,
      total ? Math.round(both) : 0,
    ],
  };
});

const rateOptions = {
  labels: ["Acheteurs", "Vendeurs", "Both"],
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
  colors: ["#10b481", "#112830", "#C3ECDD"],
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
  }finally {
    loading.value = false;
  }
}

onMounted(() => {
  checkUser();
});

const startWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
const endWeek = endOfWeek(new Date(), { weekStartsOn: 1 });

const recentPosts = computed(
  () => posts.value
  // posts.value.filter((p) =>
  //   isWithinInterval(parseISO(p.created_at), { start: startWeek, end: endWeek })
  // )
);

const reports = ref<any[]>([]);
const loadingReports = ref(false);
const errorReports = ref("");

async function fetchReports() {
  loadingReports.value = true;
  errorReports.value = "";

  try {
    const token = localStorage.getItem("access_token");

    const res = await fetch(`${API_URL}/api/reports/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Erreur lors du chargement des reports");
    }

    const data = await res.json();
    reports.value = data;

    console.log("Reports récupérés :", JSON.stringify(data, null, 2));
  } catch (err: any) {
    errorReports.value = err.message;
    console.error("Erreur reports :", err);
  } finally {
    loadingReports.value = false;
  }
}

onMounted(() => {
  fetchReports();
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
