<template>
  <div
    class="relative h-screen flex flex-col lg:flex-row bg-white sm:bg-[#fafaf9] p-4 sm:p-12 overflow-hidden"
  >
    <div
      class="absolute -top-24 -left-32 w-[500px] h-[500px] sm:bg-blue-500 opacity-30 rounded-[60%_40%_55%_45%/50%_60%_40%_50%] blur-3xl"
    ></div>

    <div
      class="absolute -top-48 -left-48 w-[1000px] h-[400px] sm:bg-[#10b481] opacity-30 rounded-[60%_40%_55%_45%/50%_60%_40%_50%] blur-3xl"
    ></div>

    <div
      class="absolute -top-48 right-[-100px] w-[800px] h-[400px] sm:bg-[#10b481] opacity-30 rounded-[60%_40%_55%_45%/50%_60%_40%_50%] blur-3xl"
    ></div>

    <div class="hidden lg:flex w-1/2 flex-col p-12 relative overflow-hidden">
      <div class="flex-1 flex items-center">
        <div class="relative max-w-md">
          <h2 class="mb-6 leading-tight">{{ t("welcomeback") }}</h2>

          <p class="content leading-relaxed">
            {{ t("welcomebacktext") }}
          </p>
        </div>
      </div>

      <div class="relative">
        <div class="flex items-center justify-between">
          <div class="relative hidden sm:flex">
            <button
              @click="open = !open"
              class="flex items-center gap-2 px-3 py-2 transition"
            >
              <img :src="currentLocale.flag" class="w-5 h-5 rounded-full" />
              <span class="text-sm text-gray-700 small">
                {{ currentLocale.name }}
              </span>
              <i class="bx bx-chevron-down text-sm text-gray-500"></i>
            </button>

            <transition name="fade">
              <ul
                v-if="open"
                class="absolute bottom-12 w-44 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden"
              >
                <li
                  v-for="loc in locales"
                  :key="loc.code"
                  @click="selectLocale(loc.code)"
                  class="flex items-center gap-2 px-4 py-3 hover:bg-[#10b481]/10 cursor-pointer transition"
                >
                  <img :src="loc.flag" class="w-5 h-5 rounded-full" />
                  <span class="text-sm text-gray-700">
                    {{ loc.name }}
                  </span>
                </li>
              </ul>
            </transition>
          </div>

          <ul class="flex gap-6 text-sm">
            <li class="menu-item transition cursor-pointer">
              {{ t("terms") }}
            </li>
            <li class="menu-item transition cursor-pointer">
              <NuxtLink to="/market" class="block w-full h-full">
                {{ t("home") }}
              </NuxtLink>
            </li>
            <li class="menu-item transition cursor-pointer">
              {{ t("contactus") }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div
      class="flex-1 flex items-center justify-center p-0 sm:px-6 p-2 sm:py-16"
    >
      <div
        class="w-full max-w-md bg-transparent sm:bg-white sm:rounded-3xl sm:shadow-xl p-0 sm:p-12 relative overflow-hidden"
      >
        <div class="text-left mb-10">
          <img src="/logo.png" alt="SmartSaha" class="h-16 rounded-xl mb-4" />
          <h2 class="mb-2">{{ t("login") }}</h2>
          <p class="content">{{ t("logintext") }}</p>
        </div>

        <form @submit.prevent="submitSignin" class="space-y-6">
          <div class="small">
            <div class="relative">
              <i
                class="bx bx-user text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 text-lg"
              ></i>

              <input
                id="username"
                v-model="form.username"
                type="text"
                placeholder=" "
                required
                class="peer w-full px-4 py-3 pl-10 small text-gray-700 text-sm rounded-xl border border-gray-200 focus:border-[#10b481] focus:ring-4 focus:ring-[#10b481]/10 outline-none transition-all"
              />

              <label
                for="username"
                class="absolute left-10 small text-gray-400 pointer-events-none transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:-top-3 peer-focus:text-sm peer-focus:text-emerald-400 bg-white px-2"
                :class="
                  form.username ? '-top-3 text-sm text-emerald-400 px-2' : ''
                "
              >
                {{ t("username") }}
              </label>
            </div>

            <p
              v-if="fieldErrors.username"
              class="text-sm text-red-400 mt-2 flex items-center gap-1"
            >
              <i class="bx bx-error-circle text-base"></i>
              {{ fieldErrors.username }}
            </p>
          </div>

          <div class="small">
            <div class="relative">
              <i
                class="bx bx-lock text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 text-lg"
              ></i>

              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder=" "
                required
                minlength="6"
                class="peer w-full px-4 py-3 pl-10 small text-gray-700 text-sm pr-12 rounded-xl border border-gray-200 focus:border-[#10b481] focus:ring-4 focus:ring-[#10b481]/10 outline-none transition-all"
              />

              <label
                for="password"
                class="absolute left-10 small text-gray-400 pointer-events-none transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:-top-3 peer-focus:text-sm peer-focus:text-emerald-400 bg-white px-2"
                :class="
                  form.password ? '-top-3 text-sm text-emerald-400 px-2 ' : ''
                "
              >
                {{ t("password") }}
              </label>
              <i
                :class="[
                  'bx text-xl absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 transition',
                  showPassword ? 'bx-hide' : 'bx-show',
                ]"
                @click="showPassword = !showPassword"
              ></i>
            </div>

            <p
              v-if="fieldErrors.password"
              class="text-red-500 text-sm mt-1 flex items-center gap-1"
            >
              <i class="bx bx-error-circle text-base"></i>
              {{ fieldErrors.password }}
            </p>
          </div>

          <button
            type="submit"
            class="w-full btn-primary flex items-center justify-center gap-3"
            :disabled="loading"
          >
            <template v-if="loading">
              <span
                class="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"
              ></span>
            </template>
            <template v-else>{{ t("signin") }}</template>
          </button>
        </form>

        <p class="text-center small text-sm text-gray-500 mt-8">
          {{ t("dontaccount") }}
          <NuxtLink
            to="/signup"
            class="text-[#10b481] font-medium hover:underline"
          >
            {{ t("createone") }}
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>

  <div
    v-if="isLoading"
    class="absolute inset-0 bg-black/50 flex items-center justify-center"
  >
    <div
      class="w-12 h-12 border-4 border-t-[#10b481] border-white rounded-full animate-spin"
    ></div>
  </div>

  <transition name="slide-down">
    <div
      v-if="notification.visible"
      class="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg"
    >
      <div
        :class="[
          'flex items-start justify-between gap-4 px-6 py-4 rounded-xl shadow-xl border backdrop-blur-md transition-all',
          notification.type === 'success' && 'bg-white border-[#10b481]/30',
          notification.type === 'error' && 'bg-white border-red-400/40',
          notification.type === 'inactive' && 'bg-white border-white',
        ]"
      >
        <div class="flex items-start gap-4">
          <div
            :class="[
              'w-10 h-10 rounded-full flex items-center justify-center',
              notification.type === 'success' &&
                'bg-[#10b481]/15 text-[#10b481]',
              notification.type === 'error' && 'bg-red-100 text-red-500',
              notification.type === 'inactive' && 'bg-red-500/20 text-red-500',
            ]"
          >
            <i
              :class="[
                'text-xl',
                notification.type === 'success' && 'bx bx-check',
                notification.type === 'error' && 'bx bx-x',
                notification.type === 'inactive' && 'bx bx-lock-alt',
              ]"
            ></i>
          </div>

          <div>
            <p class="text-gray-700 username text-sm">
              {{ notification.message }}
            </p>

            <p
              v-if="notification.type === 'inactive'"
              class="text-xs text-gray-600 small mt-1"
            >
              {{ t("accountinactive") }}
            </p>
          </div>
        </div>

        <button
          @click="closeNotification"
          class="text-gray-400 hover:text-gray-700 transition"
        >
          <i class="bx bx-x text-xl"></i>
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { API_URL } from "~/utils/config";
import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";

const router = useRouter();
const isLoading = ref(false);
const showPassword = ref(false);
const fieldErrors = ref({
  username: "",
  password: "",
});

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

const notification = ref({
  visible: false,
  message: "",
  type: "success" as "success" | "error" | "inactive",
});

const showNotification = (
  message: string,
  type: "success" | "error" | "inactive" = "success",
  duration = 5000
) => {
  notification.value = { visible: true, message, type };

  if (duration) {
    setTimeout(() => {
      notification.value.visible = false;
    }, duration);
  }
};

const closeNotification = () => {
  notification.value.visible = false;
};

const form = ref({
  username: "",
  password: "",
});
const loading = ref(false);

const user = ref<any>(null);
let userId = 0;
const isStaffUser = ref(false);

function isStaff(user: any): boolean {
  if (!user || !user.id_categorie_user) return false;
  const role = user.id_categorie_user.categorie;
  return role === "Admin" || role === "Staff"; 
}

async function checkUser() {
  const token = localStorage.getItem("access_token");
  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}/api/me/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Unauthorized");

    const data = await res.json();
    user.value = data;
    userId = data.id;
    isStaffUser.value = isStaff(data);

    return data;
  } catch {
    user.value = null;
    isStaffUser.value = false;
    return null;
  }
}

const submitSignin = async () => {
  isLoading.value = true;
  fieldErrors.value.username = "";
  fieldErrors.value.password = "";

  try {
    const response = await fetch(`${API_URL}/api/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form.value),
    });

    if (!response.ok) {
      const data = await response.json();
      console.log("Error response:", data); 

      if (response.status === 401) {
        fieldErrors.value.username = "Nom d'utilisateur incorrect";
        fieldErrors.value.password = "Mot de passe incorrect";
      } else if (response.status === 403) {
        showNotification(data.detail, "inactive", 7000);
      } else {
        showNotification("Something went wrong", "error");
      }
      return;
    }

    const data = await response.json();
    localStorage.setItem("access_token", data.access);

    const me = await checkUser();

    if (me && isStaffUser.value) {
      router.push("/admin");
    } else {
      router.push("/market");
    }
  } catch (error) {
    console.error("Network error:", error);
    alert("Network or server error.");
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  checkUser().then((me) => {
    if (me && isStaffUser.value) router.push("/admin/dashboard");
  });
});

watch(
  () => form.value.username,
  () => (fieldErrors.value.username = "")
);

watch(
  () => form.value.password,
  () => (fieldErrors.value.password = "")
);
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}
.slide-down-enter-from {
  opacity: 0;
  transform: translate(-50%, -20px);
}
.slide-down-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
</style>
