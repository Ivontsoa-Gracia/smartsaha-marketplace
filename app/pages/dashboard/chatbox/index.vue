<template>
  <div class="flex flex-col h-screen">
    <header
        :class="[
          'flex items-center justify-between bg-gray-50 px-4 sm:px-12 py-4 sm:py-7 transition-shadow duration-200',
          isScrolled ? 'shadow' : '',
        ]"
      >
        <button class="md:hidden text-gray-700" @click="isMobileOpen = true">
          <i class="bx bx-menu text-2xl"></i>
        </button>

        <h2 class="text-lg font-semibold text-gray-800 hidden sm:flex">
          <Breadcrumb />
        </h2>

        <div class="flex items-center gap-5">
        
          <button
            @click="goToNotif"
            class="relative w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-[#10b481]/30"
          >
            <i class="bx bx-bell text-xl text-gray-700"></i>

            <span
              v-if="unreadNotifCount > 0"
              class="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-1 flex items-center justify-center text-[10px] font-semibold bg-red-600 text-white rounded-full shadow"
            >
              {{ unreadNotifCount > 9 ? "9+" : unreadNotifCount }}
            </span>
          </button>

          <div class="flex items-center gap-3">
            <img
              v-if="user?.avatar_url"
              :src="user?.avatar_url"
              alt="avatar"
              class="w-8 sm:w-10 h-8 sm:h-10 rounded-full object-cover ring-2 ring-[#10B481]/50"
            />

            <div
              v-else
              class="w-8 sm:w-10 h-8 sm:h-10 bg-[#10b481] text-white rounded-full flex items-center justify-center font-bold text-lg ring-2 ring-[#10B481]/50"
            >
              {{ user?.username.charAt(0).toUpperCase() }}
            </div>
          </div>
        </div>
      </header>

    <div class="flex flex-1 overflow-hidden">
      <aside
        class="w-80 sm:w-72 md:w-80 p-4 border-r border-gray-100 bg-[#112830] overflow-y-auto no-scrollbar"
      >
        <button
          @click="$router.back()"
          class="flex items-center gap-1 text-gray-100/60 transition"
        >
          <i class="bxr bx-chevron-left text-xl"></i>
          {{ t("back") }}
        </button>

        <h2 class="p-4 text-lg font-semibold text-gray-100">
          {{ t("chats") }}
        </h2>

        <div
          class="px-4 mb-6 flex items-center gap-2 relative bg-[#1f3945] rounded-lg"
        >
          <i class="bx bx-search text-gray-400 text-lg"></i>

          <input
            v-model="searchQuery"
            placeholder="Search user..."
            class="w-full py-2 bg-transparent text-gray-200 placeholder-gray-400 outline-none"
          />
        </div>

        <div v-if="loadingChats" class="p-4 text-gray-400">
          <div
            class="w-8 h-8 border-4 border-gray-300 border-t-[#10b481] rounded-full animate-spin"
          ></div>
        </div>

        <div
          v-for="chat in filteredChats"
          :key="chat.id"
          @click="selectChat(chat)"
          class="group relative flex items-center gap-3 px-4 py-3 mb-1 rounded-lg cursor-pointer transition-all"
          :class="[
            selectedChat?.id === chat.id
              ? 'bg-white/10 ring-1 ring-[#10b481]/30'
              : getUnreadCount(chat) > 0
              ? 'bg-white/5 hover:bg-white/10'
              : 'hover:bg-white/5',
          ]"
        >
          <span
            v-if="selectedChat?.id === chat.id"
            class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r bg-[#10b481]"
          ></span>

          <!-- Avatar image si existant -->
          <img
            v-if="getAvatar(chat)"
            :src="getAvatar(chat)"
            alt="avatar"
            class="relative w-10 h-10 rounded-full shrink-0 cursor-pointer shadow object-cover"
          />

          <!-- Sinon initiale avec couleur -->
          <div
            v-else
            class="relative w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0 cursor-pointer shadow"
            :class="getAvatarColor(getOtherUsername(chat))"
          >
            {{ getOtherUsername(chat).charAt(0).toUpperCase() }}
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-center">
              <p
                class="truncate"
                :class="
                  getUnreadCount(chat) > 0
                    ? 'font-semibold text-white'
                    : 'text-gray-200 font-medium'
                "
              >
                {{ getOtherUsername(chat) }}
              </p>

              <span class="text-xs text-gray-400 shrink-0">
                {{ formatTime(getLastMessageDate(chat)) }}
              </span>
            </div>

            <div class="flex justify-between items-center gap-2">
              <p
                class="text-xs truncate flex-1"
                :class="
                  getUnreadCount(chat) > 0
                    ? 'text-gray-100 font-medium'
                    : 'text-gray-400'
                "
              >
                {{ truncate(getLastMessage(chat), 28) || "No message yet" }}
              </p>

              <span
                v-if="getUnreadCount(chat) > 0"
                class="min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-semibold bg-[#10b481] text-white rounded-full shadow"
              >
                {{ getUnreadCount(chat) }}
              </span>
            </div>
          </div>
        </div>
      </aside>

      <section class="flex-1 flex flex-col bg-[#fff] overflow-hidden">
        <div
          v-if="selectedChat"
          class="flex items-center justify-between gap-3 px-4 py-4 border-b border-gray-200 sticky top-0 bg-white z-10"
        >
          <div class="flex items-center gap-3">
            <!-- <div
              class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
              :class="getAvatarColor(getOtherUsername(selectedChat))"
            >
              {{ getOtherUsername(selectedChat).charAt(0).toUpperCase() }}
            </div> -->

            <img
              v-if="getAvatar(selectedChat)"
              :src="getAvatar(selectedChat)"
              alt="avatar"
              class="w-10 h-10 rounded-full cursor-pointer shadow object-cover"
            />

            <div
              v-else
              class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg cursor-pointer shadow"
              :class="getAvatarColor(getOtherUsername(selectedChat))"
            >
              {{ getOtherUsername(selectedChat).charAt(0).toUpperCase() }}
            </div>

            <div class="flex flex-col">
              <p class="text-gray-800 font-semibold text-sm">
                {{ getOtherUsername(selectedChat) }}
              </p>
              <p class="text-gray-500 text-xs">
                {{ getOtherUserEmail(selectedChat) }}
              </p>
            </div>
          </div>

          <div class="relative">
            <button @click="toggleChatMenu">
              <i class="bx bx-dots-vertical-rounded text-xl"></i>
            </button>

            <div
              v-if="chatMenuOpen"
              class="absolute right-0 mt-2 w-40 bg-white border rounded z-20"
            >
              <button
                @click="
                  confirmDelete(selectedChat);
                  chatMenuOpen = false;
                "
                class="w-full text-left px-4 py-2 text-red-600"
              >
                {{ t("deleteChat") }}
              </button>
            </div>
          </div>

          <div
            v-if="confirmDeleteOpen"
            class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30"
          >
            <div class="bg-white rounded p-6 w-96">
              <h3 class="text-lg font-semibold mb-4">
                {{ t("confirmDelete") }}
              </h3>
              <p class="mb-6">
                {{ t("confirmDelText") }}
              </p>
              <div class="flex justify-end gap-3">
                <button
                  @click="cancelDelete"
                  class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  {{ t("cancel") }}
                </button>
                <button
                  @click="performDelete"
                  class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  {{ t("delete") }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="acceptedBidNotification"
          class="sticky top-0 z-20 flex items-center justify-between gap-4 px-4 py-4 bg-white border-b border-gray-100 shadow-sm"
        >
          <div class="flex items-start gap-4">
            <div
              class="w-10 h-10 rounded-full bg-[#10b481]/10 flex items-center justify-center shrink-0"
            >
              <i class="bx bx-check text-[#10b481] text-xl font-bold"></i>
            </div>

            <div>
              <p class="text-gray-900 font-semibold text-sm">
                {{ t("acceptedBid") }}
              </p>

              <p class="text-gray-500 text-xs mt-1">
                {{ t("bidOf") }}
                <span class="font-medium text-gray-900">
                  {{ acceptedBidNotification.price }}
                  {{ acceptedBidNotification.currency_symbol }}
                </span>
                {{ t("acceptedAt") }}
                {{ formatDateTime(acceptedBidNotification.created_at) }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <button
              v-if="isPayer(post, acceptedBidNotification, userId)"
              @click="goToTransaction(acceptedBidNotification)"
              class="bg-[#10b481] text-white text-sm px-4 py-2 rounded font-medium transition hover:opacity-90"
            >
              Passer à l’étape suivante
            </button>

            <button
              @click="acceptedBidNotification = null"
              class="text-gray-400 hover:text-gray-600 transition"
              aria-label="Fermer notification"
            >
              <i class="bx bx-x text-xl"></i>
            </button>
          </div>
        </div>

        <div
          v-if="!selectedChat"
          class="flex-1 flex items-center justify-center text-gray-400"
        ></div>

        <div
          v-else
          class="flex-1 overflow-y-auto flex flex-col gap-3 no-scrollbar"
        >
          <div
            v-for="item in sortedChatItems"
            :key="item.id + '-' + item.type"
            :class="item.user.id === userId ? 'self-end' : 'self-start'"
            class="max-w-xs rounded-xl px-4 py-2 text-sm"
          >
            <template v-if="item.type === 'message'">
              <div
                :class="item.user.id === userId ? 'self-end' : 'self-start'"
                class="max-w-xs rounded-xl px-4 py-2 text-sm shadow-lg"
                :style="
                  item.user.id === userId
                    ? 'background:#10b481;color:white;border-bottom-right-radius:0;'
                    : 'background:#f9f9f9;border:1px solid #e5e5e5;border-bottom-left-radius:0;'
                "
              >
                <p class="break-words">{{ item.message }}</p>
                <span class="text-xs mt-1">{{
                  formatDate(item.created_at)
                }}</span>
              </div>
            </template>

            <template v-else-if="item.type === 'bid'">
              <div
                class="w-72 mb-4 self-start bg-[#f9f9f9] border border-gray-200 rounded-xl text-sm shadow-lg"
              >
                <div class="px-4 py-3 border-b border-dashed border-gray-300">
                  <div class="flex justify-between items-center">
                    <span
                      class="text-gray-500 uppercase text-xs tracking-widest"
                    >
                      Proposition
                    </span>
                    <span
                      class="text-xs font-semibold"
                      :class="{
                        'text-[#10b481]':
                          isPropose(item) || isAccept(item) || isPaied(item),
                        'text-gray-400': isAnnule(item),
                        'text-red-600': isArreteOrRefuse(item),
                      }"
                    >
                      {{
                        isPropose(item)
                          ? "ACTIVE"
                          : isAccept(item)
                          ? "ACCEPTÉE"
                          : isPaied(item)
                          ? "PAYÉE"
                          : isAnnule(item)
                          ? "ANNULÉE"
                          : "REFUSÉE"
                      }}
                    </span>
                  </div>
                </div>

                <div class="px-4 py-4 space-y-3">
                  <div class="flex justify-between">
                    <span class="text-gray-500">Utilisateur</span>
                    <span class="font-medium text-gray-900">
                      {{ item.user.username }}
                    </span>
                  </div>

                  <div class="flex justify-between">
                    <span class="text-gray-500">Date</span>
                    <span class="text-gray-900">
                      {{ formatDate(item.created_at) }}
                    </span>
                  </div>

                  <div
                    class="border-t border-dashed border-gray-300 my-3"
                  ></div>

                  <div class="flex justify-between items-center">
                    <span
                      class="uppercase text-xs tracking-widest text-gray-500"
                    >
                      Montant
                    </span>
                    <span class="text-lg font-bold text-gray-900">
                      {{ item.price }} {{ item.currency.symbol }}
                    </span>
                  </div>
                </div>

                <div
                  v-if="post?.user.id === userId && isPropose(item)"
                  class="px-4 py-4 border-t border-dashed border-gray-300 flex justify-between gap-3"
                >
                  <button
                    @click="openBidConfirmation(item, 'decline')"
                    class="flex-1 text-gray-400 tracking-wider text-sm hover:text-gray-700"
                  >
                    {{ t("decline") }}
                  </button>
                  <button
                    @click="openBidConfirmation(item, 'accept')"
                    class="flex-1 bg-[#10b481] text-white px-5 py-2 rounded font-semibold tracking-wider text-sm"
                  >
                    {{ t("accepted") }}
                  </button>
                </div>
              </div>
            </template>
          </div>
        </div>

        <div
          v-if="selectedChat"
          class="p-4 border-t border-[#f1f1f1] bg-[#fff] flex gap-2"
        >
          <button
            v-if="
              post?.current_status !== 'vendu' &&
              post?.user?.id !== userId &&
              !hasStoppedOrCancelledBid
            "
            @click="openCreateBidModal"
            class="w-12 h-full flex items-center justify-center rounded-lg border border-gray-200 px-3 py-2 bg-gray-100 outline-none"
          >
            <i class="bx bx-plus text-xl text-gray-600"></i>
          </button>

          <div
            class="flex flex-1 items-center gap-3 rounded-lg border border-gray-200 px-3 py-2 bg-gray-100 relative"
          >
            <button
              @click="showEmojiPicker = !showEmojiPicker"
              class="items-center justify-center outline-none"
            >
              <i class="bxr bx-smile text-lg text-gray-500"></i>
            </button>

            <emoji-picker
              v-if="showEmojiPicker"
              @emoji-click="addEmoji"
              class="absolute bottom-20 left-84 z-50 rounded-lg shadow-lg"
              style="width: 300px; height: 250px"
              theme="light"
            ></emoji-picker>

            <input
              v-model="newMessage"
              @keyup.enter="sendMessage"
              placeholder="Write a message..."
              class="flex-1 bg-transparent outline-none"
            />
          </div>

          <button
            @click="sendMessage"
            class="bg-[#10b481] text-white px-3 py-2 rounded-lg font-semibold flex items-center justify-center"
          >
            <i class="bx bx-send-alt text-xl"></i>
          </button>
        </div>
      </section>

      <aside
        v-if="post"
        class="hidden lg:flex w-96 border-l border-[#f1f1f1] bg-[#fff] p-4 overflow-y-auto"
      >
        <div class="rounded border border-white/5 overflow-hidden">
          <div class="relative w-full rounded-2xl overflow-hidden shadow-sm">
            <img
              v-if="post.image_url"
              :src="post.image_url"
              class="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
              alt="Post image"
            />
            <div
              v-else
              class="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 font-medium"
            >
              No image
            </div>

            <div
              class="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs text-gray-700 shadow z-10"
            >
              <i class="bx bx-time"></i>
              <span>{{ t("publishedOn") }} {{ getPublishedDate() }}</span>
            </div>

            <div class="absolute bottom-3 left-3 flex flex-wrap gap-2">
              <span
                class="px-3 py-1 text-xs font-medium rounded-full text-gray-700 bg-white/90 shadow z-10"
              >
                {{ post.type_post?.type || "Type inconnu" }}
              </span>

              <div
                class="flex items-center gap-1 px-3 py-1 text-xs text-gray-700 font-medium rounded-full bg-white/90 shadow z-10"
              >
                <i class="bx bx-location-plus"></i>
                <span>{{ post.location || "Localisation inconnue" }}</span>
              </div>
            </div>
          </div>

          <div class="p-4 flex flex-col gap-2">
            <h3 class="text-2xl font-bold text-gray-700">
              {{ post?.title }}
            </h3>
            <p class="text-gray-600 text-sm leading-relaxed">
              {{ post?.description }}
            </p>

            <div class="flex flex-wrap gap-3 pt-3">
              <div
                class="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded p-2 text-sm"
              >
                <i class="bx bx-package text-gray-500"></i>
                <span class="text-gray-800">
                  {{ post?.product?.product }}
                </span>
              </div>

              <div
                class="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded p-2 text-sm"
              >
                <i class="bx bx-package text-gray-500"></i>
                <span class="text-gray-800">
                  {{ post?.quantity }}
                  {{ post?.product?.unit?.abbreviation }}
                </span>
              </div>

              <div
                class="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded p-2 text-sm"
              >
                <i class="bx bx-wallet text-gray-500"></i>
                <span class="text-gray-800">
                  {{ post?.price }}
                  {{ post?.currency?.symbol }}
                </span>
              </div>
            </div>
            <div class="flex flex-wrap gap-2 pt-3">
              <span
                v-for="label in post?.labels"
                :key="label.id"
                :style="{
                  backgroundColor: `${label.color}20`,
                  borderColor: label.color,
                  color: label.color,
                }"
                class="px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap"
              >
                {{ label.name }}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>

  <!-- Popup confirmation accept/decline -->
  <div
    v-if="confirmBidOpen"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30"
  >
    <div class="bg-white rounded p-6 w-96">
      <h3 class="text-lg font-semibold mb-4">
        {{
          bidAction === "accept"
            ? "Confirmer l’acceptation"
            : "Confirmer le refus"
        }}
      </h3>
      <p v-if="!showNegotiateChoice" class="mb-4">
        {{
          bidAction === "accept"
            ? "Voulez-vous vraiment accepter cette enchère ?"
            : "Voulez-vous vraiment refuser cette enchère ? Cette action est irréversible."
        }}
      </p>

      <div v-if="showNegotiateChoice" class="mb-4">
        <p class="mb-2">Voulez-vous continuer la négociation ou l'arrêter ?</p>
        <div class="flex justify-end gap-3">
          <button
            @click="chooseContinueNegotiation"
            class="px-4 py-2 bg-[#10b481] text-white rounded"
          >
            Continuer
          </button>
          <button
            @click="chooseStopNegotiation"
            class="px-4 py-2 bg-red-600 text-white rounded"
          >
            Arrêter
          </button>
        </div>
      </div>

      <div v-if="showReasonInput" class="mb-4">
        <label class="block text-sm mb-1">Raison :</label>
        <textarea
          v-model="declineMessage"
          class="w-full border rounded p-2"
          rows="3"
        ></textarea>
      </div>

      <div class="flex justify-end gap-3">
        <button
          v-if="!showNegotiateChoice"
          @click="cancelBid"
          class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Annuler
        </button>

        <button
          v-if="bidAction === 'accept'"
          @click="performBidAction"
          class="px-4 py-2 bg-[#10b481] text-white rounded"
        >
          {{ t("btnaccept") }}
        </button>

        <button
          v-else-if="!showNegotiateChoice && !showReasonInput"
          @click="openNegotiateChoice"
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
        >
          {{ t("btndecline") }}
        </button>

        <button
          v-else-if="showReasonInput"
          @click="performBidAction"
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
        >
          Envoyer
        </button>
      </div>
    </div>
  </div>

  <div
    v-if="openBidModal"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30"
  >
    <div class="bg-white rounded p-6 w-96">
      <label class="block text-sm mb-1">{{ t("priceProposed") }} :</label>
      <input
        type="number"
        v-model="bidPrice"
        class="w-full border rounded p-2 mb-4"
        placeholder="Montant en Ariary"
      />

      <label class="block text-sm mb-1">{{ t("msg") }} :</label>
      <textarea
        v-model="bidMessage"
        class="w-full border rounded p-2 mb-4"
        rows="3"
        placeholder="Votre message..."
      ></textarea>

      <div class="flex justify-end gap-3">
        <button
          @click="openBidModal = false"
          class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          {{ t("cancel") }}
        </button>

        <button
          @click="submitBid"
          class="px-4 py-2 bg-[#10b481] text-white rounded"
        >
          {{ t("send") }}
        </button>
      </div>
    </div>
  </div>

  <div
    v-if="reviewPopupOpen"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div class="bg-white rounded p-6 w-96 max-w-full">
      <h3 class="text-lg font-semibold mb-4">Évaluez votre transaction</h3>

      <div class="flex gap-1 mb-4">
        <template v-for="i in 5" :key="i">
          <button
            @click="reviewRating = i"
            class="text-2xl"
            :class="i <= reviewRating ? 'text-yellow-400' : 'text-gray-300'"
          >
            <i class="bxr bxs-star"></i>
          </button>
        </template>
      </div>

      <label class="block text-sm mb-1">Commentaire :</label>
      <textarea
        v-model="reviewComment"
        class="w-full border rounded p-2 mb-4"
        rows="3"
        placeholder="Optionnel..."
      ></textarea>

      <div class="flex justify-end gap-3">
        <button
          @click="reviewPopupOpen = false"
          class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          {{ t("cancel") }}
        </button>
        <button
          @click="submitReview"
          class="px-4 py-2 bg-[#10b481] text-white rounded"
        >
          {{ t("send") }}
        </button>
      </div>
    </div>
  </div>

  <transition name="slide-right">
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
  </transition>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { API_URL } from "~/utils/config";
import { useRoute } from "vue-router";
import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";
import { useRouter } from "vue-router";
import { parseISO, formatDistanceToNow } from "date-fns";
import { fr, enUS } from "date-fns/locale";
const router = useRouter();

const languageStore = useLanguageStore();
const t = (key) => {
  const lang = languageStore.lang;
  return translate[lang][key] || key;
};

const notification = ref({ visible: false, message: "", type: "success" });

const showNotification = (message, type = "success", duration = 3000) => {
  notification.value = { visible: true, message, type };
  setTimeout(() => (notification.value.visible = false), duration);
};

const route = useRoute();

const chats = ref([]);
const messages = ref([]);
const post = ref(null);
const selectedChat = ref(null);
const newMessage = ref("");
const loadingChats = ref(true);
const unreadCount = ref(3);

let userId = null;
const user = ref(null);

const avatarColors = [
  "bg-red-200 text-red-700",
  "bg-orange-200 text-orange-700",
  "bg-amber-200 text-amber-700",
  "bg-lime-200 text-lime-700",
  "bg-green-200 text-green-700",
  "bg-teal-200 text-teal-700",
  "bg-cyan-200 text-cyan-700",
  "bg-blue-200 text-blue-700",
  "bg-indigo-200 text-indigo-700",
  "bg-purple-200 text-purple-700",
  "bg-pink-200 text-pink-700",
];

function getAvatarColor(name) {
  const username = name || "unknown";

  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }

  return avatarColors[Math.abs(hash) % avatarColors.length];
}

async function api(url, method = "GET", body = null) {
  const token = localStorage.getItem("access_token");
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return await res.json();
}

async function loadChats() {
  try {
    chats.value = await api(`${API_URL}/api/chats/`);

    const postId = route.query.post;
    const bidId = route.query.bid;

    if (postId && bidId) {
      const chatToSelect = chats.value.find(
        (chat) =>
          chat.id_post == postId && chat.active_bids?.some((b) => b.id == bidId)
      );
      if (chatToSelect) {
        await selectChat(chatToSelect);
        return;
      }
    }

    if (chats.value.length > 0 && !selectedChat.value) {
      await selectChat(chats.value[0]);
    }
  } catch (err) {
    console.error(err);
  } finally {
    loadingChats.value = false;
  }
}

async function selectChat(chat) {
  selectedChat.value = chat;
  await loadMessages(chat.id);
  await markChatAsRead(chat.id);
  await loadPost(chat.id_post);
}

async function loadMessages(chatId) {
  const data = await api(`${API_URL}/api/messages/?chat=${chatId}`);
  messages.value = await Promise.all(
    data.map(async (msg) => {
      const user = await api(`${API_URL}/api/users/${msg.id_user}/`);
      return { ...msg, user };
    })
  );
}

async function sendMessage() {
  if (!newMessage.value.trim()) return;
  const payload = {
    message: newMessage.value,
    id_chat: selectedChat.value.id,
    id_type_message_id: 1,
  };
  const newMsg = await api(`${API_URL}/api/messages/`, "POST", payload);
  const user = await api(`${API_URL}/api/users/${newMsg.id_user}/`);
  messages.value.push({ ...newMsg, user });
  newMessage.value = "";
}

async function loadPost(postId) {
  post.value = await api(`${API_URL}/api/posts/${postId}/`);
  console.log("Loaded post:", JSON.stringify(post.value, null, 2));
  checkAcceptedBid(post.value, selectedChat.value);
  openReview(post.value, selectedChat.value);
}

const formatDate = (dateStr) => {
  if (!dateStr) return "-";

  try {
    // Tronquer les microsecondes si présentes
    const cleanDateStr = dateStr.replace(/\.(\d{3})\d+Z$/, ".$1Z");

    const date = parseISO(cleanDateStr);

    const diffDays = Math.floor(
      (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays > 7) {
      return date.toLocaleDateString(
        languageStore.lang === "fr" ? "fr-FR" : "en-US",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        }
      );
    }

    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: languageStore.lang === "fr" ? fr : enUS,
    });
  } catch (e) {
    console.error("Invalid date:", dateStr);
    return "-";
  }
};

function getOtherUserId(chat) {
  if (!chat) return null;

  const otherMsg = messages.value.find(
    (m) => m.id_chat === chat.id && m.id_user !== userId
  );
  if (otherMsg) return otherMsg.id_user;

  if (post.value?.user?.id && post.value.user.id !== userId) {
    return post.value.user.id;
  }

  if (chat.user_id && chat.user_id !== userId) {
    return chat.user_id;
  }

  return null;
}

function getOtherUsername(chat) {
  if (!chat) return "";

  const otherId = getOtherUserId(chat);
  if (!otherId) return "";

  const msg = messages.value.find((m) => m.id_user === otherId);
  return msg?.user?.username || "";
}

function getOtherUserEmail(chat) {
  const otherId = getOtherUserId(chat);
  const msg = messages.value.find((m) => m.id_user === otherId);
  return msg?.user?.email || "Unknown email";
}

function getAvatar(chat) {
  const otherId = getOtherUserId(chat);
  const msg = messages.value.find((m) => m.id_user === otherId);

  // Retourne uniquement l'URL si elle existe
  return msg?.user?.avatar_url || null;
}

function getLastMessage(chat) {
  const chatMessages = messages.value.filter((m) => m.id_chat === chat.id);
  if (!chatMessages.length) return null;
  return chatMessages[chatMessages.length - 1].message;
}

function truncate(text, maxLength) {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

function getLastMessageDate(chat) {
  const chatMessages = messages.value.filter((m) => m.id_chat === chat.id);
  if (!chatMessages.length) return null;
  return chatMessages[chatMessages.length - 1].created_at;
}

function formatTime(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const sortedChatItems = computed(() => {
  if (!selectedChat.value) return [];

  const msgs = messages.value
    .filter((m) => m.id_chat === selectedChat.value.id)
    .map((m) => ({ ...m, type: "message" }));

  const otherId = getOtherUserId(selectedChat.value);

  const bids =
    post.value?.active_bids
      ?.filter((b) => b.user.id === userId || b.user.id === otherId)
      .map((b) => ({ ...b, type: "bid" })) || [];

  return [...msgs, ...bids].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );
});

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

const getPublishedDate = () => {
  const history = post.value?.status_history;
  if (!history) return null;

  const published = history.find((h) => h.status === "published");

  return published ? formatDate(published.date_changed) : null;
};

onMounted(() => {
  const token = localStorage.getItem("access_token");
  loadChats();
  checkUser();
});

const confirmBidOpen = ref(false);
const bidToConfirm = ref(null);
const bidAction = ref(null);
const declineMessage = ref("");
const showNegotiateChoice = ref(false);
const showReasonInput = ref(false);

function openBidConfirmation(bid, action) {
  bidToConfirm.value = bid;
  bidAction.value = action;
  declineMessage.value = "";
  showNegotiateChoice.value = false;
  showReasonInput.value = false;
  confirmBidOpen.value = true;
}

function cancelBid() {
  confirmBidOpen.value = false;
  bidToConfirm.value = null;
  bidAction.value = null;
  declineMessage.value = "";
  showNegotiateChoice.value = false;
  showReasonInput.value = false;
}

function openNegotiateChoice() {
  showNegotiateChoice.value = true;
}

function chooseContinueNegotiation() {
  showNegotiateChoice.value = false;
  showReasonInput.value = false;
  declineBid(bidToConfirm.value, true);
  cancelBid();
}

function chooseStopNegotiation() {
  showNegotiateChoice.value = false;
  showReasonInput.value = true;
}

async function performBidAction() {
  if (!bidToConfirm.value || !bidAction.value) return;

  if (bidAction.value === "accept") {
    await acceptBid(bidToConfirm.value);
  } else if (bidAction.value === "decline") {
    if (!declineMessage.value.trim()) {
      // alert("Veuillez saisir un message pour l'acheteur !");
      showNotification("Veuillez saisir un message pour l'acheteur !", "error");
      return;
    }
    declineBid(bidToConfirm.value, false);
    cancelBid();
  }
}

async function acceptBid(bid) {
  if ((bid.current_status.name || "").toLowerCase() !== "proposée") {
    console.warn(
      "Cette enchère ne peut pas être acceptée :",
      bid.current_status
    );
    return;
  }

  const payload = {
    price: bid.price.toString(),
    post_id: bid.post_id,
    message: bid.message || "",
    is_active: bid.is_active ?? true,
    currency_id: bid.currency_id || null,
  };

  try {
    const res = await api(
      `${API_URL}/api/bids/${bid.id}/accept/`,
      "POST",
      payload
    );
    // console.log("Bid accepted:", res);
    showNotification("Bid accepted !", "success");
    await loadPost(post.value.id);
  } catch (err) {
    showNotification(err, "error");
  }
}

async function declineBid(bid, continueNegotiation) {
  const payload = {
    continue_negotiation: continueNegotiation,
    message: declineMessage.value || "",
  };
  try {
    const res = await api(
      `${API_URL}/api/bids/${bid.id}/reject/`,
      "POST",
      payload
    );
    // console.log("Bid rejected:", res);
    showNotification("Bid rejected!", "succes");
    await loadPost(post.value.id);
  } catch (err) {
    // console.error("Erreur declineBid :", err);
    showNotification(err, "error");
  }
}

const chatMenuOpen = ref(false);
const confirmDeleteOpen = ref(false);
const chatToDelete = ref(null);

function toggleChatMenu() {
  chatMenuOpen.value = !chatMenuOpen.value;
}

function confirmDelete(chat) {
  chatToDelete.value = chat;
  confirmDeleteOpen.value = true;
}

async function performDelete() {
  if (!chatToDelete.value) return;

  try {
    const token = localStorage.getItem("access_token");
    const res = await fetch(`${API_URL}/api/chats/${chatToDelete.value.id}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error(`Erreur suppression chat : ${res.status}`);

    chats.value = chats.value.filter((c) => c.id !== chatToDelete.value.id);
    if (selectedChat.value?.id === chatToDelete.value.id) {
      selectedChat.value = null;
      messages.value = [];
    }

    console.log("Chat supprimé avec succès !");
  } catch (err) {
    console.error("Erreur suppression chat :", err);
  } finally {
    confirmDeleteOpen.value = false;
    chatToDelete.value = null;
  }
}

function cancelDelete() {
  confirmDeleteOpen.value = false;
  chatToDelete.value = null;
}

const acceptedBidNotification = ref(null);

// function checkAcceptedBid(post, selectedChat) {
//   if (!post || !selectedChat) {
//     acceptedBidNotification.value = null;
//     return;
//   }

//   const acceptedBid = post.accepted_bid;

//   if (
//     !acceptedBid ||
//     acceptedBid.current_status?.name?.toLowerCase() !== "acceptée"
//   ) {
//     acceptedBidNotification.value = null;
//     return;
//   }

//   const otherId = getOtherUserId(selectedChat);
//   const bidsInChat =
//     post.active_bids?.filter((b) => b.user.id === otherId).map((b) => b.id) ||
//     [];

//   if (bidsInChat.includes(acceptedBid.id)) {
//     acceptedBidNotification.value = acceptedBid; // <-- stocke tout l'objet
//   } else {
//     acceptedBidNotification.value = null;
//   }
// }

function checkAcceptedBid(post, selectedChat) {
  if (!post || !selectedChat) {
    acceptedBidNotification.value = null;
    return;
  }

  const acceptedBid = post.accepted_bid;

  if (
    !acceptedBid ||
    acceptedBid.current_status?.name?.toLowerCase() !== "acceptée"
  ) {
    acceptedBidNotification.value = null;
    return;
  }

  // L'utilisateur courant
  const currentUserIsPostOwner = post.user?.id === userId;
  const currentUserIsBidOwner = acceptedBid.user?.id === userId;

  if (currentUserIsPostOwner || currentUserIsBidOwner) {
    acceptedBidNotification.value = acceptedBid;
  } else {
    acceptedBidNotification.value = null;
  }
}

function formatDateTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString();
}

const openBidModal = ref(false);
const bidPrice = ref(null);
const bidMessage = ref("");
const loadingSubmitBid = ref(false);

function openCreateBidModal() {
  if (!post.value) {
    return alert("Post non chargé, réessaye.");
  }
  openBidModal.value = true;
}

async function submitBid() {
  if (!bidPrice.value) {
    alert("Veuillez entrer un prix.");
    return;
  }
  if (!post.value || !post.value.id) {
    alert("Impossible d'envoyer : post non trouvé.");
    return;
  }

  const token = localStorage.getItem("access_token");
  if (!token) {
    window.location.href = "/signin";
    return;
  }

  loadingSubmitBid.value = true;

  try {
    const payload = {
      price: bidPrice.value,
      message: bidMessage.value,
    };

    const bidResponse = await fetch(
      `${API_URL}/api/posts/${post.value.id}/place_bid/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!bidResponse.ok) {
      const err = await bidResponse.json().catch(() => ({}));
      alert("Erreur : " + JSON.stringify(err));
      return;
    }

    bidPrice.value = null;
    bidMessage.value = "";
    openBidModal.value = false;

    await loadPost(post.value.id);
    if (selectedChat.value) await loadMessages(selectedChat.value.id);
  } catch (err) {
    console.error(err);
    alert("Erreur lors de l’envoi de l’enchère.");
  } finally {
    loadingSubmitBid.value = false;
  }
}

const logout = () => {
  localStorage.removeItem("access_token");
  window.location.href = "/signin";
};
const dropdownOpen = ref(false);

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}

const reviewPopupOpen = ref(false);
const reviewRating = ref(0);
const reviewComment = ref("");

function openReview(post, selectedChat) {
  if (!post || !selectedChat) {
    reviewPopupOpen.value = false;
    return;
  }

  const acceptedBid = post.accepted_bid;

  if (
    !acceptedBid ||
    acceptedBid.current_status?.name?.toLowerCase() !== "acceptée"
  ) {
    reviewPopupOpen.value = false;
    return;
  }

  const otherId = getOtherUserId(selectedChat);

  if (acceptedBid.user.id !== otherId && acceptedBid.user.id !== userId) {
    reviewPopupOpen.value = false;
    return;
  }

  reviewRating.value = 0;
  reviewComment.value = "";
  reviewPopupOpen.value = true;
}

async function submitReview() {
  if (!reviewRating.value) return alert("Veuillez donner une note !");

  try {
    const payload = {
      id_user_to: getOtherUserId(selectedChat.value),
      rating: reviewRating.value,
      comment: reviewComment.value,
    };
    console.log("Payload", payload);

    await api(`${API_URL}/api/reviews/`, "POST", payload);
    reviewPopupOpen.value = false;

    showNotification("Merci pour votre évaluation !", "success");
  } catch (err) {
    console.error("Erreur review :", err);
    showNotification("Impossible d'envoyer la note.", "error");
  }
}

function getUnreadCount(chat) {
  return messages.value.filter(
    (m) => m.id_chat === chat.id && !m.is_read && m.id_user !== userId
  ).length;
}

async function markChatAsRead(chatId) {
  try {
    await api(`${API_URL}/api/messages/mark_as_read/`, "POST", {
      chat_id: chatId,
    });

    messages.value = messages.value.map((m) =>
      m.id_chat === chatId && m.id_user !== userId ? { ...m, is_read: true } : m
    );
  } catch (err) {
    console.error("Erreur mark as read", err);
  }
}

const showEmojiPicker = ref(false);

function addEmoji(event) {
  newMessage.value += event.detail.unicode;
  showEmojiPicker.value = false;
}

const searchQuery = ref("");

const filteredChats = computed(() => {
  if (!searchQuery.value) return chats.value;

  return chats.value.filter((chat) => {
    const username = getOtherUsername(chat).toLowerCase();
    return username.includes(searchQuery.value.toLowerCase());
  });
});

const hasStoppedOrCancelledBid = computed(() => {
  if (!post.value?.active_bids) return false;
  return post.value.active_bids.some((bid) =>
    ["arrêtée"].includes((bid.current_status?.name || "").toLowerCase())
  );
});

const isPropose = (bid) =>
  (bid.current_status?.name || "").toLowerCase() === "proposée";

const isAccept = (bid) =>
  (bid.current_status?.name || "").toLowerCase() === "acceptée";

const isPaied = (bid) =>
  (bid.current_status?.name || "").toLowerCase() === "payée";

const isAnnule = (bid) =>
  (bid.current_status?.name || "").toLowerCase() === "annulée";

const isArreteOrRefuse = (bid) => {
  const status = (bid.current_status?.name || "").toLowerCase();
  return status === "arrêtée" || status === "refusée";
};

function goToTransaction(bid) {
  if (!bid) return;

  const query = { bidId: bid.id };

  router.push({ path: "/dashboard/payment", query });
}

// Détermine si l'utilisateur doit payer
function isPayer(post, acceptedBid, currentUserId) {
  if (!post || !acceptedBid || !currentUserId) return false;

  // Si le post est de type 'buying', le propriétaire du post paye
  if (post.type_post?.type === "Buying" && post.user?.id === currentUserId) {
    return true;
  }

  // Si le post est de type 'selling', le propriétaire du bid accepté paye
  if (
    post.type_post?.type === "Selling" &&
    acceptedBid.user?.id === currentUserId
  ) {
    return true;
  }

  //   console.log("acceptedBidNotification:", JSON.stringify(acceptedBidNotification.value, null, 2));
  // console.log("userId:", userId);
  // console.log("post.type_post:", post?.type_post?.type);

  return false;
}
const notifications = ref([]);
function goToNotif() {
  window.location.href = "/dashboard/notification";
}

const unreadNotifCount = computed(
  () => notifications.value.filter((n) => !n.is_read).length
);

async function fetchNotifications() {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Not authenticated");

    const res = await fetch(`${API_URL}/api/notifications/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch notifications");

    notifications.value = await res.json();
  } catch (err) {
    console.error(err);
  } finally {
  }
}

onMounted(() => {
  fetchNotifications();
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  scrollbar-width: none;
}

emoji-picker {
  --background-color: #ffffff;
  --button-background-color: #10b481;
  --button-hover-background-color: #0ea371;
  --button-color: #fff;
  --font-size: 1.2rem;
  --border-radius: 12px;
}
</style>
