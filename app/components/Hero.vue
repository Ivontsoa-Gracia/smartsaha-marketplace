<template>
  <section
    class="h-screen relative flex items-center bg-center bg-cover bg-gradient-to-b from-[#fff] to-[#fff]/40 text-[#222831]"
  >
    <div class="absolute inset-0">
      <img
        src="/img/image5.jpg"
        alt="SmartSaha Marketplace"
        class="w-full h-full object-cover opacity-30"
      />
    </div>
    <div
      class="container mx-auto px-6 lg:px-10 relative z-10 flex flex-col justify-center h-full"
    >
      <div class="max-w-lg text-left text-white">
        <h1
          class="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 drop-shadow-lg text-[#10b481]"
        >
          {{ t("accroche") }}
        </h1>
        <p class="text-base md:text-lg lg:text-lg mb-8 drop-shadow-md text-gray-700">
          {{ t("textacrroche") }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4">
          <button
            class="flex items-center justify-center gap-2 bg-[#10b481] text-white py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl outline-none"
          >
            {{ t("btnStart") }}
          </button>
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
</script>

<style scoped>
@media (max-width: 768px) {
  section {
    height: 500px;
  }
  h1 {
    font-size: 2.5rem;
  }
  p {
    font-size: 1rem;
  }
}
@media (max-width: 480px) {
  section {
    height: 450px;
  }
  h1 {
    font-size: 2rem;
  }
  p {
    font-size: 0.9rem;
  }
}
</style>
