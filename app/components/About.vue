<template>
  <section class="relative -mt-4 sm:-mt-20 z-20 px-4 sm:px-6 lg:px-16">
    <div class="max-w-7xl mx-auto">
      <div
        class="bg-[#10B481] rounded-2xl shadow-[0_20px_60px_rgba(16,180,129,0.15)] px-6 sm:px-8 py-8"
      >
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-0 relative">
          <div
            v-for="(item, index) in [
              { title: t('abouttitle1'), text: t('abouttext1') },
              { title: t('abouttitle2'), text: t('abouttext2') },
              { title: t('abouttitle3'), text: t('abouttext3') },
            ]"
            :key="index"
            class="flex flex-col items-center text-center relative px-4 py-6 border-b border-white/30 sm:border-b-0 last:border-b-0 sm:border-r last:border-r-0"
          >
            <h3
              class="text-base sm:text-lg font-semibold text-white mb-1 z-10 relative"
            >
              {{ item.title }}
            </h3>
            <p
              class="text-xs sm:text-sm text-white/80 leading-relaxed z-10 relative"
            >
              {{ item.text }}
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
.group:hover i {
  transform: scale(1.15);
  transition: transform 0.3s ease;
}
</style>
