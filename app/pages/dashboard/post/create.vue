<template>
  <div class="space-y-8 p-12 bg-gray-50/60 min-h-screen">
    <!-- <Breadcrumb /> -->

    <div
      class="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8 transition-all duration-500"
    >
      <h2 class="mb-6 text-left">
        {{ t("createTitle") }}
      </h2>

      <div class="flex justify-between mb-8 hidden">
        <div
          v-for="(stepLabel, index) in steps"
          :key="index"
          class="flex flex-col items-center"
        >
          <div
            :class="[
              'w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-300',
              step === index + 1
                ? 'bg-[#10b481] text-white border-[#10b481]'
                : 'border-gray-300 text-gray-500',
            ]"
          >
            {{ index + 1 }}
          </div>
          <p class="text-xs mt-2">{{ stepLabel }}</p>
        </div>
      </div>

      <transition name="fade" mode="out-in">
        <form v-if="step === 1" @submit.prevent="nextStep" class="space-y-4">
          <div>
            <label class="block label mb-1">{{ t("title") }}</label>
            <input
              v-model="form.title"
              type="text"
              class="input-field content"
              required
            />
          </div>

          <div>
            <label class="block label mb-1">{{ t("desc") }}</label>
            <textarea
              v-model="form.description"
              class="input-field content"
              required
            ></textarea>
          </div>

          <div class="flex gap-4">
            <div class="flex-1">
              <label class="block label mb-1">{{ t("listingsType") }}</label>
              <select v-model="form.type_post_id" class="input-field content">
                <option
                  v-for="type in filteredTypePosts"
                  :key="type.id"
                  :value="type.id"
                >
                  {{ type.type }}
                </option>
              </select>
            </div>

            <div class="relative w-72">
              <label class="block label mb-1">
                {{ t("label") }}
              </label>

              <button
                type="button"
                @click="showDropdown = !showDropdown"
                class="w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-white border rounded-lg text-sm text-gray-700 transition focus:outline-none hover:border-[#10b481] focus:ring-2 focus:ring-[#10b481]/30"
                :class="showDropdown ? 'border-[#10b481]' : 'border-gray-300'"
              >
                <span class="truncate text-left">
                  <span
                    v-if="!form.labels_ids.length"
                    class="text-gray-400 small"
                  >
                    Sélectionner des labels
                  </span>

                  <span v-else>
                    {{
                      labels
                        .filter((l) => form.labels_ids.includes(l.id))
                        .map((l) => l.name)
                        .join(", ")
                    }}
                  </span>
                </span>

                <i
                  :class="
                    showDropdown ? 'bx bx-chevron-up' : 'bx bx-chevron-down'
                  "
                  class="text-gray-400"
                ></i>
              </button>

              <transition name="fade">
                <div
                  v-if="showDropdown"
                  class="absolute z-20 mt-2 w-full bg-white rounded-lg border border-gray-200 shadow-xl max-h-60 overflow-auto content"
                >
                  <div
                    v-for="lab in labels"
                    :key="lab.id"
                    class="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-gray-50"
                    @click="toggleLabel(lab.id)"
                  >
                    <input
                      type="checkbox"
                      :checked="form.labels_ids.includes(lab.id)"
                      class="h-4 w-4 accent-[#10b481]"
                      readonly
                    />

                    <span class="text-sm text-gray-700">
                      {{ lab.name }}
                    </span>
                  </div>

                  <div
                    v-if="!labels.length"
                    class="px-4 py-3 text-sm text-gray-400 text-center small"
                  >
                    Aucun label disponible
                  </div>
                </div>
              </transition>

              <div
                v-if="form.labels_ids.length"
                class="flex flex-wrap gap-2 mt-3 small"
              >
                <span
                  v-for="lab in labels.filter((l) =>
                    form.labels_ids.includes(l.id)
                  )"
                  :key="lab.id"
                  class="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#10b481]/10 text-[#10b481]"
                >
                  {{ lab.name }}
                  <button
                    @click="removeLabel(lab.id)"
                    class="hover:text-[#10b481]/70"
                  >
                    <i class="bx bx-x text-sm"></i>
                  </button>
                </span>
              </div>
            </div>

            <div class="relative flex-1">
              <label class="block label mb-1">
                {{ t("location") }}
              </label>

              <div class="relative">
                <input
                  v-model="form.location"
                  type="text"
                  placeholder="Sélectionner ou rechercher un pays"
                  class="w-full px-4 py-2.5 content rounded-lg border text-sm bg-white text-gray-700 border-gray-300 transition focus:outline-none focus:ring-2 focus:ring-[#10b481]/30 focus:border-[#10b481]"
                  @focus="showCountryDropdown = true"
                  @input="filterCountries"
                  @blur="handleBlur"
                  required
                />
              </div>

              <transition name="fade">
                <div
                  v-if="showCountryDropdown"
                  class="absolute z-30 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-auto"
                  @mousedown.prevent
                >
                  <div
                    v-for="country in filteredCountries"
                    :key="country"
                    @click="selectCountry(country)"
                    class="px-4 py-2.5 cursor-pointer text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    {{ country }}
                  </div>

                  <div
                    v-if="!filteredCountries.length"
                    class="px-4 py-3 text-sm text-gray-400"
                  >
                    Aucun pays trouvé
                  </div>
                </div>
              </transition>
            </div>
          </div>

          <div>
            <div
              class="mt-8 flex flex-col items-center justify-center border-2 border-dashed border-[#112830]/10 rounded-2xl p-8 text-center cursor-pointer bg-white hover:border-[#10b481] hover:bg-[#10b481]/5 transition-all"
            >
              <label class="w-full cursor-pointer block">
                <div
                  v-if="!form.image_url"
                  class="flex flex-col items-center justify-center w-full h-full cursor-pointer"
                >
                  <i class="bx bx-upload text-6xl mb-3 text-gray-400"></i>
                  <span class="label mb-2">
                    Cliquez ou glissez-déposez votre fichier
                  </span>
                </div>

                <div
                  v-else
                  class="flex items-center justify-between gap-4 bg-[#fafa9] rounded-xl p-3 group"
                >
                  <div class="flex items-center gap-3 min-w-0">
                    <img
                      :src="form.image_url"
                      class="w-12 h-12 object-cover rounded-lg shadow-sm"
                    />

                    <div class="flex flex-col min-w-0 text-left">
                      <span class="label truncate"> Image uploadée </span>
                      <span class="text-xs text-gray-400 small truncate">
                        {{ getFileName(form.image_url) }}
                      </span>
                    </div>
                  </div>
                </div>

                <input type="file" @change="handleFileUpload" class="hidden" />
              </label>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-4">
            <button type="submit" class="btn-primary">
              {{ t("next") }}
            </button>
          </div>
        </form>
      </transition>
      <datalist id="countries-list">
        <option v-for="c in filteredCountries" :key="c" :value="c"></option>
      </datalist>

      <transition name="fade" mode="out-in">
        <form v-if="step === 2" @submit.prevent="nextStep" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block label">{{ t("product") }}</label>
              <select v-model="form.product_id" class="input-field content">
                <option v-for="p in products" :key="p.id" :value="p.id">
                  {{ p.product }}
                </option>
              </select>
            </div>

            <div>
              <label class="block label">{{ t("category") }}</label>
              <select
                v-model="form.categorie_post_id"
                class="input-field content"
              >
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.categorie }}
                </option>
              </select>
            </div>

            <div class="md:col-span-2">
              <label class="block label">{{ t("quantity") }}</label>
              <input
                v-model="form.quantity"
                type="number"
                min="1"
                class="input-field content w-full"
                required
              />
            </div>

            <div class="grid grid-cols-2 gap-4 md:col-span-2">
              <div>
                <label class="block label">{{ t("price") }}</label>
                <input
                  v-model="form.price"
                  type="text"
                  class="input-field content w-full"
                  required
                />
              </div>

              <div>
                <label class="block label">{{ t("currency") }}</label>
                <select v-model="form.currency_id" class="input-field content w-full">
                  <option v-for="c in currencies" :key="c.id" :value="c.id">
                    {{ c.currency }} ({{ c.symbol }})
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-4">
            <button type="button" class="btn-neutre" @click="prevStep">
              {{ t("prev") }}
            </button>

            <button type="submit" class="btn-primary">
              {{ t("next") }}
            </button>
          </div>
        </form>
      </transition>

      <transition name="fade" mode="out-in">
        <div v-if="step === 3" class="space-y-6 ">
          <div
            class="rounded-2xl bg-white overflow-hidden"
          >
            <div class="relative h-96">
              <img
                v-if="form.image_url"
                :src="form.image_url"
                alt="Preview"
                class="absolute inset-0 w-full h-full object-cover"
              />
              <div
                v-else
                class="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-500 small"
              >
                {{ t('noImage') }}
              </div>

              <div
                class="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-transparent"
              ></div>

              <div class="absolute bottom-4 left-4 flex flex-row gap-3">
                <span
                  class="rounded-full bg-white/90 px-3 py-1 text-xs text-gray-600 shadow z-10 small"
                >
                  {{ selectedTypePost?.type || "—" }}
                </span>
                <div
                  class="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs text-gray-600 small shadow z-10"
                >
                  <i class="bx bx-location-plus"></i>
                  <span>{{ form.location }}</span>
                </div>
              </div>
            </div>

            <div class="p-6 space-y-4">
              <h2 class="subtitle leading-snug">
                {{ form.title || "Sans titre" }}
              </h2>

              <p class="content leading-relaxed">
                {{ form.description }}
              </p>

              <div
                class="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 pt-4 small"
              >
                <div
                  class="px-2 flex items-center justify-start gap-2 text-gray-700"
                >
                  <i class="bx bx-package text-lg text-gray-700"></i>
                  <span class="text-sm small">
                    {{ selectedProduct?.product || "—" }}
                  </span>
                </div>
                <div class="px-2 flex items-center justify-center gap-2 text-gray-700">
                  <i class="bx bx-cube text-lg text-gray-700"></i>
                  <span class="text-sm small">
                    {{ form.quantity }}
                  </span>
                </div>

                <div
                  class="px-2 flex items-center justify-end gap-2 text-gray-700"
                >
                  <i class="bx bx-wallet text-lg text-gray-700"></i>
                  <span class="text-sm small">
                    {{ form.price }}
                    {{ selectedCurrency?.symbol || selectedCurrency?.currency }}
                  </span>
                </div>
              </div>
              <div v-if="selectedLabels.length" class="flex flex-wrap gap-2">
                <span
                  v-for="lab in selectedLabels"
                  :key="lab.id"
                  class="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700 small"
                >
                  {{ lab.name }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-4">
            <button type="button" class="btn-neutre" @click="prevStep">
              {{ t("prev") }}
            </button>

            <button type="button" class="btn-primary" @click="submitPost">
              {{ t("save") }}
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>

  <!-- <transition name="slide-right">
    <div
      v-if="notification.visible"
      class="fixed bottom-4 right-4 z-[9999] bg-[#112830] rounded shadow-xl px-6 py-4 flex items-center gap-4 w-80 text-left border-l-4 transition-all duration-300"
      :class="
        notification.type === 'success' ? 'border-[#10b481]' : 'border-red-500'
      "
    >
      <div
        :class="notification.type === 'success' ? 'bg-[#10b481]' : 'bg-red-500'"
        class="w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl"
      >
        <i
          :class="notification.type === 'success' ? 'bx bx-check' : 'bx bx-x'"
        ></i>
      </div>
      <div>
        <p class="font-medium text-sm text-gray-100">
          {{ notification.message }}
        </p>
        <p class="text-gray-300 text-xs">
          {{
            notification.type === "success"
              ? "Success!"
              : "Something went wrong."
          }}
        </p>
      </div>
    </div>
  </transition> -->


  <transition name="slide-right">
    <div
      v-if="notification.visible"
      class="fixed bottom-10 right-10 z-50 w-full max-w-lg"
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
              class="text-xs text-gray-600 small mt-1"
            >
            {{
            notification.type === "success"
              ? "Success!"
              : "Something went wrong."
          }}
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

  <transition name="fade">
    <div
      v-if="showCompressModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div
        class="w-[420px] max-w-[90vw] bg-white rounded-2xl shadow-2xl p-6 space-y-6 animate-scaleIn"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center"
          >
            <i class="bx bx-file text-2xl text-[#10b481]"></i>
          </div>

          <div class="text-left">
            <h3 class=" subtitle">
              Fichier trop lourd
            </h3>
            <p class="content">
              La taille dépasse la limite autorisée
            </p>
          </div>
        </div>

        <div class="rounded-xl bg-white border border-gray-200 px-4 py-3 text-sm text-gray-700">
          <div class="flex justify-between small">
            <span class="small">Taille actuelle</span>
            <strong>{{ originalSizeMB }} Mo</strong>
          </div>
          <div class="flex justify-between text-gray-400 small">
            <span>Limite maximale</span>
            <span>10 Mo</span>
          </div>
        </div>

        <div v-if="compressing" class="space-y-3">
          <div class="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-300"
              :style="{ width: compressionProgress + '%' }"
            ></div>
          </div>

          <div class="flex justify-between text-xs text-gray-500">
            <span>Compression en cours…</span>
            <span>{{ compressionProgress }} %</span>
          </div>

          <p
            v-if="compressedSizeMB"
            class="text-xs text-emerald-600 font-medium text-center"
          >
            Nouvelle taille : {{ compressedSizeMB }} Mo
          </p>
        </div>

        <div v-else class="flex gap-3">
          <button
            @click="cancelCompression"
            class="flex-1 py-2.5 btn-neutre"
          >
            Annuler
          </button>

          <button
            @click="confirmCompression"
            class="flex-1 py-2.5 btn-primary"
          >
            Compresser
          </button>
        </div>
      </div>
    </div>
  </transition>

  <transition name="fade">
    <div
      v-if="showTooLargeModal"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl p-6 w-[380px] text-center space-y-4">
        <div
          class="w-16 h-16 mx-auto rounded-full bg-red-500 flex items-center justify-center"
        >
          <i class="bx bx-x text-4xl text-white"></i>
        </div>

        <h3 class="text-lg font-semibold text-red-600">
          Fichier trop volumineux
        </h3>

        <p class="text-sm text-gray-600">
          Taille actuelle :
          <b>{{ originalSizeMB }} Mo</b><br />
          Taille maximale autorisée : <b>50 Mo</b>
        </p>

        <button
          @click="showTooLargeModal = false"
          class="mt-2 px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
        >
          Compris
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
definePageMeta({ layout: "dashboard" });
import { ref, onMounted, computed } from "vue";
import { API_URL } from "~/utils/config";
import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";
import { useRouter } from "vue-router";
import Breadcrumb from "~/components/Breadcrumb.vue";
const router = useRouter();

const languageStore = useLanguageStore();
const t = (key) => {
  const lang = languageStore.lang;
  return translate[lang][key] || key;
};

const isLoading = ref(false);
const notification = ref({ visible: false, message: "", type: "success" });

const showNotification = (message, type = "success", duration = 3000) => {
  notification.value = { visible: true, message, type };
  setTimeout(() => (notification.value.visible = false), duration);
};

const step = ref(1);
const steps = ["General Info", "Details", "Preview"];

const showCompressModal = ref(false);
const compressing = ref(false);

const originalSizeMB = ref(0);
const compressedSizeMB = ref(null);
const compressionProgress = ref(0);

let selectedFile = null;

const form = ref({
  title: "",
  description: "",
  quantity: 1,
  price: "",
  location: "",
  image_url: "",
  type_post_id: "",
  product_id: "",
  categorie_post_id: "",
  currency_id: "",
  labels_ids: [],
});

const selectedProduct = computed(() => {
  return products.value.find((p) => p.id === form.value.product_id);
});

const selectedTypePost = computed(() => {
  return typePosts.value.find((t) => t.id === form.value.type_post_id);
});

const selectedCurrency = computed(() => {
  return currencies.value.find((c) => c.id === form.value.currency_id);
});

const typePosts = ref([]);
const products = ref([]);
const categories = ref([]);
const currencies = ref([]);
const labels = ref([]);
const user = ref(null);

const countries = ref([]);
const filteredCountries = ref([]);

const showCountryDropdown = ref(false);

const selectCountry = (country) => {
  form.value.location = country;
  showCountryDropdown.value = false;
};

const handleBlur = () => {
  // petit délai pour laisser le clic se faire
  setTimeout(() => {
    showCountryDropdown.value = false;
  }, 150);
};

const filterCountries = () => {
  const search = form.value.location.toLowerCase();
  filteredCountries.value = countries.value.filter((c) =>
    c.toLowerCase().includes(search)
  );
};

const showDropdown = ref(false);

// Computed pour les labels sélectionnés
const selectedLabels = computed(() => {
  if (!Array.isArray(labels.value)) return [];
  return labels.value.filter((lab) => form.value.labels_ids.includes(lab.id));
});

const nextStep = () => {
  if (step.value < 3) step.value++;
};
const prevStep = () => {
  if (step.value > 1) step.value--;
};

const getFileName = (url) => {
  if (!url) return "";
  return url.split("/").pop();
};

const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  selectedFile = file;
  originalSizeMB.value = +(file.size / (1024 * 1024)).toFixed(2);

  if (originalSizeMB.value > 10) {
    showNotification(
      "Le fichier dépasse 10 Mo. Veuillez choisir une image plus légère.",
      "error"
    );
    return;
  }

  if (originalSizeMB.value > 5) {
    showCompressModal.value = true;
    return;
  }

  await uploadToCloudinary(file);
};

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "marketplace_posts");
  formData.append("folder", "posts");

  try {
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dhzaabn6m/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    if (data.secure_url) {
      form.value.image_url = data.secure_url;
    } else {
      showNotification("Erreur lors de l’upload de l’image.", "error");
    }
  } catch (err) {
    console.error(err);
    showNotification("Erreur réseau pendant l’upload.", "error");
  }
};

const compressImage = (file, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const img = new Image();

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    img.onerror = reject;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject("Compression échouée");

          const compressedFile = new File([blob], file.name, {
            type: "image/jpeg",
          });

          resolve(compressedFile);
        },
        "image/jpeg",
        quality
      );
    };

    reader.readAsDataURL(file);
  });
};

const confirmCompression = async () => {
  compressing.value = true;
  compressionProgress.value = 0;

  const progressInterval = setInterval(() => {
    if (compressionProgress.value < 90) {
      compressionProgress.value += 10;
    }
  }, 200);

  try {
    const compressedFile = await compressImage(selectedFile, 0.7);

    clearInterval(progressInterval);
    compressionProgress.value = 100;

    compressedSizeMB.value = +(compressedFile.size / (1024 * 1024)).toFixed(2);

    setTimeout(async () => {
      compressing.value = false;
      showCompressModal.value = false;

      await uploadToCloudinary(compressedFile);

      selectedFile = null;
      compressionProgress.value = 0;
    }, 500);
  } catch (err) {
    console.error(err);
    showNotification("Erreur lors de la compression", "error");
    compressing.value = false;
  }
};

const cancelCompression = () => {
  showCompressModal.value = false;
  selectedFile = null;
};

onMounted(async () => {
  const res = await fetch(
    "https://restcountries.com/v3.1/all?fields=name,cca2"
  );
  const data = await res.json();
  countries.value = data.map((c) => c.name.common).sort();
  filteredCountries.value = countries.value;

  const token = localStorage.getItem("access_token");
  if (!token) return;

  try {
    const me = await fetch(`${API_URL}/api/me/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const meData = await me.json();
    const userRes = await fetch(`${API_URL}/api/users/${meData.id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    user.value = await userRes.json();

    const [tp, pr, cat, cur, lab] = await Promise.all([
      fetch(`${API_URL}/api/typepost/`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${API_URL}/api/products/`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${API_URL}/api/categoriepost/`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${API_URL}/api/currencies/`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${API_URL}/api/label/`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    typePosts.value = await tp.json();
    products.value = await pr.json();
    categories.value = await cat.json();
    currencies.value = await cur.json();
    labels.value = await lab.json();
  } catch (err) {
    console.error("Error loading data:", err);
  }
});

const submitPost = async () => {
  const token = localStorage.getItem("access_token");

  const payload = {
    title: form.value.title,
    description: form.value.description,
    quantity: form.value.quantity,
    price: form.value.price,
    location: form.value.location,
    image_url: form.value.image_url || null,
    type_post_id: form.value.type_post_id,
    product_id: form.value.product_id,
    categorie_post_id: form.value.categorie_post_id,
    currency_id: form.value.currency_id,
    labels_ids: form.value.labels_ids,
  };

  isLoading.value = true;

  try {
    const res = await fetch(`${API_URL}/api/posts/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      showNotification(
        "Votre annonce a été enregistrée et sera publiée après validation par l’administrateur.",
        "success"
      );
    } else {
      const err = await res.json();
      console.error(err);
      showNotification("Erreur lors de la publication !", "error");
    }
  } catch (err) {
    console.error(err);
    showNotification("Erreur réseau !", "error");
  } finally {
    isLoading.value = false;
  }
};

const filteredTypePosts = computed(() => {
  if (!user.value || !typePosts.value.length) return [];

  const role = user.value.id_categorie_user.categorie;
  console.log("Role", role);
  console.log("User", JSON.stringify(user.value, null, 2));

  if (role === "Acheteur") {
    return typePosts.value.filter((t) => t.type.toLowerCase() === "buying");
  }

  if (role === "Vendeur") {
    return typePosts.value.filter((t) => t.type.toLowerCase() === "selling");
  }

  return typePosts.value;
});

const toggleLabel = (id) => {
  if (form.value.labels_ids.includes(id)) {
    form.value.labels_ids = form.value.labels_ids.filter((l) => l !== id);
  } else {
    form.value.labels_ids.push(id);
  }
};

const removeLabel = (id) => {
  form.value.labels_ids = form.value.labels_ids.filter((l) => l !== id);
};
</script>

<style scoped>
.input-field {
  @apply w-full px-4 py-2.5 rounded-lg border border-[#112830]/15 bg-white focus:border-[#10b481] focus:ring-4 focus:ring-[#10b481]/10 outline-none transition-all;
}
.btn-secondary {
  @apply text-gray-700 border border-gray-700 px-5 py-2 transition-all;
}
.btn-success {
  @apply bg-[#10b481] text-white px-5 py-2 rounded transition-all duration-300 transform hover:scale-105 hover:-translate-y-[1px] hover:shadow-xl focus:outline-none focus:ring-4;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
