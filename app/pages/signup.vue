<template>
  <div class="min-h-screen flex bg-[#fafaf9]">
    <!-- LEFT: SCROLLABLE FORM -->
    <div class="flex-1 overflow-y-auto max-h-screen p-4 sm:p-12">
      <div class="max-w-2xl mx-auto">
        <div class="">
          <div class="text-left mb-16">
            <img src="/logo.png" class="h-16 mb-6" />
            <h2 class="">Créer votre compte</h2>
            <p class="mt-4 content">
              Rejoignez SmartSaha et commencez à vendre ou acheter en toute
              sécurité.
            </p>
          </div>

          <form @submit.prevent="submitSignup">
            <div class="gap-16">
              <div class="space-y-8">
                <div>
                  <h2
                    class="text-sm small uppercase tracking-wider text-gray-500 mb-6"
                  >
                    Informations du compte
                  </h2>

                  <div class="space-y-4">
                    <div class="grid gap-6 md:grid-cols-2">
                      <div>
                        <label class="block label mb-2">
                          Nom d’utilisateur
                        </label>
                        <input
                          v-model="form.username"
                          type="text"
                          required
                          class="w-full px-4 py-2.5 content rounded-xl border border-[#112830]/15 bg-white focus:border-[#10b481] focus:ring-4 focus:ring-[#10b481]/10 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label class="block label mb-2"> Adresse e-mail </label>
                        <input
                          v-model="form.email"
                          type="email"
                          required
                          class="w-full px-4 py-2.5 content rounded-xl border border-[#112830]/15 bg-white focus:border-[#10b481] focus:ring-4 focus:ring-[#10b481]/10 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label class="block label mb-2"> Mot de passe </label>
                      <input
                        v-model="form.password"
                        type="password"
                        required
                        minlength="6"
                        class="w-full px-4 py-2.5 content rounded-xl border border-[#112830]/15 bg-white focus:border-[#10b481] focus:ring-4 focus:ring-[#10b481]/10 outline-none transition-all"
                      />
                    </div>

                    <div class="mt-8">
                      <label class="block label mb-3">
                        Avatar (facultatif)
                      </label>

                      <div
                        @click="$refs.avatarInput.click()"
                        class="flex flex-col items-center justify-center border-2 border-dashed border-[#112830]/10 rounded-2xl p-8 text-center cursor-pointer bg-white hover:border-[#10b481] hover:bg-[#10b481]/5 transition-all"
                      >
                        <div
                          v-if="!avatarPreview"
                          class="flex flex-col items-center justify-center w-full h-full"
                        >
                          <i class="bx bx-user text-6xl mb-3 text-gray-400"></i>
                          <span class="label mb-2">
                            Ajouter une photo de profil
                          </span>
                        </div>

                        <div
                          v-else
                          class="flex items-center justify-between gap-4 rounded-xl p-3 w-full"
                        >
                          <div class="flex items-center gap-3 min-w-0">
                            <img
                              :src="avatarPreview"
                              class="w-12 h-12 object-cover rounded-lg shadow-sm"
                            />

                            <div class="flex flex-col min-w-0 text-left">
                              <span class="label truncate">
                                Avatar uploadé
                              </span>
                              <span class="text-xs text-gray-400 truncate">
                                {{ avatarFileName }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <input
                        ref="avatarInput"
                        type="file"
                        accept="image/*"
                        @change="handleAvatarUpload"
                        class="hidden"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h2
                    class="text-sm small uppercase tracking-wider text-gray-500 mb-4"
                  >
                    Catégorie
                  </h2>

                  <div class="grid grid-cols-3 gap-2 sm:gap-4">
                    <div
                      v-for="cat in categories"
                      :key="cat.id"
                      @click="selectedCategory = cat.id"
                      :class="[
                        'cursor-pointer px-5 py-2.5 rounded-xl small border flex items-center justify-center text-sm font-medium transition-all duration-200 shadow-sm transform',
                        selectedCategory === cat.id
                          ? 'bg-[#10b481] text-white border-[#10b481]'
                          : 'bg-[#fff] border-[#10b481]/50 text-[#10b481] hover:bg-[#10b481]/10 hover:text-[#10b481]',
                      ]"
                    >
                      {{ cat.displayName }}
                    </div>
                  </div>
                </div>

                <div>
                  <h2
                    class="text-sm small uppercase tracking-wider text-gray-500 mb-6"
                  >
                    Vérification
                  </h2>

                  <div class="mb-8">
                    <label class="block label mb-3">
                      Justificatif (obligatoire)
                    </label>

                    <div
                      @click="$refs.fileInput.click()"
                      class="flex flex-col items-center justify-center border-2 border-dashed border-[#112830]/10 rounded-2xl p-8 text-center cursor-pointer bg-white hover:border-[#10b481] hover:bg-[#10b481]/5 transition-all"
                    >
                      <div
                        v-if="!filePreview"
                        class="flex flex-col items-center justify-center w-full h-full"
                      >
                        <i class="bx bx-upload text-6xl mb-3 text-gray-400"></i>
                        <span class="label mb-2">
                          Cliquez pour téléverser un fichier (image ou PDF)
                        </span>
                      </div>

                      <div
                        v-else
                        class="flex items-center justify-between gap-4 ] rounded-xl p-3 w-full"
                      >
                        <div class="flex items-center gap-3 min-w-0">
                          <!-- Aperçu si image -->
                          <img
                            v-if="isImage"
                            :src="filePreview"
                            class="w-12 h-12 object-cover rounded-lg shadow-sm"
                          />
                          <!-- Icône PDF si PDF -->
                          <i
                            v-else
                            class="bx bx-file text-4xl text-gray-400"
                          ></i>

                          <div class="flex flex-col min-w-0 text-left">
                            <span class="label truncate">
                              Fichier sélectionné
                            </span>
                            <span class="text-xs text-gray-400 truncate">
                              {{ selectedFileName }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <input
                      ref="fileInput"
                      type="file"
                      accept="image/*,.pdf"
                      @change="handleFileUpload"
                      class="hidden"
                    />
                  </div>
                </div>

                <div class="pt-6 border-t border-[#112830]/10">
                  <div class="flex items-start gap-3 small">
                    <input
                      type="checkbox"
                      v-model="acceptTerms"
                      class="mt-1 accent-[#10b481] w-4 h-4 rounded-lg focus:ring-0 cursor-pointer"
                    />
                    <p class="text-sm text-[#112830]/60 leading-relaxed">
                      En créant un compte, vous acceptez nos
                      <span
                        class="text-[#10b481] font-medium hover:underline cursor-pointer"
                      >
                        Conditions générales </span
                      >.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-20 text-center">
              <button
                type="submit"
                :disabled="!acceptTerms"
                class="px-14 py-4 btn-primary w-full active:scale-[0.98] transition-all duration-200 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Créer mon compte
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- RIGHT: FIXED PANEL -->

    <div
      class="hidden lg:flex w-2/5 h-screen sticky top-0 bg-[#fff] rounded-l-[2rem] text-white flex-col justify-center p-12 overflow-hidden relative"
    >
      <!-- Flare organiques -->
      <div
        class="absolute -top-24 -left-32 w-[500px] h-[500px] sm:bg-blue-500 opacity-30 rounded-[60%_40%_55%_45%/50%_60%_40%_50%] blur-3xl"
      ></div>

      <div
        class="absolute top-40 -right-48 w-[400px] h-[600px] sm:bg-blue-400 opacity-30 rounded-[60%_40%_55%_45%/50%_60%_40%_50%] blur-3xl"
      ></div>

      <div
        class="absolute -top-48 right-[-100px] w-[800px] h-[400px] sm:bg-[#10b481] opacity-30 rounded-[60%_40%_55%_45%/50%_60%_40%_50%] blur-3xl"
      ></div>

      <div
        class="absolute -bottom-48 right-[-100px] w-[800px] h-[400px] sm:bg-[#10b481] opacity-40 rounded-[60%_40%_55%_45%/50%_60%_40%_50%] blur-3xl"
      ></div>

      <div
        class="relative z-50 flex flex-col justify-center h-full gap-y-8 px-4 sm:px-0"
      >
        <div class="flex flex-col justify-center gap-2">
          <h2 class="leading-snug text-2xl font-bold">
            Bienvenue sur SmartSaha
          </h2>
          <p class="text-gray-700 small text-sm max-w-xs">
            Marketplace agricole, sécurisez vos ventes et connectez-vous aux
            meilleurs clients.
          </p>
        </div>
        <div class="flex flex-col sm:flex-row items-center gap-1 self-start">
          <p class="text-sm small text-[#112830] text-center sm:text-left">
            Déjà un compte ?
          </p>
          <NuxtLink
            to="/signin"
            class="text-[#10b481] small text-sm font-medium underline cursor-pointer transition hover:bg-gray-100/10"
          >
            Se connecter
          </NuxtLink>
        </div>
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

        <div
          class="rounded-lg bg-gray-50 border px-4 py-2.5 text-sm text-gray-700"
        >
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

  <!-- STRIPE MODAL -->
  <div
    v-if="showStripeModal"
    class="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md px-6"
  >
    <div
      class="w-full max-w-4xl bg-white rounded-3xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25)] overflow-hidden grid md:grid-cols-[1fr_1.3fr]"
    >
      <!-- LEFT PANEL -->
      <div
        class="relative bg-[#fff] text-white p-12 flex flex-col justify-between overflow-hidden"
      >
        <!-- Flare organiques -->
        <div
          class="absolute -top-32 -left-32 w-[500px] h-[500px] sm:bg-blue-500 opacity-30 rounded-[60%_40%_55%_45%/50%_60%_40%_50%] blur-3xl"
        ></div>

        <div
          class="absolute top-48 -right-64 w-[400px] h-[600px] sm:bg-blue-400 opacity-30 rounded-[60%_40%_55%_45%/50%_60%_40%_50%] blur-3xl"
        ></div>

        <div
          class="absolute -top-64 right-[-100px] w-[800px] h-[400px] sm:bg-[#10b481] opacity-30 rounded-[60%_40%_55%_45%/50%_60%_40%_50%] blur-3xl"
        ></div>

        <div
          class="absolute -bottom-64 right-[-100px] w-[800px] h-[400px] sm:bg-[#10b481] opacity-40 rounded-[60%_40%_55%_45%/50%_60%_40%_50%] blur-3xl"
        ></div>
        <div class="z-50">
          <div
            class="w-12 h-12 rounded-xl bg-[#112830]/20 flex items-center justify-center mb-8"
          >
            <i class="bx bx-credit-card text-3xl text-[#112830]"></i>
          </div>

          <h2 class="leading-snug">Activation des paiements</h2>

          <p class="mt-5 content leading-relaxed">
            Pour pouvoir publier des offres et recevoir des paiements en toute
            sécurité sur la plateforme, la configuration Stripe est une étape
            obligatoire.
          </p>

          <div class="mt-8 space-y-3 content">
            <div class="flex items-start gap-2">
              <span>•</span>
              <span>Vérification d’identité</span>
            </div>
            <div class="flex items-start gap-2">
              <span>•</span>
              <span>Ajout d’un compte bancaire</span>
            </div>
            <div class="flex items-start gap-2">
              <span>•</span>
              <span>Activation des transferts sécurisés</span>
            </div>
          </div>
        </div>

        <div class="text-xs text-gray-700 small mt-12">
          Traitement sécurisé via Stripe · Conforme aux standards internationaux
        </div>
      </div>

      <!-- RIGHT PANEL -->
      <div class="p-12 flex flex-col justify-between">
        <div class="space-y-8">
          <div>
            <h4 class="text-lg username text-gray-900">
              Prochaine étape : configuration Stripe
            </h4>

            <p class="mt-3 content leading-relaxed">
              Vous allez être redirigé vers l’interface officielle de Stripe.
              Cette procédure vous permettra de renseigner vos informations
              légales et bancaires afin d’activer les paiements.
            </p>
          </div>

          <div class="bg-gray-50 content rounded-xl p-5 content space-y-2">
            <p class="font-medium text-gray-800">Informations importantes :</p>
            <p>• Temps estimé : 2 à 3 minutes</p>
            <p>• Aucune donnée bancaire n’est stockée sur SmartSaha</p>
            <p>
              • Vous pourrez compléter cette étape ultérieurement si nécessaire
            </p>
          </div>
        </div>

        <!-- ACTIONS -->
        <div
          class="mt-12 flex justify-between items-center text-sm font-medium"
        >
          <button
            @click="router.push('/signin')"
            class="text-gray-700 hover:text-gray-700 small transition hover:underline underline-offset-4"
          >
            Finaliser plus tard
          </button>

          <button
            @click="redirectToStripe"
            class="text-[#10b481] hover:text-[#10b481] small transition hover:underline underline-offset-4 flex items-center gap-1"
          >
            Continuer la configuration →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { API_URL } from "~/utils/config";

const router = useRouter();

const form = ref({
  email: "",
  justification: "",
  avatar_url: "",
  username: "",
  password: "",
});

const avatarFile = ref<File | null>(null);
const avatarUrl = ref("");
const avatarFileName = ref("");

const showPendingScreen = ref(false);
const showStripeModal = ref(false);

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

const filePreview = ref(null);
const isImage = ref(false);

// const handleFileUpload = (e) => {
//   const file = e.target.files[0];
//   if (!file) return;

//   selectedFileName.value = file.name;

//   // Preview seulement si image
//   if (file.type.startsWith("image/")) {
//     isImage.value = true;
//     filePreview.value = URL.createObjectURL(file);
//   } else {
//     isImage.value = false;
//     filePreview.value = null; // pas de preview pour PDF
//   }
// };

const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files || !input.files[0]) return;

  const file = input.files[0];
  const sizeMB = file.size / 1024 / 1024;

  selectedFileName.value = file.name;

  if (file.type.startsWith("image/")) {
    isImage.value = true;
    filePreview.value = URL.createObjectURL(file);
  } else {
    isImage.value = false;
    filePreview.value = null;
  }

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

const fileInput = ref(null);
const avatarPreview = ref(null);

const triggerFile = () => {
  fileInput.value.click();
};

const handleAvatarUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files || !input.files[0]) return;

  const file = input.files[0];
  avatarFile.value = file;
  avatarFileName.value = file.name;
  avatarPreview.value = URL.createObjectURL(file);

  avatarUrl.value = await uploadToCloudinary(file);
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
      avatar_url: avatarUrl.value || null,
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

    console.log(
      "Stripe url:",
      JSON.stringify(stripeOnboardingUrl.value, null, 2)
    );

    showNotification(
      "Inscription réussie. Votre compte est en attente de validation.",
      "success",
      6000
    );

    if (data.stripe_onboarding_url) {
      stripeOnboardingUrl.value = data.stripe_onboarding_url;
      showStripeModal.value = true;
    }

    // setTimeout(() => router.push("/signin"), 6000);
  } catch {
    showNotification("Erreur serveur. Réessayez plus tard.", "error");
  } finally {
    isLoading.value = false;
  }
};

const redirectToStripe = () => {
  if (process.client && stripeOnboardingUrl.value) {
    window.location.href = stripeOnboardingUrl.value;
  }
};
</script>
