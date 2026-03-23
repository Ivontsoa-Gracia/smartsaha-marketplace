<template>
  <div class="flex items-center justify-center px-4 py-10">
    <div class="w-full max-w-2xl bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-8">
      <div class="text-left space-y-2">
        <h2 class="">Paiement sécurisé</h2>
        <p class="content">Vérifiez les informations avant de confirmer</p>
      </div>
      <div
        class="rounded-2xl p-4 border border-gray-200"
      >
      <p class="text-xs small uppercase tracking-wide text-gray-400 mb-4">
              Bénéficiaire
            </p>
            <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <img
            v-if="receiver?.avatar_url"
            :src="receiver?.avatar_url"
            alt="avatar"
            class="w-10 h-10 rounded-full object-cover"
          />

          <div
            v-else
            class="w-12 h-12 bg-[#10b481] text-white rounded-full flex items-center username justify-center font-bold text-xl"
          >
            {{ receiver?.username.charAt(0).toUpperCase() }}
          </div>

          <div class="leading-tight">

            <p class="text-sm username text-gray-700">
              {{ receiver?.username }}
            </p>
            <p class="text-xs small text-gray-500">
              {{ receiver?.email }}
            </p>
          </div>
        </div>
        </div>

        <!-- <i class="bx bx-shield-quarter text-2xl text-[#10b481]"></i> -->
      </div>

      <!-- INVOICE -->
      <div class="rounded-2xl border border-gray-200 p-6 space-y-3">
        <p class="text-xs uppercase small tracking-wider text-gray-400">
          Invoice
        </p>

        <h2 class="">
          {{ Number(bid?.price).toLocaleString() }} {{ bid?.currency.symbol }}
        </h2>

        <p class="content">
          Pour l'annonce :
          <span class="small-medium">
            {{ bid?.post.title }}
          </span>
        </p>
      </div>
      <!-- PAYMENT METHODS -->
      <div v-if="!paymentIntentClientSecret" class="space-y-6">
        <div class="space-y-3">
          <p class="subtitle">Méthode de paiement</p>

          <div class="grid grid-cols-2 gap-4">
            <!-- CARD -->
            <div
              @click="selectedMethod = 'card'"
              :class="[
                'cursor-pointer p-5 rounded-2xl border transition-all duration-200',
                selectedMethod === 'card'
                  ? 'border-[#10b481] shadow-md ring-2 ring-[#10b481]/20'
                  : 'border-gray-200 hover:shadow-md',
              ]"
            >
              <i class="bx bxl-visa text-3xl text-[#1a1f71]"></i>
              <p class="label mt-3 text-sm">Carte bancaire</p>
              <p class="text-xs small text-gray-500 mt-1">
                Paiement sécurisé par carte
              </p>
            </div>

            <!-- BANK -->
            <div
              @click="selectedMethod = 'bank_transfer'"
              :class="[
                'cursor-pointer p-5 rounded-2xl border transition-all duration-200',
                selectedMethod === 'bank_transfer'
                  ? 'border-[#10b481] shadow-md ring-2 ring-[#10b481]/20'
                  : 'border-gray-200 hover:shadow-md',
              ]"
            >
              <i class="bx bx-bank text-3xl text-gray-700"></i>
              <p class="label mt-3 text-sm">Virement bancaire</p>
              <p class="text-xs small text-gray-500 mt-1">Transfert sécurisé</p>
            </div>
          </div>
        </div>

        <!-- PAY BUTTON -->
        <button
          @click="initiatePayment(selectedMethod)"
          :disabled="!selectedMethod"
          class="w-full bg-[#10b481] text-white py-3 rounded-2xl font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#10b481]"
        >
          Payer maintenant
        </button>
      </div>

      <!-- STRIPE FORM -->
      <div v-else class="space-y-4">
        <label class="text-sm font-medium text-gray-700">
          Informations de carte
        </label>

        <div id="card-element" class="border rounded-xl p-4"></div>

        <button
          @click="handleCardPayment"
          class="w-full bg-[#10b481] text-white py-3 rounded-2xl font-semibold hover:bg-[#10b481] transition"
        >
          Confirmer le paiement
        </button>
      </div>

      <!-- STATUS MESSAGE -->
      <div v-if="paymentStatus" class="text-center">
        <p
          class="text-sm font-medium"
          :class="paymentStatus.success ? 'text-[#10b481]' : 'text-red-500'"
        >
          {{ paymentStatus.message }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: "dashboard" });
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { loadStripe } from "@stripe/stripe-js"; // npm install @stripe/stripe-js
import { API_URL, STRIPE_PUBLISHABLE_KEY } from "~/utils/config";

const route = useRoute();
const router = useRouter();
const bidId = route.query.bidId;
const selectedMethod = ref(null);

const bid = ref(null);
const paymentIntentClientSecret = ref(null);
const paymentId = ref(null);
const paymentStatus = ref(null);
let stripe = null;
let cardElement = null;

const notification = ref({ visible: false, message: "", type: "success" });

const showNotification = (message, type = "success", duration = 3000) => {
  notification.value = { visible: true, message, type };
  setTimeout(() => (notification.value.visible = false), duration);
};

async function loadBid() {
  const token = localStorage.getItem("access_token");

  try {
    // 1️⃣ Charger le bid
    const res = await fetch(`${API_URL}/api/bids/${bidId}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Enchère non trouvée");

    bid.value = await res.json();
    console.log("Bid loaded:", JSON.stringify(bid.value, null, 2));

    // 2️⃣ Charger le post avec bid.post.id
    if (bid.value?.post?.id) {
      const postRes = await fetch(
        `${API_URL}/api/posts/${bid.value.post.id}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!postRes.ok) throw new Error("Post non trouvé");

      const postData = await postRes.json();

      // 3️⃣ Injecter les détails dans bid.post_details
      bid.value.post_details = postData;

      console.log("Post details loaded:", postData);
    }

    // Après avoir chargé bid + post_details

    if (bid.value?.post_details) {
      const postType = bid.value.post_details.type_post.type; // "buying" ou "selling"

      if (postType === "Buying") {
        // 🟢 On paie le propriétaire du bid accepté
        receiver.value = bid.value.user;
      } else if (postType === "Selling") {
        // 🔵 On paie le propriétaire du post
        receiver.value = bid.value.post_details.user;
      }

      // 🔐 Sécurité : empêcher de se payer soi-même
      if (receiver.value && receiver.value.id === userId) {
        paymentStatus.value = {
          success: false,
          message: "Vous ne pouvez pas vous payer vous-même.",
        };
      }
    }
    console.log("Receiver:", JSON.stringify(receiver.value, null, 2));
  } catch (err) {
    console.error(err);
    paymentStatus.value = {
      success: false,
      message: "Impossible de charger l'enchère.",
    };
  }
}

async function initiatePayment() {
  const token = localStorage.getItem("access_token");

  try {
    const payload = {
      bid_id: bid.value.id,
      payment_method: "card",
    };

    const res = await fetch(`${API_URL}/payments/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok)
      throw new Error(data.message || "Erreur lors de la création du paiement");

    paymentIntentClientSecret.value = data.client_secret;
    paymentId.value = data.payment_id;

    // Initialiser Stripe et Elements
    stripe = await loadStripe(STRIPE_PUBLISHABLE_KEY);
    const elements = stripe.elements();
    cardElement = elements.create("card");
    cardElement.mount("#card-element");
  } catch (err) {
    paymentStatus.value = { success: false, message: err.message };
  }
}

async function handleCardPayment() {
  if (!stripe || !cardElement) return;

  const { error, paymentIntent } = await stripe.confirmCardPayment(
    paymentIntentClientSecret.value,
    { payment_method: { card: cardElement } }
  );

  if (error) {
    paymentStatus.value = { success: false, message: error.message };
    return;
  }

  // Si Stripe autorise le paiement
  if (
    paymentIntent.status === "requires_capture" ||
    paymentIntent.status === "succeeded"
  ) {
    try {
      const token = localStorage.getItem("access_token");

      const res = await fetch(
        `${API_URL}/payments/${paymentId.value}/secure/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Impossible de sécuriser le paiement côté serveur.");
      }

      const data = await res.json();
      paymentStatus.value = {
        success: true,
        message: "Paiement effectué ! Fonds sécurisés (escrow).",
      };

      // Tu peux mettre à jour ton objet bid/payment local si besoin
      bid.value.status = data.status;
    } catch (err) {
      paymentStatus.value = { success: false, message: err.message };
    }
  }
}

const user = ref(null);
let userId = null;
const receiver = ref(null); // 👈 la personne qui reçoit l’argent

async function checkUser() {
  const token = localStorage.getItem("access_token");
  if (!token) return;

  try {
    const res = await fetch(`${API_URL}/api/me/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Unauthorized");

    const data = await res.json();
    userId = data.id;
    user.value = data;
  } catch {}
}

onMounted(loadBid);
</script>
