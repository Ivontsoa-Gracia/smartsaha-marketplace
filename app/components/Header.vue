<template>
  <header
    :class="[
      'fixed top-0 left-0 w-full z-50  transition-all duration-300',
      isScrolled ? 'bg-white/90 shadow-sm backdrop-blur-md' : 'bg-transparent',
    ]"
  >
    <div class="max-w-7xl mx-auto flex items-center justify-between h-20 px-6">
      <!-- LOGO -->
      <NuxtLink to="/" class="flex items-center gap-4 group">
        <img
          src="/marketplace_png.png"
          alt="Logo"
          class="h-10 w-auto rounded-xl transition-transform duration-300 group-hover:scale-105"
        />
        <div class="leading-tight">
          <h1 class="text-lg font-bold tracking-tight text-gray-900">
            AgriTrade
          </h1>
          <p class="text-[10px] uppercase tracking-wider text-gray-400">
            SmartSaha Marketplace
          </p>
        </div>
      </NuxtLink>

      <!-- NAVIGATION DESKTOP -->
      <nav class="hidden md:flex items-center gap-10">
        <NuxtLink
          v-for="(item, i) in menuItems"
          :key="i"
          :to="item.link"
          class="relative text-sm font-medium text-gray-600 hover:text-gray-900 transition group"
        >
          {{ t(item.label) }}
          <span
            class="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#10B481] transition-all duration-300 group-hover:w-full"
          ></span>
        </NuxtLink>
      </nav>

      <!-- RIGHT SIDE -->
      <div class="hidden md:flex items-center gap-6">
        <!-- LANGUAGE SELECT -->
        <div class="relative">
          <button
            @click="open = !open"
            class="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition"
          >
            <img
              :src="currentLocale.flag"
              class="w-5 h-5 rounded-full ring-1 ring-white"
            />
            <span class="font-medium">{{ currentLocale.name }}</span>
            <i class="bx bx-chevron-down text-xs opacity-60"></i>
          </button>

          <transition name="fade">
            <ul
              v-if="open"
              class="absolute right-0 mt-4 w-44 bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-xl overflow-hidden"
            >
              <li
                v-for="loc in locales"
                :key="loc.code"
                @click="selectLocale(loc.code)"
                class="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer transition"
              >
                <img :src="loc.flag" class="w-5 h-5 rounded-full" />
                {{ loc.name }}
              </li>
            </ul>
          </transition>
        </div>

        <!-- USER / AUTH -->
        <div class="relative">
          <template v-if="isLoggedIn">
            <div class="relative">
              <!-- Avatar / Toggle -->
              <div
                class="flex items-center gap-3 cursor-pointer group"
                @click="toggleDropdown"
              >
                <img
                  v-if="user?.avatar_url"
                  :src="user.avatar_url"
                  alt="avatar"
                  class="w-10 h-10 rounded-full object-cover ring-2 ring-[#10B481]/50 transition-transform duration-200 group-hover:scale-105"
                />
                <div
                  v-else
                  class="w-10 h-10 rounded-full bg-[#10B481] text-white flex items-center justify-center font-bold text-lg transition-transform duration-200 group-hover:scale-105"
                >
                  {{ user.username.charAt(0).toUpperCase() }}
                </div>
              </div>

              <!-- Dropdown Menu -->
              <transition
                enter-active-class="transition duration-300 ease-out"
                enter-from-class="opacity-0 translate-x-full"
                enter-to-class="opacity-100 translate-x-0"
                leave-active-class="transition duration-200 ease-in"
                leave-from-class="opacity-100 translate-x-0"
                leave-to-class="opacity-0 translate-x-full"
              >
                <div
                  v-if="dropdownOpen"
                  class="fixed top-0 right-0 h-screen w-72 bg-[#112830] text-white z-50 flex flex-col shadow-xl"
                >
                  <!-- Header avec avatar et bouton X -->
                  <div
                    class="flex items-center justify-between p-4 border-b border-white/20"
                  >
                    <div class="flex items-center gap-3">
                      <img
                        v-if="user?.avatar_url"
                        :src="user.avatar_url"
                        alt="avatar"
                        class="w-12 h-12 rounded-full object-cover ring-2 ring-[#10B481]/50"
                      />
                      <div
                        v-else
                        class="w-12 h-12 rounded-full bg-[#10B481] flex items-center justify-center font-bold text-lg"
                      >
                        {{ user.username.charAt(0).toUpperCase() }}
                      </div>
                      <div class="flex flex-col">
                        <span class="font-semibold">{{ user.username }}</span>
                        <span class="text-xs text-gray-300">{{
                          user.email
                        }}</span>
                      </div>
                    </div>
                    <button
                      @click="dropdownOpen = false"
                      class="text-gray-300 hover:text-white"
                    >
                      <i class="bx bx-x text-2xl"></i>
                    </button>
                  </div>

                  <!-- Menu -->
                  <ul class="flex-1 overflow-y-auto py-4">
                    <!-- Admin Menu -->
                    <template v-if="isStaffUser">
                      <li
                        v-for="item in staffMenu"
                        :key="item.label"
                        class="px-5 py-3 flex items-center gap-3 hover:bg-[#0e9a6c]/30 cursor-pointer transition"
                      >
                        <i :class="item.icon + ' text-xl'"></i>
                        <NuxtLink :to="item.link" class="w-full">{{
                          t(item.label)
                        }}</NuxtLink>
                      </li>
                    </template>

                    <!-- Utilisateur Menu -->
                    <template v-else>
                      <li
                        v-for="item in userMenu"
                        :key="item.label"
                        class="px-5 py-3 flex items-center gap-3 hover:bg-[#0e9a6c]/30 cursor-pointer transition"
                      >
                        <i :class="item.icon + ' text-xl'"></i>
                        <NuxtLink :to="item.link" class="w-full">{{
                          t(item.label)
                        }}</NuxtLink>
                      </li>
                    </template>

                    <!-- Messagerie -->
                    <li
                      v-if="unreadCount > 0"
                      class="px-5 py-3 flex items-center justify-between hover:bg-[#0e9a6c]/30 transition cursor-pointer"
                    >
                      <NuxtLink
                        to="/chatbox"
                        class="flex items-center gap-3 w-full"
                      >
                        <i class="bx bx-send-alt -rotate-45 text-xl"></i>
                        Messagerie
                      </NuxtLink>
                      <span
                        class="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-semibold bg-red-600 text-white rounded-full shadow"
                      >
                        {{ unreadCount > 9 ? "9+" : unreadCount }}
                      </span>
                    </li>

                    <!-- Settings -->
                    <li
                      class="px-5 py-3 flex items-center gap-3 hover:bg-[#0e9a6c]/30 transition cursor-pointer"
                    >
                      <i class="bx bx-cog text-xl"></i>
                      <NuxtLink to="/settings" class="w-full"
                        >Settings</NuxtLink
                      >
                    </li>

                    <!-- Logout -->
                    <li
                      class="px-5 py-3 flex items-center gap-3 hover:bg-red-600/20 transition cursor-pointer"
                    >
                      <i class="bx bx-log-out text-xl"></i>
                      <button @click="logout" class="w-full text-left">
                        Sign out
                      </button>
                    </li>
                  </ul>
                </div>
              </transition>
            </div>
          </template>

          <template v-else>
            <div class="flex items-center gap-6">
              <!-- SIGN IN -->
              <NuxtLink
                to="/signin"
                class="group flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition"
              >
                {{ t("signin") }}
                <i
                  class="bx bx-arrow-up-right text-base transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                ></i>
              </NuxtLink>

              <!-- SIGN UP (Primary CTA) -->
              <NuxtLink
                to="/signup"
                class="btn-primary px-6 py-2.5 rounded-xl font-semibold shadow-md shadow-[#10B481]/30 hover:shadow-lg hover:-translate-y-[1px] transition-all duration-300"
              >
                {{ t("signup") }}
              </NuxtLink>
            </div>
          </template>
        </div>
      </div>

      <!-- MOBILE BURGER -->
      <button class="md:hidden flex flex-col gap-1.5" @click="toggleMobileMenu">
        <span class="w-6 h-[2px] bg-gray-800 rounded"></span>
        <span class="w-6 h-[2px] bg-gray-800 rounded"></span>
        <span class="w-4 h-[2px] bg-gray-800 rounded"></span>
      </button>
    </div>

    <transition name="slide-down">
      <div
        v-if="mobileMenuOpen"
        class="md:hidden bg-white shadow-xl border-t border-gray-100 w-full h-screen overflow-y-auto"
      >
        <!-- USER INFO / AUTH -->
        <div
          class="flex items-center justify-between p-4 border-b border-gray-100"
        >
          <template v-if="isLoggedIn">
            <div class="flex items-center gap-3">
              <img
                v-if="user?.avatar_url"
                :src="user.avatar_url"
                alt="avatar"
                class="w-12 h-12 rounded-full object-cover ring-2 ring-[#10B481]/50"
              />
              <div
                v-else
                class="w-12 h-12 rounded-full bg-[#10B481] text-white flex items-center justify-center font-bold"
              >
                {{ user.username.charAt(0).toUpperCase() }}
              </div>

              <div class="flex flex-col">
                <p class="text-sm font-semibold text-gray-800">
                  {{ user.username }}
                </p>
                <p class="text-xs text-gray-500">{{ user.email }}</p>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="flex gap-3 w-full">
              <NuxtLink
                to="/signin"
                class="flex-1 text-center px-4 py-2 text-sm font-medium text-[#10B481] border border-[#10B481] rounded-lg hover:bg-[#10B481]/10 transition"
              >
                {{ t("signin") }}
              </NuxtLink>

              <NuxtLink
                to="/signup"
                class="flex-1 text-center px-4 py-2 text-sm font-medium text-white bg-[#10B481] rounded-lg hover:bg-[#0e946a] transition"
              >
                {{ t("signup") }}
              </NuxtLink>
            </div>
          </template>
        </div>

        <!-- LANGUAGE SELECT -->
        <div
          class="flex items-center gap-2 py-3 px-4 border-b border-gray-100 relative"
        >
          <button
            @click="open = !open"
            class="flex items-center gap-2 py-1.5 px-3 w-full rounded hover:bg-gray-50 transition"
          >
            <img :src="currentLocale.flag" class="w-5 h-5 rounded-full" />
            <span class="text-sm font-medium">{{ currentLocale.name }}</span>
            <i class="bx bx-chevron-down text-sm ml-auto"></i>
          </button>

          <transition name="fade">
            <ul
              v-if="open"
              class="absolute mt-36 w-40 bg-white border border-gray-100 rounded shadow-md overflow-hidden z-50"
            >
              <li
                v-for="loc in locales"
                :key="loc.code"
                @click="selectLocale(loc.code)"
                class="flex items-center gap-2 px-3 py-2 hover:bg-[#10B481]/10 cursor-pointer"
              >
                <img :src="loc.flag" class="w-5 h-5 rounded-full" />
                <span class="text-sm">{{ loc.name }}</span>
              </li>
            </ul>
          </transition>
        </div>

        <!-- NAVIGATION -->
        <nav class="flex flex-col py-4 px-6 gap-3">
          <NuxtLink
            v-for="(item, i) in menuItems"
            :key="i"
            :to="item.link"
            class="py-2 font-medium text-gray-700 hover:text-[#10B481] transition"
            @click="mobileMenuOpen = false"
          >
            {{ t(item.label) }}
          </NuxtLink>

          <!-- ADDITIONAL USER LINKS IF LOGGED IN -->
          <template v-if="isStaffUser">
          <NuxtLink
            v-for="item in staffMenu"
            :key="item.label"
            :to="item.link"
            class="py-2 font-medium text-gray-700 hover:text-[#10B481] transition"
            @click="mobileMenuOpen = false"
          >
            {{ t(item.label) }}
          </NuxtLink>
        </template>

        <!-- Utilisateur Menu -->
        <template v-else>
          <NuxtLink
            v-for="item in userMenu"
            :key="item.label"
            :to="item.link"
            class="py-2 font-medium text-gray-700 hover:text-[#10B481] transition"
            @click="mobileMenuOpen = false"
          >
            {{ t(item.label) }}
          </NuxtLink>
        </template>

        <!-- Messagerie -->
        <NuxtLink
          to="/chatbox"
          class="flex items-center justify-between py-2 font-medium text-gray-700 hover:text-[#10B481] transition"
          @click="mobileMenuOpen = false"
        >
          <span>Messagerie</span>
          <span
            v-if="unreadCount > 0"
            class="inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-semibold bg-red-600 text-white rounded-full shadow"
          >
            {{ unreadCount > 9 ? "9+" : unreadCount }}
          </span>
        </NuxtLink>

        <!-- Settings -->
        <NuxtLink
          to="/settings"
          class="flex items-center py-2 font-medium text-gray-700 hover:text-[#10B481] transition"
          @click="mobileMenuOpen = false"
        >
          Settings
        </NuxtLink>

        <!-- Logout -->
        <button
          @click="logout(); mobileMenuOpen = false"
          class="flex items-center px-4 py-3 rounded-lg hover:bg-red-600/20 text-red-500 transition"
        >
          Sign out
        </button>
        </nav>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { API_URL } from "~/utils/config";
import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";
import { useRouter } from "vue-router";
const router = useRouter();

const languageStore = useLanguageStore();
const t = (key: string) => {
  const lang = languageStore.lang;
  return translate[lang][key] || key;
};

const locales = [
  { code: "en", name: "English", flag: "/flags/en.png" },
  { code: "fr", name: "Français", flag: "/flags/fr.png" },
  { code: "mg", name: "Malagasy", flag: "/flags/mg.png" },
];

const open = ref(false);
const currentLocale = computed(
  () => locales.find((l) => l.code === languageStore.lang) || locales[0]
);

const selectLocale = (code: string) => {
  languageStore.setLang(code);
  open.value = false;
};

const isLoggedIn = ref(false);
const dropdownOpen = ref(false);
const langDropdownOpen = ref(false);
const mobileMenuOpen = ref(false);
const currentLang = ref("EN");
const user = ref(null);
let userId = 0;
const isStaffUser = ref(false);

const hasNewMessages = ref(true);
const isScrolled = ref(false);
const unreadCount = ref(0);

const menuItems = [
  { label: "home", link: "/market/" },
  { label: "about", link: "/market/about" },
  { label: "posts", link: "/market/post" },
  // { label: "Services", link: "/services" },
];

const staffMenu = [
  { label: "Dashboard", link: "/admin", icon: "bx bx-bar-chart-alt-2" },
  { label: "Gestion annonces", link: "/admin/posts", icon: "bx bx-clipboard" },
  { label: "Gestion utilisateur", link: "/admin/users", icon: "bx bx-user" },
  { label: "Gestion produits", link: "/admin/products", icon: "bx bx-package" },
  {
    label: "Gestion categories",
    link: "/admin/categories",
    icon: "bx bx-category",
  },
];

const userMenu = [
  { label: "Dashboard", link: "/dashboard", icon: "bx bx-bar-chart-alt-2" },
  { label: "Annonces", link: "/dashboard/post", icon: "bx bx-clipboard" },
  { label: "Proposition", link: "/dashboard/bid", icon: "bx bx-receipt" },
  {
    label: "Payments",
    link: "/dashboard/post/transaction",
    icon: "bx bx-credit-card",
  },
];

async function countUnreadMessages(currentUserId: number) {
  const token = localStorage.getItem("access_token");
  if (!token) return 0;

  try {
    const [chatsRes, messagesRes] = await Promise.all([
      fetch(`${API_URL}/api/chats/`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${API_URL}/api/messages/`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const chats = await chatsRes.json();
    const messages = await messagesRes.json();

    const chatIds = new Set(chats.map((chat: any) => chat.id));

    const unreadUsers = new Set<number>();

    messages.forEach((msg: any) => {
      if (
        chatIds.has(msg.id_chat) &&
        !msg.is_read &&
        msg.id_user !== currentUserId
      ) {
        unreadUsers.add(msg.id_user);
      }
    });

    return unreadUsers.size;
  } catch (error) {
    console.error("Erreur unread messages:", error);
    return 0;
  }
}

onMounted(async () => {
  unreadCount.value = await countUnreadMessages(userId);
});

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}

function toggleLangDropdown() {
  langDropdownOpen.value = !langDropdownOpen.value;
}

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value;
}

function setLanguage(lang) {
  currentLang.value = lang;
  langDropdownOpen.value = false;
}

function handleClickOutside(event) {
  const header = document.querySelector("header");
  if (header && !header.contains(event.target)) {
    dropdownOpen.value = false;
    langDropdownOpen.value = false;
    mobileMenuOpen.value = false;
  }
}

function handleScroll() {
  isScrolled.value = window.scrollY > 20;
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  window.addEventListener("scroll", handleScroll);
  checkUser();
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
  window.removeEventListener("scroll", handleScroll);
});

function isStaff(user: any): boolean {
  if (!user || !user.value || !user.value.id_categorie_user) return false;
  const role = user.value.id_categorie_user.categorie;
  return role === "Admin" || role === "Staff"; // ajouter d'autres rôles si besoin
}

async function checkUser() {
  const token = localStorage.getItem("access_token");
  if (!token) return;

  try {
    const res = await fetch(`${API_URL}/api/me/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Unauthorized");
    const data = await res.json();
    user.value = data;
    console.log("User data:", data);
    isLoggedIn.value = true;
    isStaffUser.value = isStaff(user);
  } catch {
    isLoggedIn.value = false;
  }
}

const logout = () => {
  localStorage.removeItem("access_token");
  // Optionnel : rediriger l'utilisateur vers la page de connexion
  window.location.href = "/signin";
};

function goToDashboard() {
  if (user.value?.id_categorie_user_id === 4) {
    router.push("/admin");
  } else {
    router.push("/dashboard");
  }
}
</script>

<style scoped>
/* Transitions */
.slide-down-enter-active {
  transition: all 0.3s ease-out;
}
.slide-down-leave-active {
  transition: all 0.2s ease-in;
}
.slide-down-enter-from {
  transform: translateY(-20px);
  opacity: 0;
}
.slide-down-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
