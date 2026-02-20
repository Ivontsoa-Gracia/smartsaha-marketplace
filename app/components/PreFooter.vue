<template>
  <section class="relative overflow-hidden py-6 md:py-12 bg-gray-50 text-white">

    <div class="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
      
      <div>
        <span class="inline-block mb-4 uppercase text-[#10b481] text-sm font-medium">
         {{ t('ready') }}
        </span>

        <h2 class="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#112830] leading-tight mb-6">
          {{ t("preFttitle") }}
        </h2>

        <p class="text-gray-500 max-w-xl mb-10 leading-relaxed">
          {{ t("preFtText") }}
        </p>

        <div class="flex flex-wrap gap-5">
          <button
            class="flex items-center justify-center gap-2 bg-[#10b481] text-white py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl outline-none"
          >
            {{ t("btnStart") }}
          </button>
        </div>
      </div>

      <div class="relative flex justify-center lg:justify-end">
        <div
          class="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-lg max-w-md w-full"
        >
          <img
            src="/img/image3.jpg"
            alt="Marketplace preview"
            class="rounded-2xl object-cover mb-6"
          />

          <div class="text-center">
            <p class="text-lg font-semibold mb-1 text-gray-800 ">
              {{ t('join') }}
            </p>
            <p class="text-sm text-gray-500">
              {{ t('joinTxt') }}
            </p>
          </div>
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
section {
  border-top-left-radius: 2rem;
  border-top-right-radius: 2rem;
}
</style>
