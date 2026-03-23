<template>
  <div class="min-h-screen bg-gray-50 font-sans">
    <section v-if="isMobile" class="bg-white border-b sticky top-0 z-40">
      <div class="flex items-center gap-2 px-4 py-3">
        
        <div class="relative flex-1 content">
          <i
            class="bx bx-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          ></i>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Search..."
            class="w-full pl-10 pr-4 py-2.5 content rounded-lg border border-gray-200 text-sm outline-none content"
          />
        </div>

        <button @click="showMobileFilters = true" class="relative btn-neutre">
          <i class="bx bx-slider-alt text-sm"></i>

          <span
            v-if="activeFiltersCount"
            class="absolute -top-1 -right-1 bg-[#10b481] text-white content text-[10px] w-5 h-5 flex items-center justify-center rounded-full"
          >
            {{ activeFiltersCount }}
          </span>
        </button>
      </div>
      <transition name="slide-up">
        <div
          v-if="showMobileFilters"
          class="fixed inset-0 bg-black/40 z-50 flex items-end"
        >
          <div
            class="bg-white w-full rounded-t-2xl p-5 max-h-[85vh] overflow-y-auto"
          >
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-semibold text-lg">Filters</h3>
              <button @click="showMobileFilters = false">
                <i class="bx bx-x text-xl"></i>
              </button>
            </div>


            <div class="mb-6">
              <h4 class="label mb-3">
                {{ t("type") }}
              </h4>

              <div class="flex gap-2">
                <button
                  @click="filters.type = ''"
                  class="flex-1 py-2 rounded-xl border text-sm content"
                  :class="
                    filters.type === ''
                      ? 'bg-[#10b481] text-white border-[#10b481]'
                      : 'border-gray-200 text-gray-600'
                  "
                >
                  {{ t("All") }}
                </button>

                <button
                  @click="filters.type = 'Buying'"
                  class="flex-1 py-2 rounded-xl border text-sm content"
                  :class="
                    filters.type === 'Buying'
                      ? 'bg-[#10b481] text-white border-[#10b481]'
                      : 'border-gray-200 text-gray-600'
                  "
                >
                  Buying
                </button>

                <button
                  @click="filters.type = 'Selling'"
                  class="flex-1 py-2 rounded-xl border text-sm content"
                  :class="
                    filters.type === 'Selling'
                      ? 'bg-[#10b481] text-white border-[#10b481]'
                      : 'border-gray-200 text-gray-600'
                  "
                >
                  Selling
                </button>
              </div>
            </div>

            <div class="mb-6">
              <h4 class="label mb-3">Labels</h4>

              <div class="space-y-2">
                <label
                  v-for="label in labels"
                  :key="label.id"
                  class="flex items-center gap-3"
                >
                  <input
                    type="checkbox"
                    :value="label.id"
                    v-model="selectedLabels"
                    class="accent-[#10b481]"
                  />

                  <span
                    class="w-3 h-3 rounded-full"
                    :style="{ backgroundColor: label.color }"
                  ></span>

                  <span class="text-sm text-gray-700">
                    {{ label.name }}
                  </span>
                </label>
              </div>
            </div>
            <div class="mb-6">
              <h4 class="label mb-3">
                {{ t("location") }}
              </h4>

              <input
                v-model="locationSearch"
                type="text"
                placeholder="Search location..."
                class="w-full mb-3 px-4 py-2.5 rounded-xl content border border-gray-200 text-sm outline-none"
              />

              <div class="max-h-40 overflow-y-auto space-y-2">
                <label
                  v-for="loc in filteredLocations"
                  :key="loc"
                  class="flex items-center gap-2 text-sm text-gray-700"
                >
                  <input
                    type="checkbox"
                    :value="loc"
                    v-model="filters.locations"
                    class="accent-[#10b481]"
                  />
                  {{ loc }}
                </label>
              </div>
            </div>
            <div class="mb-6">
              <h4 class="label mb-3">
                {{ t("priceRange") }}
              </h4>

              <div class="flex gap-2">
                <input
                  v-model.number="filters.minPrice"
                  type="number"
                  placeholder="Min"
                  class="w-1/2 px-4 py-2.5 rounded-xl content border border-gray-200 text-sm outline-none"
                />

                <input
                  v-model.number="filters.maxPrice"
                  type="number"
                  placeholder="Max"
                  class="w-1/2 px-4 py-2.5 rounded-xl content border border-gray-200 text-sm outline-none"
                />
              </div>
            </div>
            <div class="mb-6">
              <h4 class="label mb-3">Date</h4>

              <div class="space-y-2">
                <label
                  v-for="(label, key) in {
                    all: 'Tous',
                    '7days': '7 jours',
                    month: 'Ce mois',
                    year: 'Cette année',
                  }"
                  :key="key"
                  class="flex items-center gap-2 text-sm text-gray-700"
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

            <button
              v-if="
                filters.search ||
                filters.type ||
                selectedLabels.length ||
                filters.locations.length ||
                filters.minPrice != null ||
                filters.maxPrice != null ||
                (filters.dateRange && filters.dateRange !== 'all')
              "
              @click="resetFilters"
              class="w-full mt-6 btn-primary"
            >
              Reset
            </button>
          </div>
        </div>
      </transition>
    </section>

    <section v-else class="bg-white border-b pt-20">
      <div class="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div
          class="sticky top-0 z-40 backdrop-blur border-b border-gray-200 py-4"
        >
          <div class="max-w-7xl mx-auto flex gap-3 items-center">
            <div class="relative flex-1">
              <i
                class="bx bx-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"
              ></i>
              <input
                v-model="filters.search"
                type="text"
                :placeholder="t('search')"
                class="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#10b481]/20 focus:border-[#10b481] outline-none content shadow-sm transition"
              />
            </div>
            <button
              @click="filters.onlyFavorites = !filters.onlyFavorites"
              class="flex items-center gap-2 px-4 py-3 rounded-lg border transition shadow-sm text-sm font-medium small"
              :class="
                filters.onlyFavorites
                  ? 'bg-[#10b481] text-white border-[#10b481]'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              "
            >
              <i
                class="bx"
                :class="
                  filters.onlyFavorites ? 'bxs-heart text-white' : 'bx-heart'
                "
              ></i>

              <span>{{ t("favorites") }}</span>
            </button>

            <div class="relative text-sm font-medium inline-block">
              <button
                @click="showDateDropdown = !showDateDropdown"
                class="w-full text-left px-4 py-3 rounded border border-gray-200 flex justify-between items-center content hover:border-[#10b481] transition shadow-sm"
              >
                <span>
                  {{
                    filters.dateRange === "7days"
                      ? "Derniers 7 jours"
                      : filters.dateRange === "month"
                      ? "Ce mois"
                      : filters.dateRange === "year"
                      ? "Cette année"
                      : "Tous"
                  }}
                </span>
                <i
                  :class="
                    showDateDropdown ? 'bx bx-chevron-up' : 'bx bx-chevron-down'
                  "
                ></i>
              </button>

              <transition name="fade">
                <div
                  v-if="showDateDropdown"
                  class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-50 w-max min-w-full"
                >
                  <label
                    v-for="(label, key) in {
                      all: 'Tous',
                      '7days': '7 jours',
                      month: 'Ce mois',
                      year: 'Cette année',
                    }"
                    :key="key"
                    class="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-gray-50 transition"
                  >
                    <input
                      type="radio"
                      :value="key"
                      v-model="filters.dateRange"
                      class="accent-[#10b481]"
                    />
                    <span class="text-gray-600">{{ label }}</span>
                  </label>
                </div>
              </transition>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          <div class="space-y-3 relative w-full text-sm" ref="typeDropdownRef">
            <h4 class="label">{{ t("type") }}</h4>
            <button
              @click="showTypeDropdown = !showTypeDropdown"
              class="w-full text-left px-4 py-3 rounded-lg border border-gray-200 flex justify-between items-center text-gray-600 hover:border-[#10b481] transition shadow-sm"
            >
              <span class="text-gray-400 small">{{ filters.type || t("All") }}</span>
              <i
                :class="
                  showTypeDropdown ? 'bx bx-chevron-up' : 'bx bx-chevron-down'
                "
              ></i>
            </button>

            <transition name="fade">
              <div
                v-if="showTypeDropdown"
                class="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50"
              >
                <label
                  v-for="option in ['', 'Buying', 'Selling']"
                  :key="option"
                  class="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-gray-50 transition"
                >
                  <input
                    type="radio"
                    :value="option"
                    v-model="filters.type"
                    class="accent-[#10b481]"
                  />
                  <span class="text-gray-600">{{
                    option ? option : t("All")
                  }}</span>
                </label>
              </div>
            </transition>
          </div>

          <div class="space-y-3 relative">
            <h4 class="label">Labels</h4>
            <button
              @click="showLabelDropdown = !showLabelDropdown"
              class="w-full flex justify-between items-center px-4 py-3 rounded-lg border border-gray-200 content hover:border-[#10b481] transition shadow-sm"
            >
              <span class="text-gray-400">{{
                selectedLabels.length
                  ? `${selectedLabels.length} selected`
                  : "Select labels"
              }}</span>
              <i
                class="bx text-gray-400"
                :class="showLabelDropdown ? 'bx-chevron-up' : 'bx-chevron-down'"
              ></i>
            </button>

            <transition name="fade">
              <div
                v-if="showLabelDropdown"
                class="absolute z-20 left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg max-h-56 overflow-y-auto"
              >
                <label
                  v-for="label in labels"
                  :key="label.id"
                  class="flex items-center gap-3 px-4 py-2 text-sm cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    :value="label.id"
                    v-model="selectedLabels"
                    class="accent-[#10b481]"
                  />
                  <span
                    class="w-3 h-3 rounded-full"
                    :style="{ backgroundColor: label.color }"
                  ></span>
                  <span class="content">{{
                    label.name
                  }}</span>
                </label>
              </div>
            </transition>
          </div>

          <div class="space-y-3 relative w-full" ref="locationDropdownRef">
            <h4 class="label">
              {{ t("location") }}
            </h4>

            <input
              v-model="locationSearch"
              type="text"
              placeholder="Search location..."
              class="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm outline-none shadow-sm cursor-pointer content"
              @click="showLocationDropdown = !showLocationDropdown"
            />

            <transition name="fade">
              <div
                v-if="showLocationDropdown"
                class="absolute top-full left-0 mt-1 w-full max-h-40 overflow-y-auto border border-gray-200 rounded-lg bg-white shadow-lg z-50"
              >
                <label
                  v-for="loc in filteredLocations"
                  :key="loc"
                  class="flex items-center gap-2 px-4 py-3 content cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    :value="loc"
                    v-model="filters.locations"
                    class="accent-[#10b481]"
                  />
                  {{ loc }}
                </label>

                <div
                  v-if="filteredLocations.length === 0"
                  class="px-4 py-3 text-gray-400 text-sm"
                >
                  No results found.
                </div>
              </div>
            </transition>
          </div>

          <div class="space-y-3">
            <h4 class="label">
              {{ t("priceRange") }}
            </h4>
            <div class="flex gap-2">
              <input
                v-model.number="filters.minPrice"
                type="number"
                placeholder="Min"
                class="w-1/2 px-4 py-3 rounded-lg border border-gray-200 text-sm outline-none shadow-sm content"
              />
              <input
                v-model.number="filters.maxPrice"
                type="number"
                placeholder="Max"
                class="w-1/2 px-4 py-3 rounded-lg border border-gray-200 text-sm outline-none shadow-sm content"
              />
            </div>
          </div>
        </div>

        <div class="flex flex-wrap gap-2 mt-4 items-center small text-sm">
          <span
            v-if="filters.search"
            class="flex items-center gap-2 bg-[#10b481] text-white px-4 py-3 rounded-full text-xs font-medium shadow-sm hover:bg-[#10b481]/90 transition"
          >
            {{ filters.search }}
            <button
              @click="filters.search = ''"
              class="flex items-center justify-center w-4 h-4 text-gray-100 hover:text-white rounded-full transition "
            >
              <i class="bx bx-x text-sm"></i>
            </button>
          </span>

          <span
            v-if="filters.type"
            class="flex items-center gap-2 bg-[#10b481] text-white px-4 py-3 rounded-full text-xs font-medium shadow-sm hover:bg-[#10b481]/90 transition"
          >
            {{ filters.type }}
            <button
              @click="filters.type = ''"
              class="flex items-center justify-center w-4 h-4 text-gray-100 hover:text-white rounded-full transition"
            >
              <i class="bx bx-x text-sm"></i>
            </button>
          </span>

          <span
            v-for="id in selectedLabels"
            :key="id"
            class="flex items-center gap-2 bg-[#10b481] text-white px-4 py-3 rounded-full text-xs font-medium shadow-sm hover:bg-[#10b481]/90 transition"
          >
            {{ getLabelName(id) }}
            <button
              @click="selectedLabels = selectedLabels.filter((l) => l !== id)"
              class="flex items-center justify-center w-4 h-4 text-gray-100 hover:text-white rounded-full transition"
            >
              <i class="bx bx-x text-sm"></i>
            </button>
          </span>

          <span
            v-for="loc in filters.locations"
            :key="loc"
            class="flex items-center gap-2 bg-[#10b481] text-white px-4 py-3 rounded-full text-xs font-medium shadow-sm hover:bg-[#10b481]/90 transition"
          >
            {{ loc }}
            <button
              @click="
                filters.locations = filters.locations.filter((l) => l !== loc)
              "
              class="flex items-center justify-center w-4 h-4 text-gray-100 hover:text-white rounded-full transition"
            >
              <i class="bx bx-x text-sm"></i>
            </button>
          </span>

          <span
            v-if="filters.minPrice || filters.maxPrice"
            class="flex items-center gap-2 bg-[#10b481] text-white px-4 py-3 rounded-full text-xs font-medium shadow-sm hover:bg-[#10b481]/90 transition"
          >
            {{ filters.minPrice || 0 }} - {{ filters.maxPrice || "∞" }}
            <button
              @click="
                filters.minPrice = null;
                filters.maxPrice = null;
              "
              class="flex items-center justify-center w-4 h-4 text-gray-100 hover:text-white rounded-full transition"
            >
              <i class="bx bx-x text-sm"></i>
            </button>
          </span>

          <span
            v-if="filters.dateRange && filters.dateRange !== 'all'"
            class="flex items-center gap-2 bg-[#10b481] text-white px-4 py-3 rounded-full text-xs font-medium shadow-sm hover:bg-[#10b481]/90 transition"
          >
            {{
              filters.dateRange === "7days"
                ? "Derniers 7 jours"
                : filters.dateRange === "month"
                ? "Ce mois"
                : filters.dateRange === "year"
                ? "Cette année"
                : "Tous"
            }}
            <button
              @click="filters.dateRange = 'all'"
              class="flex items-center justify-center w-4 h-4 text-gray-100 hover:text-white rounded-full transition"
            >
              <i class="bx bx-x text-sm"></i>
            </button>
          </span>

          <button
            v-if="
              filters.search ||
              filters.type ||
              selectedLabels.length ||
              filters.locations.length ||
              filters.minPrice != null ||
              filters.maxPrice != null ||
              (filters.dateRange && filters.dateRange !== 'all')
            "
            @click="resetFilters"
            class="ml-auto px-5 menu-item underline transition whitespace-nowrap"
          >
            Reset
          </button>
        </div>
      </div>
    </section>

    <main class="max-w-7xl mx-auto px-6 py-10">
      <div v-if="loading" class="flex justify-center py-20">
        <div
          class="w-10 h-10 border-4 border-gray-200 border-t-[#10b481] rounded-full animate-spin"
        ></div>
      </div>

      <div
        v-else-if="filteredPosts.length === 0"
        class="text-center text-gray-500 py-20 small"
      >
        No posts found.
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          v-for="post in filteredPosts"
          :key="post.id"
          :post="post"
          class="w-full"
        />
      </div>
    </main>
  </div>
</template>
<script setup>
definePageMeta({
  layout: "market",
});

import { ref, computed, onMounted, onUnmounted, onBeforeUnmount } from "vue";
import Card from "~/components/Card.vue";
import { API_URL } from "~/utils/config";
import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";

const languageStore = useLanguageStore();
const t = (key) => translate[languageStore.lang][key] || key;

const filters = ref({
  search: "",
  type: "",
  locations: [],
  minPrice: null,
  maxPrice: null,
  onlyFavorites: false,
  dateRange: "all",
});

const isMobile = ref(false);

function checkMobile() {
  isMobile.value = window.innerWidth <= 640; // ≤640px = sm breakpoint Tailwind
}

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});

const showMobileFilters = ref(false);

const activeFiltersCount = computed(() => {
  const f = filters.value;

  return [
    f.search,
    f.type,
    f.locations.length > 0,
    f.minPrice != null,
    f.maxPrice != null,
    f.onlyFavorites,
    f.dateRange !== "all",
    selectedLabels.value.length > 0,
  ].filter(Boolean).length;
});

const locationSearch = ref("");
const posts = ref([]);
const loading = ref(false);

const labels = ref([]);
const selectedLabels = ref([]);
const showLabelDropdown = ref(false);
const showDateDropdown = ref(false);

const fetchLabels = async () => {
  try {
    const token = localStorage.getItem("access_token");

    const res = await fetch(`${API_URL}/api/label/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("Failed to fetch labels");
    labels.value = await res.json();
  } catch (e) {
    console.error(e);
  }
};

const showLocationDropdown = ref(false);
const locationDropdownRef = ref(null);

const handleClickOutsideLocation = (e) => {
  if (
    locationDropdownRef.value &&
    !locationDropdownRef.value.contains(e.target)
  ) {
    showLocationDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutsideLocation);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutsideLocation);
});

const filteredLocations = computed(() => {
  const allLocations = posts.value.map((p) => p.location);
  const unique = [...new Set(allLocations)];
  if (!locationSearch.value) return unique;
  return unique.filter((loc) =>
    loc.toLowerCase().includes(locationSearch.value.toLowerCase())
  );
});

const showTypeDropdown = ref(false);
const typeDropdownRef = ref(null);

const handleClickOutsideType = (e) => {
  if (typeDropdownRef.value && !typeDropdownRef.value.contains(e.target)) {
    showTypeDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutsideType);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutsideType);
});

const favoritePostIds = ref([]);

async function fetchUserFavorites() {
  const token = localStorage.getItem("access_token");
  if (!token) return;

  try {
    const res = await fetch(`${API_URL}/api/favorites/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return;

    const data = await res.json();

    favoritePostIds.value = data.map((fav) => fav.id_post);
    console.log("Favoris récupérés:", favoritePostIds.value);
  } catch (e) {
    console.error("Erreur récupération favoris", e);
  }
}

const filteredPosts = computed(() => {
  return posts.value.filter((post) => {
    const matchSearch = filters.value.search
      ? post.product.product
          .toLowerCase()
          .includes(filters.value.search.toLowerCase())
      : true;

    const matchType = filters.value.type
      ? post.type_post.type === filters.value.type
      : true;

    const matchLocation = filters.value.locations.length
      ? filters.value.locations.includes(post.location)
      : true;

    const matchMin =
      filters.value.minPrice != null
        ? post.price >= filters.value.minPrice
        : true;

    const matchMax =
      filters.value.maxPrice != null
        ? post.price <= filters.value.maxPrice
        : true;

    const matchLabels = selectedLabels.value.length
      ? post.labels?.some((label) => selectedLabels.value.includes(label.id))
      : true;

    const matchFavorite = filters.value.onlyFavorites
      ? favoritePostIds.value.includes(post.id)
      : true;

    const matchDate = (() => {
      if (!filters.value.dateRange || filters.value.dateRange === "all")
        return true;

      const postDate = new Date(post.updated_at);
      const now = new Date();

      if (filters.value.dateRange === "7days") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        return postDate >= sevenDaysAgo;
      }

      if (filters.value.dateRange === "month") {
        return (
          postDate.getMonth() === now.getMonth() &&
          postDate.getFullYear() === now.getFullYear()
        );
      }

      if (filters.value.dateRange === "year") {
        return postDate.getFullYear() === now.getFullYear();
      }

      return true;
    })();

    return (
      matchSearch &&
      matchType &&
      matchLocation &&
      matchMin &&
      matchMax &&
      matchLabels &&
      matchFavorite &&
      matchDate
    );
  });
});

const fetchPosts = async () => {
  loading.value = true;
  try {
    const res = await fetch(`${API_URL}/api/posts/`);
    const data = await res.json();
    posts.value = data.filter(
      (post) =>
        post.can_receive_bids &&
        (post.current_status === "published" ||
          post.current_status === "négociation")
    );
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchPosts();
  fetchLabels();
  fetchUserFavorites();
});

const resetFilters = () => {
  filters.value.search = "";
  filters.value.type = "";
  filters.value.locations = [];
  filters.value.minPrice = null;
  filters.value.maxPrice = null;
  filters.value.dateRange = "all";
  selectedLabels.value = [];
};

const getLabelName = (id) => {
  const label = labels.value.find((l) => l.id === id);
  return label ? label.name : "";
};
</script>
