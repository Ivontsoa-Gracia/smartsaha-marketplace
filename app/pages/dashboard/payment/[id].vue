<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <div class="bg-white shadow rounded p-6 w-full max-w-md">
      <h1 class="text-2xl font-bold mb-4">Paiement</h1>

      <p class="mb-2">
        Montant à payer : <span class="font-semibold">{{ bid?.price }} {{ bid?.currency.iso_code }}</span>
      </p>
      <p class="mb-4">Pour le post : {{ bid?.post.title }}</p>

      <form @submit.prevent="handlePayment" class="flex flex-col gap-4">
        <label>
          Méthode de paiement
          <select v-model="payment_method" class="border p-2 rounded w-full" required>
            <option value="">-- Choisir --</option>
            <option value="MVOLA">MVola</option>
            <option value="ORANGE_MONEY">Orange Money</option>
            <option value="AIRTEL_MONEY">Airtel Money</option>
          </select>
        </label>

        <label>
          Numéro de téléphone
          <input type="text" v-model="payment_number" class="border p-2 rounded w-full" required />
        </label>

        <label>
          Référence de transaction
          <input type="text" v-model="transaction_reference" class="border p-2 rounded w-full" required />
        </label>

        <button type="submit" class="bg-[#10b481] text-white py-2 rounded font-semibold">
          Payer maintenant
        </button>
      </form>

      <p
        v-if="paymentStatus"
        class="mt-4 text-center"
        :class="paymentStatus.success ? 'text-green-600' : 'text-red-600'"
      >
        {{ paymentStatus.message }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { API_URL } from "~/utils/config";

const route = useRoute();
const router = useRouter();

const bidId = route.query.bidId;

const bid = ref(null);

const payment_method = ref("");
const payment_number = ref("");
const transaction_reference = ref("");
const paymentStatus = ref(null);



async function loadBid() {
  const token = localStorage.getItem("access_token");
  try {
    const res = await fetch(`${API_URL}/api/bids/${bidId}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Bid not found");
    bid.value = await res.json();
  } catch (err) {
    console.error(err);
    paymentStatus.value = { success: false, message: "Impossible de charger l'enchère." };
  }
}

async function handlePayment() {
  const token = localStorage.getItem("access_token");
  try {
    if (!bid.value) throw new Error("Enchère non chargée.");

    const res = await fetch(`${API_URL}/payments/verify/`, {

      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        post: bid.value.post.id,
        bid: bid.value.id,
        payment_method: payment_method.value,
        payment_number: payment_number.value,
        transaction_reference: transaction_reference.value,
      }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Paiement échoué");

    paymentStatus.value = { success: true, message: "Paiement réussi !" };
    setTimeout(() => router.push("/dashboard"), 2000);
  } catch (err) {
    paymentStatus.value = { success: false, message: err.message };
  }
}

onMounted(loadBid);
</script>
