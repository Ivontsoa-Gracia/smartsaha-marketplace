<template>
  <div
    class="h-screen flex flex-col items-center justify-center bg-[#112830] relative overflow-hidden"
  >
    <div
      class="absolute top-10 left-10 w-32 h-32 bg-emerald-200 dark:bg-emerald-900 rounded-lg-full blur-3xl opacity-30"
    ></div>
    <div
      class="absolute bottom-10 right-10 w-40 h-40 bg-emerald-300 dark:bg-emerald-800 rounded-lg-full blur-3xl opacity-30"
    ></div>

    <div class="w-full max-w-3xl p-8 sm:p-10 relative">
      <div class="text-center mb-10">
        <img
          src="/marketplace_png.png"
          alt="SmartSaha logo"
          class="h-14 sm:h-16 mx-auto mb-4"
        />
        <h1
          class="text-3xl sm:text-4xl font-bold text-gray-100 dark:text-white mb-2"
        >
          Créer un compte
        </h1>
      </div>

      <form @submit.prevent="submitSignup" class="space-y-6">
        <div class="flex gap-4">
          <div class="relative flex-1">
            <i
              class="bx bx-user text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 text-lg"
            ></i>

            <input
              id="username"
              v-model="form.username"
              type="text"
              required
              placeholder=" "
              class="peer w-full px-4 py-3 pl-10 rounded-lg border border-white/20 bg-[#112830] text-gray-100 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
            />

            <label
              for="username"
              class="absolute left-10 text-gray-400 pointer-events-none transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-sm peer-focus:text-emerald-400 bg-[#112830] px-1"
              :class="form.username ? '-top-3 text-sm text-emerald-400' : ''"
            >
              Nom d’utilisateur
            </label>
          </div>

          <div class="relative flex-1">
            <i
              class="bx bx-envelope text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 text-lg"
            ></i>

            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              placeholder=" "
              class="peer w-full px-4 py-3 pl-10 rounded-lg border border-white/20 bg-[#112830] text-gray-100 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
            />

            <label
              for="email"
              class="absolute left-10 text-gray-400 pointer-events-none transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-sm peer-focus:text-emerald-400 bg-[#112830] px-1"
              :class="form.email ? '-top-3 text-sm text-emerald-400' : ''"
            >
              Adresse e-mail
            </label>
          </div>
        </div>

        <div class="flex gap-4">
          <div class="relative flex-1">
            <i
              class="bx bx-lock text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 text-lg"
            ></i>

            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              minlength="6"
              placeholder=" "
              class="peer w-full px-4 py-3 pl-10 pr-10 rounded-lg border border-white/20 bg-[#112830] text-gray-100 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
            />

            <label
              for="password"
              class="absolute left-10 text-gray-400 pointer-events-none transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-sm peer-focus:text-emerald-400 bg-[#112830] px-1"
              :class="form.password ? '-top-3 text-sm text-emerald-400' : ''"
            >
              Mot de passe
            </label>
          </div>

          <div
            class="relative flex-1 flex items-center border border-white/20 rounded-lg overflow-hidden bg-[#112830]"
          >
            <button
              type="button"
              @click="$refs.fileInput.click()"
              class="flex items-center justify-center w-12 h-12 bg-[#112830] text-[#10b481] hover:bg-[#1D444B] transition"
              title="Uploader un fichier"
            >
              <i class="bx bx-paperclip text-xl"></i>
            </button>

            <input
              :value="selectedFileName || form.justification"
              type="text"
              placeholder="Justificatif"
              readonly
              class="flex-1 px-4 py-3 text-gray-100 bg-[#112830] focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
            />

            <input
              ref="fileInput"
              type="file"
              @change="handleFileUpload"
              accept="image/*,.pdf"
              class="hidden"
            />
          </div>
        </div>
        <div class="space-y-2">
          <p class="text-gray-300 font-medium">Choisissez votre catégorie</p>

          <div class="grid grid-cols-3 gap-3">
            <div
              v-for="cat in categories"
              :key="cat.id"
              @click="selectedCategory = cat.id"
              :class="[
                'cursor-pointer px-4 py-3 rounded-lg border transition flex items-center justify-center text-sm font-medium',
                selectedCategory === cat.id
                  ? 'bg-[#10b481]/20 border-[#10b481] text-white'
                  : 'bg-[#112830] border-white/20 text-gray-300 hover:border-emerald-500',
              ]"
            >
              {{ cat.displayName }}
            </div>
          </div>
        </div>

        <div class="flex items-start gap-2 mb-4">
          <input
            id="terms"
            type="checkbox"
            v-model="acceptTerms"
            class="mt-1 accent-emerald-500"
          />
          <p class="text-sm text-gray-500 dark:text-gray-400">
            En vous inscrivant, vous acceptez les
            <a
              href="#"
              class="text-[#10b481] dark:text-emerald-400 hover:underline"
            >
              Conditions générales </a
            >.
          </p>
        </div>

        <button
          type="submit"
          :disabled="!acceptTerms"
          class="w-full bg-[#10b481] disabled:bg-white/10 disabled:cursor-not-allowed hover:bg-emerald-700 active:scale-[0.98] text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center"
        >
          S’inscrire
        </button>

        <button
  v-if="stripeOnboardingUrl"
  @click="redirectToStripe"
  class="mt-4 w-full bg-[#10b481] hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg"
>
  Compléter mon compte Stripe
</button>

      </form>

      <p class="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
        Vous avez déjà un compte ?
        <NuxtLink
          to="/signin"
          class="text-[#10b481] dark:text-emerald-400 font-medium hover:underline"
        >
          Se connecter
        </NuxtLink>
      </p>
    </div>
  </div>



  <div
    v-if="isLoading"
    class="absolute inset-0 bg-black/50 flex items-center justify-center"
  >
    <div
      class="w-12 h-12 border-4 border-t-[#10b481] border-white rounded-lg-full animate-spin"
    ></div>
  </div>

  <transition name="fade">
    <div
      v-if="notification.visible"
      class="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm"
    >
      <div
        :class="[
          'bg-white rounded-lg shadow-2xl px-8 py-6 flex flex-col items-center gap-4 w-[340px] text-center transition-all duration-300',
          notification.type === 'success'
            ? 'border-t-4 border-[#10b481]'
            : 'border-t-4 border-red-500',
        ]"
      >
        <div
          v-if="notification.type === 'success'"
          class="w-16 h-16 rounded-lg-full bg-[#10b481] flex items-center justify-center"
        >
          <i class="bx bx-check text-4xl font-extrabold text-white"></i>
        </div>
        <div
          v-else
          class="w-16 h-16 rounded-lg-full bg-red-500 flex items-center justify-center"
        >
          <i class="bx bx-x text-4xl font-extrabold text-white"></i>
        </div>

        <p
          :class="[
            'text-sm font-semibold',
            notification.type === 'success' ? 'text-gray-700' : 'text-gray-700',
          ]"
        >
          {{ notification.message }}
        </p>

        <p class="text-gray-500 text-sm">
          {{
            notification.type === "success"
              ? "Redirecting to your dashboard..."
              : "Please try again."
          }}
        </p>
      </div>
    </div>
  </transition>
  <transition name="fade">
    <div
      v-if="showCompressModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div
        class="w-[420px] max-w-[90vw] bg-white rounded-lg shadow-2xl p-6 space-y-6 animate-scaleIn"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-12 h-12 rounded-lg-full bg-emerald-100 flex items-center justify-center"
          >
            <i class="bx bx-file text-2xl text-[#10b481]"></i>
          </div>

          <div class="text-left">
            <h3 class="text-lg font-semibold text-gray-800">
              Fichier trop lourd
            </h3>
            <p class="text-sm text-gray-500">
              La taille dépasse la limite autorisée
            </p>
          </div>
        </div>

        <div class="rounded-lg bg-gray-50 border px-4 py-3 text-sm text-gray-700">
          <div class="flex justify-between">
            <span>Taille actuelle</span>
            <strong>{{ originalSizeMB }} Mo</strong>
          </div>
          <div class="flex justify-between text-gray-500">
            <span>Limite maximale</span>
            <span>10 Mo</span>
          </div>
        </div>

        <div v-if="compressing" class="space-y-3">
          <div class="w-full h-3 bg-gray-200 rounded-lg-full overflow-hidden">
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
            class="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-600 font-medium hover:bg-gray-100 transition"
          >
            Annuler
          </button>

          <button
            @click="confirmCompression"
            class="flex-1 py-2.5 rounded-lg bg-[#10b481] text-white font-semibold hover:bg-emerald-600 active:scale-[0.98] transition"
          >
            Compresser
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { API_URL } from "~/utils/config";

const router = useRouter();

const form = ref({
  email: "",
  justification: "",
  username: "",
  password: "",
});

const categories = ref<any[]>([]);
const selectedCategory = ref<number | null>(null);

const isLoading = ref(false);
const acceptTerms = ref(false);

const stripeOnboardingUrl = ref<string | null>(null);

const notification = ref({
  visible: false,
  message: "",
  type: "success" as "success" | "error",
});

const showNotification = (
  message: string,
  type: "success" | "error" = "success",
  duration = 3000
) => {
  notification.value = { visible: true, message, type };
  setTimeout(() => (notification.value.visible = false), duration);
};

onMounted(async () => {
  const res = await fetch(`${API_URL}/api/categorieuser/`);
  let data = await res.json();

  data = data
    .filter(
      (cat: { categorie: string }) => cat.categorie.toLowerCase() !== "admin"
    )
    .map((cat: any) => ({
      ...cat,
      displayName:
        cat.categorie.toLowerCase() === "user" ? "Both" : cat.categorie,
    }));

  categories.value = data;
});

/* =======================
   FILE / CLOUDINARY
======================= */

const selectedFileName = ref("");
const cloudinaryUrl = ref("");
const selectedFile = ref<File | null>(null);

const MAX_FILE_SIZE_MB = 10;

const showCompressModal = ref(false);
const compressing = ref(false);
const compressionProgress = ref(0);
const originalSizeMB = ref(0);
const compressedSizeMB = ref(0);
const fileToCompress = ref<File | null>(null);

const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files || !input.files[0]) return;

  const file = input.files[0];
  const sizeMB = file.size / 1024 / 1024;

  selectedFileName.value = file.name;

  // ❌ PDF → pas de compression
  if (file.type === "application/pdf" && sizeMB > MAX_FILE_SIZE_MB) {
    showNotification(
      "Le fichier PDF est trop lourd. Veuillez fournir un fichier plus léger.",
      "error"
    );
    return;
  }

  if (sizeMB > MAX_FILE_SIZE_MB && file.type.startsWith("image/")) {
    originalSizeMB.value = Number(sizeMB.toFixed(2));
    fileToCompress.value = file;
    showCompressModal.value = true;
    return;
  }

  selectedFile.value = file;
  cloudinaryUrl.value = await uploadToCloudinary(file);
};

const compressImageWithProgress = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    compressing.value = true;
    compressionProgress.value = 0;

    const img = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      img.src = reader.result as string;
    };

    reader.onerror = () => reject("Erreur de lecture du fichier");
    reader.readAsDataURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject("Impossible de créer le contexte canvas");
        return;
      }

      const max = 1024;
      let { width, height } = img;

      if (width > height && width > max) {
        height *= max / width;
        width = max;
      } else if (height > max) {
        width *= max / height;
        height = max;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      let quality = 0.9;

      const interval = setInterval(() => {
        compressionProgress.value += 10;
        quality -= 0.05;

        if (compressionProgress.value >= 100) {
          clearInterval(interval);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject("Erreur lors de la compression");
                return;
              }

              compressedSizeMB.value = Number(
                (blob.size / 1024 / 1024).toFixed(2)
              );

              const originalName = file.name;
              const lastDotIndex = originalName.lastIndexOf(".");
              const nameWithoutExt =
                lastDotIndex !== -1
                  ? originalName.slice(0, lastDotIndex)
                  : originalName;
              const extension =
                lastDotIndex !== -1 ? originalName.slice(lastDotIndex) : "";

              const compressedFileName = `compressed_${nameWithoutExt}${extension}`;

              compressing.value = false;

              resolve(
                new File([blob], compressedFileName, {
                  type: file.type,
                  lastModified: Date.now(),
                })
              );
            },
            file.type,
            Math.max(quality, 0.6)
          );
        }
      }, 120);
    };

    img.onerror = () => reject("Erreur de chargement de l'image");
  });
};

const confirmCompression = async () => {
  if (!fileToCompress.value) return;

  try {
    const compressed = await compressImageWithProgress(fileToCompress.value);

    selectedFile.value = compressed;
    selectedFileName.value = compressed.name;

    showCompressModal.value = false;

    cloudinaryUrl.value = await uploadToCloudinary(compressed);
  } catch {
    showNotification("Erreur lors de la compression", "error");
  }
};

const cancelCompression = () => {
  showCompressModal.value = false;
  selectedFile.value = null;
  selectedFileName.value = "";
};

const uploadToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const isImage = file.type.startsWith("image/");
  formData.append(
    "upload_preset",
    isImage ? "marketplace_posts" : "justificatif_mp"
  );

  const endpoint = isImage
    ? "https://api.cloudinary.com/v1_1/dhzaabn6m/image/upload"
    : "https://api.cloudinary.com/v1_1/dhzaabn6m/raw/upload";

  const res = await fetch(endpoint, { method: "POST", body: formData });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "Erreur Cloudinary");
  }

  const data = await res.json();
  return data.secure_url;
};

/* =======================
   SUBMIT
======================= */

const submitSignup = async () => {
  if (!selectedCategory.value) {
    showNotification("Veuillez sélectionner une catégorie.", "error");
    return;
  }

  if (!acceptTerms.value) {
    showNotification("Vous devez accepter les conditions générales.", "error");
    return;
  }

  if (!cloudinaryUrl.value) {
    showNotification("Veuillez ajouter un justificatif.", "error");
    return;
  }

  isLoading.value = true;

  try {
    const payload = {
      username: form.value.username,
      email: form.value.email,
      justificatif_url: cloudinaryUrl.value,
      avatar_url: cloudinaryUrl.value,
      password: form.value.password,
      id_categorie_user_id: selectedCategory.value,
    };

    const res = await fetch(`${API_URL}/api/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      const err = await res.json();
      showNotification(err.detail || "Erreur", "error");
      isLoading.value = false;
      return;
    }

    if (data.stripe_onboarding_url) {
    stripeOnboardingUrl.value = data.stripe_onboarding_url;
  }

  console.log("Stripe url:", JSON.stringify(stripeOnboardingUrl.value, null, 2));

    showNotification(
      "Inscription réussie. Votre compte est en attente de validation.",
      "success",
      6000
    );

    // setTimeout(() => router.push("/signin"), 6000);
  } catch {
    showNotification("Erreur serveur. Réessayez plus tard.", "error");
  } finally {
    isLoading.value = false;
  }
};

const redirectToStripe = () => {
  if (process.client && stripeOnboardingUrl.value) {
    window.location.href = stripeOnboardingUrl.value
  }
}


</script>
