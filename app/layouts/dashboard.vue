<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden">
    <div
      v-if="isMobileOpen"
      class="fixed inset-0 bg-black/40 z-30 md:hidden"
      @click="isMobileOpen = false"
    ></div>

    <aside
      :class="[
        'fixed md:relative z-40 h-full bg-[#112830] text-white flex flex-col transition-all duration-300 ease-in-out',
        isCollapsed && !isMobile ? 'w-22' : 'w-64',
        isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      ]"
    >
      <div class="flex items-center py-6 px-2 relative">
        <div
          :class="[
            'flex items-center w-full gap-1',
            isCollapsed && !isMobile ? 'justify-between' : 'justify-between',
          ]"
        >
          <div
            class="flex items-center justify-center px-3 relative gap-3 "
          >
            <img
              src="/logo.png"
              alt="Logo"
              class="w-12 h-12 object-contain flex-shrink-0 rounded-2xl"
            />

            <div v-if="!isCollapsed || isMobile" class="leading-tight">
              <h1 class="text-xl font-semibold">SmartSaha</h1>
              <p class="text-xs text-white/70 tracking-wide">
                Agricultural Marketplace
              </p>
            </div>
          </div>

          <button
          v-if="!isMobile"
            @click="toggleCollapse"
            class="absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2 z-50 flex items-center justify-center w-6 h-6 rounded-full bg-[#10b481] text-white shadow-lg hover:bg-[#10b481] hover:text-white transition-all duration-200"
          >
            <i
              :class="[
                'bx text-sm',
                isCollapsed ? 'bx-chevron-right' : 'bx-chevron-left',
              ]"
            ></i>
          </button>

          <button
            v-if="isMobile"
            @click="isMobileOpen = false"
            class="md:hidden p-1 rounded hover:bg-[#0e9a6c]"
          >
            <i class="bx bx-chevron-left text-lg"></i>
          </button>
        </div>
      </div>

      <nav class="flex-1 px-2 space-y-1 overflow-y-auto">
        <div
          class="flex md:hidden items-center gap-2 py-3 border-b border-white/20 relative"
        >
          <button
            @click="open = !open"
            class="flex items-center gap-3 py-1.5 px-3 w-full rounded transition bg-transparent"
          >
            <img
              :src="currentLocale.flag"
              class="w-5 h-5 rounded-full ring-1 ring-white"
            />
            <span class="text-sm font-medium">{{ currentLocale.name }}</span>
            <i class="bx bx-chevron-down ml-auto"></i>
          </button>

          <transition name="fade">
            <ul
              v-if="open"
              class="absolute top-full left-0 mt-2 w-full bg-[#112830] border border-white/20 rounded shadow-md overflow-hidden z-50"
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

        <NuxtLink
          to="/"
          :class="[
            'flex items-center transition-all duration-200 cursor-pointer',
            isCollapsed && !isMobile
              ? 'justify-center w-12 h-12 mx-auto rounded-2xl hover:bg-[#0e9a6c] focus:bg-[#0e9a6c]'
              : 'gap-3 px-3 py-3 rounded-lg hover:bg-[#0e9a6c] focus:bg-[#0e9a6c]',
          ]"
        >
          <i class="bx bx-bx bx-store text-xl"></i>
          <span v-if="!isCollapsed || isMobile" class="font-medium">
            Marketplace
          </span>
        </NuxtLink>

        <!-- menu administration -->
        <template v-if="isStaffUser">
          <NuxtLink
            to="/admin"
            :class="[
              'flex items-center transition-all duration-200 cursor-pointer',
              isCollapsed && !isMobile
                ? 'justify-center w-12 h-12 mx-auto rounded-2xl hover:bg-[#0e9a6c] focus:bg-[#0e9a6c]'
                : 'gap-3 px-3 py-3 rounded-lg hover:bg-[#0e9a6c] focus:bg-[#0e9a6c]',
            ]"
          >
            <i class="bx bx-bar-chart-alt-2 text-xl"></i>

            <span v-if="!isCollapsed || isMobile" class="font-medium">
              Dashboard
            </span>
          </NuxtLink>

          <NuxtLink
            to="/admin/posts"
            :class="[
              'flex items-center transition-all duration-200 cursor-pointer',
              isCollapsed && !isMobile
                ? 'justify-center w-12 h-12 mx-auto rounded-2xl hover:bg-[#0e9a6c] focus:bg-[#0e9a6c]'
                : 'gap-3 px-3 py-3 rounded-lg hover:bg-[#0e9a6c] focus:bg-[#0e9a6c]',
            ]"
          >
            <i class="bx bx-clipboard text-xl"></i>
            <span v-if="!isCollapsed || isMobile" class="font-medium">
              Gestion annonces
            </span>
          </NuxtLink>

          <NuxtLink
            to="/admin/users"
            :class="[
              'flex items-center transition-all duration-200 cursor-pointer',
              isCollapsed && !isMobile
                ? 'justify-center w-12 h-12 mx-auto rounded-2xl hover:bg-[#0e9a6c] focus:bg-[#0e9a6c]'
                : 'gap-3 px-3 py-3 rounded-lg hover:bg-[#0e9a6c] focus:bg-[#0e9a6c]',
            ]"
          >
            <i class="bx bx-user text-xl"></i>
            <span v-if="!isCollapsed || isMobile" class="font-medium">
              Gestion utilisateur
            </span>
          </NuxtLink>

          <NuxtLink
            to="/admin/products"
            :class="[
              'flex items-center transition-all duration-200 cursor-pointer',
              isCollapsed && !isMobile
                ? 'justify-center w-12 h-12 mx-auto rounded-2xl hover:bg-[#0e9a6c] focus:bg-[#0e9a6c]'
                : 'gap-3 px-3 py-3 rounded-lg hover:bg-[#0e9a6c] focus:bg-[#0e9a6c]',
            ]"
          >
            <i class="bx bx-package text-xl"></i>
            <span v-if="!isCollapsed || isMobile" class="font-medium">
              Gestion produits
            </span>
          </NuxtLink>

          <NuxtLink
            to="/admin/categories"
            :class="[
              'flex items-center transition-all duration-200 cursor-pointer',
              isCollapsed && !isMobile
                ? 'justify-center w-12 h-12 mx-auto rounded-2xl hover:bg-[#0e9a6c] focus:bg-[#0e9a6c]'
                : 'gap-3 px-3 py-3 rounded-lg hover:bg-[#0e9a6c] focus:bg-[#0e9a6c]',
            ]"
          >
            <i class="bx bx-category text-xl"></i>
            <span v-if="!isCollapsed || isMobile" class="font-medium">
              Gestion categories
            </span>
          </NuxtLink>
        </template>

        <template v-else>
          <!-- menu utilisateur -->
          <NuxtLink
            to="/dashboard"
            :class="[
              'flex items-center transition-all duration-200 cursor-pointer',
              isCollapsed && !isMobile
                ? 'justify-center w-12 h-12 mx-auto rounded-2xl hover:bg-[#0e9a6c] focus:bg-[#0e9a6c]'
                : 'gap-3 px-3 py-3 rounded-lg hover:bg-[#0e9a6c] focus:bg-[#0e9a6c]',
            ]"
          >
            <i class="bx bx-bar-chart-alt-2 text-xl"></i>

            <span v-if="!isCollapsed || isMobile" class="font-medium">
              Dashboard
            </span>
          </NuxtLink>

          <NuxtLink
            to="/dashboard/post"
            :class="[
              'flex items-center transition-all duration-200 cursor-pointer',
              isCollapsed && !isMobile
                ? 'justify-center w-12 h-12 mx-auto rounded-2xl hover:bg-[#0e9a6c] focus:bg-[#0e9a6c]'
                : 'gap-3 px-3 py-3 rounded-lg hover:bg-[#0e9a6c] focus:bg-[#0e9a6c]',
            ]"
          >
            <i class="bx bx-clipboard text-xl"></i>

            <span v-if="!isCollapsed || isMobile" class="font-medium">
              Annonces
            </span>
          </NuxtLink>

          <NuxtLink
            to="/dashboard/bid"
            :class="[
              'flex items-center transition-all duration-200 cursor-pointer',
              isCollapsed && !isMobile
                ? 'justify-center w-12 h-12 mx-auto rounded-2xl hover:bg-[#0e9a6c] focus:bg-[#0e9a6c]'
                : 'gap-3 px-3 py-3 rounded-lg hover:bg-[#0e9a6c] focus:bg-[#0e9a6c]',
            ]"
          >
            <i class="bx bx-receipt text-xl"></i>

            <span v-if="!isCollapsed || isMobile" class="font-medium">
              Proposition
            </span>
          </NuxtLink>

          <NuxtLink
            to="/dashboard/post/transaction"
            :class="[
              'flex items-center transition-all duration-200 cursor-pointer',
              isCollapsed && !isMobile
                ? 'justify-center w-12 h-12 mx-auto rounded-2xl hover:bg-[#0e9a6c] focus:bg-[#0e9a6c]'
                : 'gap-3 px-3 py-3 rounded-lg hover:bg-[#0e9a6c] focus:bg-[#0e9a6c]',
            ]"
          >
            <i class="bx bx-credit-card text-xl"></i>
            <span v-if="!isCollapsed || isMobile" class="font-medium">
              Payments
            </span>
          </NuxtLink>
        </template>

        <NuxtLink
          @click="goToChat"
          :class="[
            'flex items-center relative transition-all duration-200 cursor-pointer mb-4',
            isCollapsed && !isMobile
              ? 'justify-center w-12 h-12 mx-auto rounded-2xl hover:bg-[#0e9a6c] focus:bg-[#0e9a6c]'
              : 'gap-3 px-3 py-3 rounded-lg hover:bg-[#0e9a6c] focus:bg-[#0e9a6c]',
          ]"
        >
          <!-- Icon -->
          <div class="relative inline-block">
            <!-- Icône tournée -->
            <i class="bx bx-send-alt transform -rotate-45 text-xl"></i>

            <!-- Badge miniature (collapsed) -->
            <span
              v-if="unreadCount > 0 && isCollapsed && !isMobile"
              class="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-semibold bg-red-600 text-white rounded-full shadow"
            >
              {{ unreadCount > 9 ? "9+" : unreadCount }}
            </span>
          </div>

          <!-- Texte -->
          <span v-if="!isCollapsed || isMobile" class="font-medium">
            Messagerie
          </span>

          <!-- Badge pleine largeur (full sidebar) -->
          <span
            v-if="unreadCount > 0 && (!isCollapsed || isMobile)"
            class="ml-auto min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-semibold bg-red-600 text-white rounded-full shadow"
          >
            {{ unreadCount > 9 ? "9+" : unreadCount }}
          </span>
        </NuxtLink>

        <div class="border-t border-white/10 pt-2">
          <NuxtLink
            to="/"
            :class="[
              'flex items-center transition-all duration-200 cursor-pointer',
              isCollapsed && !isMobile
                ? 'justify-center w-12 h-12 mx-auto rounded-2xl hover:bg-[#0e9a6c] focus:bg-[#0e9a6c]'
                : 'gap-3 px-3 py-3 rounded-lg hover:bg-[#0e9a6c] focus:bg-[#0e9a6c]',
            ]"
          >
            <i class="bx bx-cog text-xl"></i>
            <span v-if="!isCollapsed || isMobile" class="font-medium">
              Settings
            </span>
          </NuxtLink>

          <NuxtLink
            @click="logout"
            :class="[
              'flex items-center transition-all duration-200 cursor-pointer',
              isCollapsed && !isMobile
                ? 'justify-center w-12 h-12 mx-auto rounded-2xl hover:bg-[#0e9a6c] focus:bg-[#0e9a6c]'
                : 'gap-3 px-3 py-3 rounded-lg hover:bg-[#0e9a6c] focus:bg-[#0e9a6c]',
            ]"
          >
            <i class="bx bx-log-out text-xl"></i>
            <span v-if="!isCollapsed || isMobile" class="font-medium">
              Sign out
            </span>
          </NuxtLink>
        </div>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col w-full">
      <header
        :class="[
          'flex items-center justify-between bg-gray-50 px-4 sm:px-12 py-4 sm:py-7 transition-shadow duration-200',
          isScrolled ? 'shadow' : '',
        ]"
      >
        <button class="md:hidden text-gray-700" @click="isMobileOpen = true">
          <i class="bx bx-menu text-2xl"></i>
        </button>

        <h2 class="text-lg font-semibold text-gray-800 hidden sm:flex">
          <Breadcrumb />
        </h2>

        <div class="flex items-center gap-5">
          <div class="relative hidden sm:flex">
            <button
              @click="open = !open"
              class="flex items-center gap-2 py-1.5 px-3 transition"
            >
              <img :src="currentLocale.flag" class="w-5 h-5 rounded-full" />
              <span class="text-sm font-medium">{{ currentLocale.name }}</span>
              <i class="bx bx-chevron-down text-sm"></i>
            </button>

            <transition name="fade">
              <ul
                v-if="open"
                class="absolute mt-2 w-40 bg-white border border-gray-100 rounded-lg shadow-md overflow-hidden"
              >
                <li
                  v-for="loc in locales"
                  :key="loc.code"
                  @click="selectLocale(loc.code)"
                  class="flex items-center gap-2 px-3 py-2 hover:bg-[#10b481]/10 cursor-pointer"
                >
                  <img :src="loc.flag" class="w-5 h-5 rounded-full" />
                  <span class="text-sm">{{ loc.name }}</span>
                </li>
              </ul>
            </transition>
          </div>
          <button
            @click="goToNotif"
            class="relative w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-[#10b481]/30"
          >
            <i class="bx bx-bell text-xl text-gray-700"></i>

            <span
              v-if="unreadNotifCount > 0"
              class="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-1 flex items-center justify-center text-[10px] font-semibold bg-red-600 text-white rounded-full shadow"
            >
              {{ unreadNotifCount > 9 ? "9+" : unreadNotifCount }}
            </span>
          </button>

          <div class="flex items-center gap-3">
            <img
              v-if="user?.avatar_url"
              :src="user?.avatar_url"
              alt="avatar"
              class="w-8 sm:w-10 h-8 sm:h-10 rounded-full object-cover ring-2 ring-[#10B481]/50"
            />

            <div
              v-else
              class="w-8 sm:w-10 h-8 sm:h-10 bg-[#10b481] text-white rounded-full flex items-center justify-center font-bold text-lg ring-2 ring-[#10B481]/50"
            >
              {{ user?.username.charAt(0).toUpperCase() }}
            </div>
          </div>
        </div>
      </header>

      <main
        ref="mainContent"
        class="overflow-auto flex-1"
        @scroll="handleScroll"
      >
        <NuxtPage />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { API_URL } from "~/utils/config";
import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";
import { useRouter } from "vue-router";
import Breadcrumb from "~/components/Breadcrumb.vue";
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

const isScrolled = ref(false);
const mainContent = ref(null);

const handleScroll = () => {
  if (!mainContent.value) return;
  // Shadow si on scroll plus de 5px
  isScrolled.value = mainContent.value.scrollTop > 5;
};

// Si tu veux recalculer à l'initial pour un scroll déjà existant
onMounted(() => {
  if (mainContent.value) {
    isScrolled.value = mainContent.value.scrollTop > 5;
  }
});

const isCollapsed = ref(false);
const isMobileOpen = ref(false);
const isMobile = ref(false);

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

onMounted(() => {
  const checkScreen = () => {
    isMobile.value = window.innerWidth < 768;
  };

  checkScreen();
  window.addEventListener("resize", checkScreen);
});

const postMenuOpen = ref(false);
const bidMenuOpen = ref(false);

const togglePostMenu = () => {
  postMenuOpen.value = !postMenuOpen.value;
};

const toggleBidMenu = () => {
  bidMenuOpen.value = !bidMenuOpen.value;
};

const notifications = ref([]);
const user = ref(null);
const isLoggedIn = ref(false);
const unreadCount = ref(0);

function goToChat() {
  window.location.href = "/dashboard/chatbox";
}

function goToNotif() {
  window.location.href = "/dashboard/notification";
}

const unreadNotifCount = computed(
  () => notifications.value.filter((n) => !n.is_read).length
);

async function fetchNotifications() {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Not authenticated");

    const res = await fetch(`${API_URL}/api/notifications/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch notifications");

    notifications.value = await res.json();
  } catch (err) {
    console.error(err);
  } finally {
  }
}

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

let userId = 0;
const isStaffUser = ref(false);

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
    userId = data.id;
    console.log("User data:", data);

    isLoggedIn.value = true;
    isStaffUser.value = isStaff(user);
  } catch {
    isLoggedIn.value = false;
    user.value = null;
  }
}

const logout = () => {
  localStorage.removeItem("access_token");
  window.location.href = "/signin";
};

onMounted(() => {
  fetchNotifications();
  checkUser();
});
</script>

<style>
::-webkit-scrollbar {
  width: 2px;
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 10px;
}
</style>
