<template>
  <nav aria-label="Breadcrumb" class="flex items-center gap-2 text-sm">
    <NuxtLink
      to="/"
      class="group flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 hover:bg-[#10b981]/10 transition"
    >
      <i
        class="bx bx-store text-gray-700 group-hover:text-[#10b981] text-base transition"
      ></i>
    </NuxtLink>

    <template v-for="(item, index) in breadcrumbs" :key="item.to">
      <i class="bx bx-chevron-right text-gray-300 text-xs"></i>

      <NuxtLink
        v-if="index < breadcrumbs.length - 1"
        :to="item.to"
        class="px-2 text-gray-700 small text-sm hover:text-[#10b981] transition "
      >
        {{ item.label }}
      </NuxtLink>

      <span v-else class="px-2 text-[#10b981] small text-sm ">
        {{ item.label }}
      </span>
    </template>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed } from "vue";
import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";

const route = useRoute();
const languageStore = useLanguageStore();

const t = (key: string) => {
  const lang = languageStore.lang;
  return translate[lang][key] || key;
};

const labelMap = computed(() => ({
  dashboard: t("dashboard"),
  post: t("posts"),
  posts: t("posts"),
  categories: t("category"),
  products: t("product"),
  users: t("user"),
  admin: t("dashboard"),
  bid: t("bid"),
  bids: t("bid"),
  chatbox: t("chatbox"),
  notification: t("notif"),
  create: t("create"),
  payment: "Paiement",
  transaction: "Transaction"
}));

const breadcrumbs = computed(() => {
  const segments = route.path.split("/").filter(Boolean);
  let fullPath = "";

  return segments
    .filter((segment) => isNaN(Number(segment)))
    .map((segment) => {
      fullPath += `/${segment}`;

      return {
        label: labelMap.value[segment] || segment.replace(/-/g, " "),
        to: fullPath,
      };
    });
});
</script>
