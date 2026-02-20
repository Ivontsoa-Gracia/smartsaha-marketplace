<template>
  <div class="min-h-screen bg-gray-50 font-sans">
    <section v-if="isMobile" class="bg-white border-b pt-16">
  <div class="px-4 py-6 space-y-6">

    <!-- SEARCH + FAVORITES -->
    <div class="space-y-3">
      <div class="relative">
        <i
          class="bx bx-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"
        ></i>
        <input
          v-model="filters.search"
          type="text"
          :placeholder="t('search')"
          class="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#10b481]/30 focus:border-[#10b481] outline-none text-gray-800 shadow-sm"
        />
      </div>

      <button
        @click="filters.onlyFavorites = !filters.onlyFavorites"
        class="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition"
        :class="
          filters.onlyFavorites
            ? 'bg-[#10b481] text-white shadow-md'
            : 'bg-gray-100 text-gray-700'
        "
      >
        <i
          class="bx"
          :class="filters.onlyFavorites ? 'bxs-heart' : 'bx-heart'"
        ></i>
        {{ t("favorites") }}
      </button>
    </div>

    <!-- FILTER BLOCK -->
    <div class="space-y-4">

      <!-- DATE -->
      <div class="space-y-2">
        <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Date
        </h4>

        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="(label, key) in {
              all: 'Tous',
              '7days': '7 jours',
              month: 'Mois',
              year: 'Année'
            }"
            :key="key"
            @click="filters.dateRange = key"
            class="py-2 rounded-lg text-sm font-medium transition"
            :class="
              filters.dateRange === key
                ? 'bg-[#10b481] text-white'
                : 'bg-gray-100 text-gray-700'
            "
          >
            {{ label }}
          </button>
        </div>
      </div>

      <!-- TYPE -->
      <div class="space-y-2">
        <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {{ t("type") }}
        </h4>

        <div class="flex gap-2">
          <button
            v-for="option in ['', 'Buying', 'Selling']"
            :key="option"
            @click="filters.type = option"
            class="flex-1 py-2 rounded-lg text-sm font-medium transition"
            :class="
              filters.type === option
                ? 'bg-[#10b481] text-white'
                : 'bg-gray-100 text-gray-700'
            "
          >
            {{ option || t("All") }}
          </button>
        </div>
      </div>

      <!-- PRICE -->
      <div class="space-y-2">
        <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {{ t("priceRange") }}
        </h4>

        <div class="flex gap-2">
          <input
            v-model.number="filters.minPrice"
            type="number"
            placeholder="Min"
            class="w-1/2 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-[#10b481]/30 focus:border-[#10b481] outline-none"
          />
          <input
            v-model.number="filters.maxPrice"
            type="number"
            placeholder="Max"
            class="w-1/2 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-[#10b481]/30 focus:border-[#10b481] outline-none"
          />
        </div>
      </div>

    </div>

    <!-- ACTIVE FILTERS -->
    <div class="flex flex-wrap gap-2">

      <span
        v-if="filters.search"
        class="bg-[#10b481] text-white px-3 py-1 rounded-full text-xs flex items-center gap-1"
      >
        {{ filters.search }}
        <button @click="filters.search = ''">
          <i class="bx bx-x text-xs"></i>
        </button>
      </span>

      <span
        v-if="filters.type"
        class="bg-[#10b481] text-white px-3 py-1 rounded-full text-xs flex items-center gap-1"
      >
        {{ filters.type }}
        <button @click="filters.type = ''">
          <i class="bx bx-x text-xs"></i>
        </button>
      </span>

    </div>

    <!-- RESET -->
    <button
      v-if="
        filters.search ||
        filters.type ||
        filters.minPrice != null ||
        filters.maxPrice != null ||
        filters.dateRange !== 'all'
      "
      @click="resetFilters"
      class="w-full py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold"
    >
      Reset
    </button>

  </div>
</section>


    <section v-else class="bg-[#fff] border-b pt-20">
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
                class="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#10b481]/20 focus:border-[#10b481] outline-none text-gray-800 shadow-sm transition"
              />
            </div>
            <button
              @click="filters.onlyFavorites = !filters.onlyFavorites"
              class="flex items-center gap-2 px-4 py-3 rounded border transition shadow-sm text-sm font-medium"
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
                class="w-full text-left px-4 py-3 rounded border border-gray-200 flex justify-between items-center text-gray-600 hover:border-[#10b481] transition shadow-sm"
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
            <h4 class="text-sm font-semibold text-gray-700">{{ t("type") }}</h4>
            <button
              @click="showTypeDropdown = !showTypeDropdown"
              class="w-full text-left px-4 py-3 rounded border border-gray-200 flex justify-between items-center text-gray-600 hover:border-[#10b481] transition shadow-sm"
            >
              <span>{{ filters.type || t("All") }}</span>
              <i
                :class="
                  showTypeDropdown ? 'bx bx-chevron-up' : 'bx bx-chevron-down'
                "
              ></i>
            </button>

            <transition name="fade">
              <div
                v-if="showTypeDropdown"
                class="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded shadow-lg z-50"
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
            <h4 class="text-sm font-semibold text-gray-700">Labels</h4>
            <button
              @click="showLabelDropdown = !showLabelDropdown"
              class="w-full flex justify-between items-center px-4 py-3 rounded border border-gray-200 text-sm text-gray-700 hover:border-[#10b481] transition shadow-sm"
            >
              <span>{{
                selectedLabels.length
                  ? `${selectedLabels.length} selected`
                  : "Select labels"
              }}</span>
              <i
                class="bx"
                :class="showLabelDropdown ? 'bx-chevron-up' : 'bx-chevron-down'"
              ></i>
            </button>

            <transition name="fade">
              <div
                v-if="showLabelDropdown"
                class="absolute z-20 left-0 right-0 mt-2 bg-white border rounded shadow-lg max-h-56 overflow-y-auto"
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
                  <span class="text-gray-700 font-medium">{{
                    label.name
                  }}</span>
                </label>
              </div>
            </transition>
          </div>

          <div class="space-y-3 relative w-full" ref="locationDropdownRef">
            <h4 class="text-sm font-semibold text-gray-700">
              {{ t("location") }}
            </h4>

            <input
              v-model="locationSearch"
              type="text"
              placeholder="Search location..."
              class="w-full px-4 py-3 rounded border border-gray-200 text-sm outline-none shadow-sm cursor-pointer"
              @click="showLocationDropdown = !showLocationDropdown"
            />

            <transition name="fade">
              <div
                v-if="showLocationDropdown"
                class="absolute top-full left-0 mt-1 w-full max-h-40 overflow-y-auto border border-gray-200 rounded bg-white shadow-lg z-50"
              >
                <label
                  v-for="loc in filteredLocations"
                  :key="loc"
                  class="flex items-center gap-2 px-4 py-3 text-sm text-gray-600 cursor-pointer hover:bg-gray-50"
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
            <h4 class="text-sm font-semibold text-gray-700">
              {{ t("priceRange") }}
            </h4>
            <div class="flex gap-2">
              <input
                v-model.number="filters.minPrice"
                type="number"
                placeholder="Min"
                class="w-1/2 px-4 py-3 rounded border border-gray-200 text-sm outline-none shadow-sm"
              />
              <input
                v-model.number="filters.maxPrice"
                type="number"
                placeholder="Max"
                class="w-1/2 px-4 py-3 rounded border border-gray-200 text-sm outline-none shadow-sm"
              />
            </div>
          </div>
        </div>

        <!-- ACTIF FILTER -->
        <div class="flex flex-wrap gap-2 mt-4 items-center">
          <span
            v-if="filters.search"
            class="flex items-center gap-2 bg-[#10b481] text-white px-4 py-3 rounded-full text-xs font-medium shadow-sm hover:bg-[#10b481]/90 transition"
          >
            {{ filters.search }}
            <button
              @click="filters.search = ''"
              class="flex items-center justify-center w-4 h-4 text-gray-100 hover:text-white rounded-full transition"
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

          <!-- Bouton Reset, toujours à droite -->
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
            class="ml-auto px-5 text-gray-700 underline font-semibold transition whitespace-nowrap"
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
        class="text-center text-gray-500 py-20"
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
