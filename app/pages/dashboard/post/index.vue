<template>
  <div class="space-y-8 p-4 sm:p-12 bg-gray-50/60 min-h-screen">
    <div class="flex items-center justify-between flex-wrap gap-3">
  <h2 class="text-xl font-bold text-gray-800 flex-1 min-w-0">
    {{ t("myListings") }}
  </h2>

  <button
    @click="$router.push('/dashboard/post/create')"
    class="flex items-center justify-center gap-2 btn-primary whitespace-nowrap"
  >
    <i class="bx bx-plus text-sm"></i>
    <span class="text-sm font-medium">{{ t("newListings") }}</span>
  </button>
</div>


    <div class="sm:hidden">
      <div class="flex items-center gap-3">
        <div
          class="relative flex-1 border border-gray-200 rounded-xl bg-white shadow-sm py-1"
        >
          <i
            class="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          ></i>
          <input
            v-model="filters.query"
            type="text"
            class="w-full pl-10 pr-3 py-2 text-sm bg-transparent focus:outline-none"
            placeholder="Rechercher..."
          />
        </div>

        <button
          @click="showMobileFilters = !showMobileFilters"
          class="p-2 btn-neutre"
        >
          <i class="bx bx-filter-alt text-gray-400"></i>
        </button>
      </div>

      <transition name="fade">
        <div
          v-if="showMobileFilters"
          class="mt-3 bg-white border border-gray-200 rounded-xl shadow-md p-4 space-y-4"
        >
          <select
            v-model="filters.status"
            class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#10b481]/30"
          >
            <option value="">{{ t("all") }}</option>
            <option value="brouillon">{{ t("Draft") }}</option>
            <option value="published">{{ t("Published") }}</option>
            <option value="négociation">{{ t("Negotiation") }}</option>
            <option value="vendu">{{ t("Sold") }}</option>
            <option value="supprimé">{{ t("Deleted") }}</option>
          </select>

          <div class="space-y-2">
            <label
              v-for="(label, key) in dateOptions"
              :key="key"
              class="flex items-center gap-2 text-sm text-gray-600"
            >
              <input
                type="radio"
                :value="key"
                v-model="filters.dateRange"
                class="accent-[#10b481]"
              />
              {{ label }}
            </label>
          </div>
        </div>
      </transition>
    </div>

    <div
      class="hidden sm:flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-2 bg-white shadow-sm transition"
    >
      <!-- Search -->
      <div class="relative flex-1">
        <i
          class="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        ></i>
        <input
          v-model="filters.query"
          type="text"
          class="w-full pl-10 pr-3 py-2 text-sm bg-transparent focus:outline-none text-gray-800 placeholder-gray-400"
          placeholder="Rechercher par produit ou titre"
        />
      </div>

      <!-- Divider -->
      <div class="w-px h-6 bg-gray-200"></div>

      <!-- Status -->
      <select
        v-model="filters.status"
        class="text-sm text-gray-600 bg-transparent focus:outline-none cursor-pointer hover:text-gray-800 transition"
      >
        <option value="">{{ t("all") }}</option>
        <option value="brouillon">{{ t("Draft") }}</option>
        <option value="published">{{ t("Published") }}</option>
        <option value="négociation">{{ t("Negotiation") }}</option>
        <option value="vendu">{{ t("Sold") }}</option>
        <option value="supprimé">{{ t("Deleted") }}</option>
      </select>

      <!-- Divider -->
      <div class="w-px h-6 bg-gray-200"></div>

      <!-- Date filter -->
      <div class="relative">
        <button
          @click="showDateDropdown = !showDateDropdown"
          class="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition"
        >
          <span class="whitespace-nowrap">{{ dateLabel }}</span>
          <i
            :class="
              showDateDropdown
                ? 'bx bx-chevron-up text-base'
                : 'bx bx-chevron-down text-base'
            "
          ></i>
        </button>

        <transition name="fade">
          <div
            v-if="showDateDropdown"
            class="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 min-w-full overflow-hidden"
          >
            <label
              v-for="(label, key) in dateOptions"
              :key="key"
              class="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 cursor-pointer hover:bg-gray-50 transition"
            >
              <input
                type="radio"
                :value="key"
                v-model="filters.dateRange"
                class="accent-[#10b481]/50"
              />
              <span>{{ label }}</span>
            </label>
          </div>
        </transition>
      </div>
    </div>

    <div class="flex flex-wrap gap-4 items-center border-b pb-4">
      <button @click="filterCategory('All')" :class="categoryClass('All')">
        {{ t("All") }}
      </button>
      <button
        @click="filterCategory('Buying')"
        :class="categoryClass('Buying')"
      >
        {{ t("Buying") }}
      </button>
      <button
        @click="filterCategory('Selling')"
        :class="categoryClass('Selling')"
      >
        {{ t("Selling") }}
      </button>
    </div>

    <div
      v-if="filteredPosts.length"
      class="overflow-x-auto bg-white rounded-2xl shadow-sm"
    >
      <table class="min-w-[700px] w-full text-left border-collapse">
        <thead class="bg-[#FAFAF9]">
          <tr>
            <th
              @click="sortBy('product.product')"
              class="cursor-pointer px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
            >
              {{ t("product") }} <i class="bxr bx-carets-up-down"></i>
            </th>
            <th
              @click="sortBy('quantity')"
              class="cursor-pointer px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
            >
              {{ t("quantity") }} <i class="bxr bx-carets-up-down"></i>
            </th>
            <th
              @click="sortBy('price')"
              class="cursor-pointer px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
            >
              {{ t("price") }} <i class="bxr bx-carets-up-down"></i>
            </th>
            <th
              @click="sortBy('type_post.type')"
              class="cursor-pointer px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
            >
              {{ t("category") }} <i class="bxr bx-carets-up-down"></i>
            </th>
            <th
              @click="sortBy('created_at')"
              class="cursor-pointer px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
            >
              {{ t("date") }} <i class="bxr bx-carets-up-down"></i>
            </th>
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
          <tr
            v-for="post in paginatedPosts"
            :key="post.id"
            class="hover:bg-gray-50 transition"
          >
            <!-- Product -->
            <td class="px-6 py-3 border-b text-sm text-gray-900">
              <div class="flex items-center gap-3">
                <img
                  v-if="post.image_url"
                  :src="post.image_url"
                  alt="Product image"
                  class="w-12 h-12 object-cover rounded-md border"
                />
                <span class="font-medium text-gray-800">{{
                  post.product.product
                }}</span>
              </div>
            </td>

            <!-- Quantity -->
            <td
              class="px-6 py-3 border-b text-sm text-gray-700 whitespace-nowrap"
            >
              {{ post.quantity }} {{ post.product.unit.abbreviation }}
            </td>

            <!-- Price -->
            <td
              class="px-6 py-3 border-b text-sm text-gray-700 whitespace-nowrap"
            >
              {{ post.price }} {{ post.currency.symbol }}
            </td>

            <!-- Category -->
            <td class="px-6 py-3 border-b text-sm">
              <span
                :class="[
                  'px-3 py-1 text-xs font-semibold rounded-full border whitespace-nowrap',
                  post.type_post?.type === 'Selling'
                    ? 'border-[#10b481] text-[#10b481] bg-[#10b481]/10'
                    : 'border-[#f4a261] text-[#f4a261] bg-[#f4a261]/10',
                ]"
              >
                {{ post.type_post?.type }}
              </span>
            </td>

            <!-- Date -->
            <td
              class="px-6 py-3 border-b text-sm text-gray-600 whitespace-nowrap"
            >
              {{ formatDate(post.created_at) }}
            </td>

            <!-- Status -->
            <td class="px-6 py-3 border-b text-sm">
              <span
                :class="[
                  'px-3 py-1 text-xs font-semibold rounded-full border whitespace-nowrap',
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

            <!-- Actions -->
            <td class="px-6 py-3 border-b text-center">
              <div class="flex items-center justify-center gap-2">
                <NuxtLink
                  :to="`/dashboard/post/bids/${post.id}`"
                  class="relative p-2 rounded-full hover:bg-[#10b481]/10 transition"
                  title="Voir les offres"
                >
                  <i class="bx bx-receipt text-lg text-[#10b481]"></i>
                  <span
                    v-if="post.total_bids > 0"
                    class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-semibold bg-red-600 text-white rounded-full shadow"
                    >{{ post.total_bids }}</span
                  >
                </NuxtLink>

                <button
                  class="p-2 rounded-full hover:bg-[#f4a261]/10 transition"
                  title="Modifier"
                >
                  <i class="bx bx-edit text-[#f4a261] text-lg"></i>
                </button>

                <button
                  class="p-2 rounded-full hover:bg-[#e63946]/10 transition"
                  title="Supprimer"
                >
                  <i class="bx bx-trash text-[#e63946] text-lg"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="bg-white px-4 py-4 flex items-center justify-between sm:px-6">
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

    <div v-else class="text-gray-500 italic">{{ t("noListingsFound") }}</div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { parseISO, formatDistanceToNow } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import Breadcrumb from "~/components/Breadcrumb.vue";
import { API_URL } from "~/utils/config";
import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";
import { useRouter } from "vue-router";

definePageMeta({ layout: "dashboard" });

const router = useRouter();
const languageStore = useLanguageStore();
const t = (key) => translate[languageStore.lang][key] || key;

const userPosts = ref([]);
const result = ref(0);
const currentPage = ref(1);
const itemsPerPage = 4;

const selectedType = ref("All");
const showDateDropdown = ref(false);
const showMobileFilters = ref(false);
const filters = reactive({
  parcel_name: "",
  title: "",
  status: "",
  dateRange: "all",
});

const dateOptions = {
  all: "Tous",
  "7days": "Derniers 7 jours",
  month: "Ce mois",
  year: "Cette année",
};

const dateLabel = computed(() => dateOptions[filters.dateRange] || "Tous");

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

const sortKey = ref(null);
const sortAsc = ref(true);

function sortBy(key) {
  if (sortKey.value === key) sortAsc.value = !sortAsc.value;
  else {
    sortKey.value = key;
    sortAsc.value = true;
  }
}

const filterCategory = (category) => {
  selectedType.value = category;
  currentPage.value = 1;
};
const categoryClass = (category) => [
  "relative pb-1 font-medium text-gray-700 hover:text-[#10b481] transition-colors text-sm",
  selectedType.value === category
    ? "after:absolute after:-bottom-0.5 after:left-0 after:w-full after:h-0.5 after:bg-[#10b481]"
    : "",
];

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

const fetchUserPosts = async () => {
  try {
    const res = await fetch(`${API_URL}/api/posts/my_posts/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    const data = await res.json();
    userPosts.value = data;
    result.value = data.length;
  } catch (err) {
    console.error(err);
  }
};

onMounted(fetchUserPosts);
const refreshPosts = () => fetchUserPosts();

const filteredPosts = computed(() => {
  return userPosts.value
    .filter(
      (p) =>
        selectedType.value === "All" || p.type_post?.type === selectedType.value
    )
    .filter((p) => !filters.status || p.current_status === filters.status)
    .filter((p) => {
      if (!filters.query) return true;
      const q = filters.query.toLowerCase();
      const productName = p.product.product?.toLowerCase() || "";
      const title = p.product.title?.toLowerCase() || "";
      return productName.includes(q) || title.includes(q);
    })
    .filter((p) => {
      if (filters.dateRange === "all") return true;
      const date = new Date(p.created_at);
      const now = new Date();
      if (filters.dateRange === "7days")
        return (now - date) / (1000 * 60 * 60 * 24) <= 7;
      if (filters.dateRange === "month")
        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      if (filters.dateRange === "year")
        return date.getFullYear() === now.getFullYear();
      return true;
    })
    .sort((a, b) => {
      if (!sortKey.value) return 0;
      const keys = sortKey.value.split(".");
      let valA = keys.reduce((acc, k) => acc?.[k], a) || "";
      let valB = keys.reduce((acc, k) => acc?.[k], b) || "";
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();
      if (valA < valB) return sortAsc.value ? -1 : 1;
      if (valA > valB) return sortAsc.value ? 1 : -1;
      return 0;
    });
});

const totalPages = computed(() =>
  Math.ceil(filteredPosts.value.length / itemsPerPage)
);
const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredPosts.value.slice(start, start + itemsPerPage);
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
</script>

<style scoped>
.animate-spin-once {
  animation: spin 0.7s linear;
}
@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
