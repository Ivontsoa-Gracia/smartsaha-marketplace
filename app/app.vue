<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({
  title: "Marketplace SmartSaha - Enchères Agricoles",
  titleTemplate: "%s | SmartSaha",
  meta: [
    { name: "description", content: "SmartSaha Marketplace facilite l’accès au marché pour les petits agriculteurs et coopératives grâce à une plateforme d’enchères agricole sécurisée et intuitive." },
    { name: "keywords", content: "SmartSaha, marketplace agricole, enchères agricoles, agriculteurs, coopératives, vente directe, agriculture" },
    { name: "robots", content: "index, follow" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { property: "og:title", content: "Marketplace SmartSaha - Enchères Agricoles" },
    { property: "og:description", content: "Plateforme sécurisée et intuitive pour connecter producteurs et acheteurs." },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://www.smart-saha.com" },
    { property: "og:image", content: "/og-image.png" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Marketplace SmartSaha - Enchères Agricoles" },
    { name: "twitter:description", content: "Plateforme sécurisée et intuitive pour connecter producteurs et acheteurs." },
    { name: "twitter:image", content: "/og-image.png" }
  ],
  link: [
    { rel: "stylesheet", href: "https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" },
    { rel: "stylesheet", href: "https://cdn.boxicons.com/fonts/basic/boxicons.min.css" },
    { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Readex+Pro:wght@400;500;700;800&display=swap" },
    {
      rel: "preload",
      as: "font",
      href: "/fonts/Inter_24pt-Regular.ttf",
      type: "font/ttf",
      crossorigin: "anonymous",
    },
    {
      rel: "preload",
      as: "font",
      href: "/fonts/Inter_28pt-Italic.ttf",
      type: "font/ttf",
      crossorigin: "anonymous",
    },
    {
      rel: "preload",
      as: "font",
      href: "/fonts/Inter_28pt-Medium.ttf",
      type: "font/ttf",
      crossorigin: "anonymous",
    },
    {
      rel: "preload",
      as: "font",
      href: "/fonts/Manrope-Bold.ttf",
      type: "font/ttf",
      crossorigin: "anonymous",
    },
    {
      rel: "preload",
      as: "font",
      href: "/fonts/Manrope-SemiBold.ttf",
      type: "font/ttf",
      crossorigin: "anonymous",
    },
    {
      rel: "preload",
      as: "font",
      href: "/fonts/Manrope-ExtraBold.ttf",
      type: "font/ttf",
      crossorigin: "anonymous",
    },
  ],
  script: [
    { type: "module", src: "https://cdn.jsdelivr.net/npm/emoji-picker-element@1/index.js" }
  ]
})
</script>

<style>
@font-face {
  font-family: "Inter-Regular";
  src: url("/fonts/Inter_24pt-Regular.ttf") format("opentype");
}

@font-face {
  font-family: "Inter-Italic";
  src: url("/fonts/Inter_28pt-Italic.ttf") format("opentype");
}

@font-face {
  font-family: "Inter-Medium";
  src: url("/fonts/Inter_28pt-Medium.ttf") format("opentype");
}

@font-face {
  font-family: "Manrope-Bold";
  src: url("/fonts/Manrope-Bold.ttf") format("opentype");
}

@font-face {
  font-family: "Manrope-SemiBold";
  src: url("/fonts/Manrope-SemiBold.ttf") format("opentype");
}

@font-face {
  font-family: "Manrope-ExtraBold";
  src: url("/fonts/Manrope-ExtraBold.ttf") format("opentype");
}
</style>