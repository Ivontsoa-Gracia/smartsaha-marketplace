<template>
  <section class="relative bg-white py-20 md:py-32 overflow-hidden">
    <div class="max-w-7xl mx-auto px-6">
      <div class="max-w-3xl mx-auto text-center mb-20">
        <h2 class="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
          {{ t("howItWork") }}
        </h2>
        <p class="mt-4 text-gray-500 text-sm sm:text-base">
          Une marketplace agricole moderne, simple et efficace.
        </p>
      </div>

      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative"
      >
        <div
          v-for="(feature, index) in features"
          :key="feature.key"
          class="group relative flex flex-col items-center text-center bg-white rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-md hover:shadow-2xl transition-all duration-500"
        >
          <div
            class="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-[#10B481]/10 text-[#10B481] group-hover:bg-[#10B481] group-hover:text-white transition-all duration-500 z-10 relative"
          >
            <i :class="feature.icon" class="text-2xl"></i>
          </div>

          <h3
            class="text-lg sm:text-xl font-semibold text-gray-900 z-10 relative group-hover:text-[#10B481] transition"
          >
            {{ feature.title }}
          </h3>

          <p
            class="mt-2 text-xs sm:text-sm text-gray-500 leading-relaxed z-10 relative"
          >
            {{ feature.description }}
          </p>

          <div
            class="absolute -bottom-10 -right-10 w-32 h-32 bg-[#10B481] opacity-0 blur-3xl rounded-full group-hover:opacity-10 transition duration-700"
          ></div>

          <div
            v-if="index < features.length - 1"
            class="absolute right-0 top-4 h-full w-px bg-gray-200 opacity-30 hidden sm:block"
          ></div>
          <div
            v-if="index < features.length - 1"
            class="sm:hidden w-full h-px bg-gray-200 opacity-30 mt-6"
          ></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";
import { useRouter } from "vue-router";
const router = useRouter();

const languageStore = useLanguageStore();
const t = (key: string) => {
  const lang = languageStore.lang;
  return translate[lang][key] || key;
};

const features = [
  {
    key: "access",
    title: t("featuresTitle1"),
    description: t("featuresText1"),
    icon: "bx bx-grid-alt",
    tag: "Dashboard",
    color: "bg-[#10b481]",
  },
  {
    key: "listing",
    title: t("featuresTitle2"),
    description: t("featuresText2"),
    icon: "bx bx-store",
    tag: "Marketplace",
    color: "bg-[#10b481]",
  },
  {
    key: "negotiation",
    title: t("featuresTitle3"),
    description: t("featuresText3"),
    icon: "bx bx-conversation",
    tag: "Bidding",
    color: "bg-[#10b481]",
  },
  {
    key: "trust",
    title: t("featuresTitle4"),
    description: t("featuresText4"),
    icon: "bx bx-shield-quarter",
    tag: "Reputation",
    color: "bg-[#10b481]",
  },
];
</script>

<style scoped>
div.flex-shrink-0:hover {
  transform: scale(1.05);
  transition: all 0.3s ease-in-out;
}

@media (hover: hover) {
  .shadow-md:hover {
    transform: scale(1.03);
  }
}
</style>
