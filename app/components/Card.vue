<template>
  <div
    v-if="isMobile"
    class="relative w-full min-h-[440px] bg-white rounded-3xl overflow-hidden shadow-lg p-1"
  >
    <div class="relative h-64 group">
      <img
        v-if="post.image_url"
        :src="post.image_url"
        class="absolute inset-0 w-full h-full object-cover rounded-2xl"
      />
      <div
        v-else
        class="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-500 rounded-2xl"
      >
        No image
      </div>

      <div
        class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent rounded-2xl"
      ></div>

      <div class="absolute top-3 right-3 flex items-center gap-3 z-10">
        <button
          @click="addToFavorite"
          :disabled="favoriteLoading"
          class="w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow hover:scale-110 transition"
          :class="isFavorite ? 'text-red-600' : 'text-gray-600'"
        >
          <i
            :class="isFavorite ? 'bx bxs-heart' : 'bx bx-heart'"
            class="text-xl"
          ></i>
        </button>
      </div>

      <div class="absolute top-3 left-3 z-10 flex items-center gap-3">
        <img
          v-if="post.user?.avatar_url"
          :src="post.user?.avatar_url"
          alt="avatar"
          class="w-10 h-10 rounded-full object-cover"
        />

        <div
          v-else
          class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg cursor-pointer shadow"
          :class="getAvatarColor(post.user?.username)"
          @click="goToProfile(post.user)"
        >
          {{ post.user?.username.charAt(0).toUpperCase() }}
        </div>

        <div class="text-white">
          <div class="flex items-center justify-center gap-1 font-semibold">
            <span class="leading-none text-sm">
              {{ post.user?.username }}
            </span>

            <i
              v-if="post.user?.is_verified"
              class="bx bxs-badge-check text-white text-md align-middle"
              title="Utilisateur vérifié"
            ></i>
          </div>

          <div class="text-[10px] text-white/80">
            {{ formattedDate(props.post.updated_at) }}
          </div>
        </div>
      </div>
    </div>

    <div class="text-left text-gray-900 mt-auto p-3 flex flex-col">
      <h2 class="text-lg font-bold leading-snug">
        {{ post.title || "Sans titre" }}
      </h2>

      <p class="text-sm text-gray-700 mt-1">
        {{
          showFullDescription
            ? post.description
            : post.description?.slice(0, 70) +
              (post.description?.length > 70 ? "..." : "")
        }}
        <button
          v-if="post.description?.length > 70"
          @click="toggleDescription"
          class="text-[#10b481] ml-1 hover:underline text-xs"
        >
          {{ showFullDescription ? "Voir moins" : "Voir plus" }}
        </button>
      </p>

      <div class="flex flex-wrap gap-2 mt-2">
        <span
          class="flex items-center gap-1 bg-[#F3F4F6] px-3 py-1 rounded-full text-xs text-gray-600"
        >
          <i class="bx bx-cube text-sm"></i> {{ post.product?.product }}
        </span>
        <span
          class="flex items-center gap-1 bg-[#F3F4F6] px-3 py-1 rounded-full text-xs text-gray-600"
        >
          <i class="bx bx-package text-sm"></i> {{ post.quantity }}
          {{ post.product?.unit?.abbreviation }}
        </span>
        <span
          class="flex items-center gap-1 bg-[#F3F4F6] px-3 py-1 rounded-full text-xs text-gray-600"
        >
          <i class="bx bx-wallet text-sm"></i> {{ post.price }}
          {{ post.currency?.symbol }}
        </span>
      </div>

      <button
        v-if="
          (post?.current_status === 'published' ||
            post?.current_status === 'négociation') &&
          post?.can_receive_bids
        "
        @click="openModal"
        :class="[
          'w-full mt-3 ',
          post.type_post?.type === 'Selling' ? 'btn-primary' : 'btn-primary',
        ]"
      >
        <span class="flex items-center justify-center gap-2">
          <i
            :class="
              post.type_post?.type === 'Selling' ? 'bx bx-basket' : 'bx bx-gift'
            "
          ></i>
          {{
            post.type_post?.type === "Selling"
              ? t("btnPlaceBid")
              : t("btnMakeOffer")
          }}
        </span>
      </button>
    </div>

    <transition name="fade">
  <div
    v-if="modalOpen"
    class="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4"
  >
    <div
      class="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] relative p-4"
    >
      <button
        @click="closeModal"
        class="absolute top-4 right-4 text-gray-400 text-xl hover:text-gray-700 transition"
      >
        <i class="bx bx-x"></i>
      </button>

      <div class="flex flex-col md:flex-row gap-6 relative">
        <div class="md:w-1/2 relative">
          <div
            class="absolute top-0 left-0 flex justify-between items-start"
          >
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-3 z-10">
                <img
                  v-if="post.user?.avatar_url"
                  :src="post.user?.avatar_url"
                  alt="avatar"
                  class="w-10 h-10 rounded-full object-cover"
                />

                <div
                  v-else
                  class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg cursor-pointer shadow"
                  :class="getAvatarColor(post.user?.username)"
                  @click="goToProfile(post.user)"
                >
                  {{ post.user?.username.charAt(0).toUpperCase() }}
                </div>

                <div class="text-white">
                  <div class="flex items-center text-gray-900 justify-center gap-1 font-semibold">
                    <span class="leading-none text-sm">
                      {{ post.user?.username }}
                    </span>

                    <i
                      v-if="post.user?.is_verified"
                      class="bx bxs-badge-check text-[#10b481] text-md align-middle"
                      title="Utilisateur vérifié"
                    ></i>
                  </div>

                  <div class="text-[10px] text-gray-600">
                    {{ formattedDate(post.updated_at) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="md:w-1/2 flex flex-col justify-between gap-4 mt-8">
          <div>
            <h2 class="text-lg font-bold leading-snug">
              {{ post.title || "Sans titre" }}
            </h2>

            <p class="text-sm text-gray-700 mt-1">
              {{
                showFullDescription
                  ? post.description
                  : post.description?.slice(0, 60) +
                    (post.description?.length > 60 ? "..." : "")
              }}
              <button
                v-if="post.description?.length > 60"
                @click="toggleDescription"
                class="text-[#10b481] ml-1 hover:underline text-xs"
              >
                {{ showFullDescription ? "Voir moins" : "Voir plus" }}
              </button>
            </p>

            <div class="flex flex-wrap gap-2 mt-2">
              <span
                class="flex items-center gap-1 bg-[#F3F4F6] px-3 py-1 rounded-full text-xs text-gray-600"
              >
                <i class="bx bx-cube text-sm"></i>
                {{ post.product?.product }}
              </span>
              <span
                class="flex items-center gap-1 bg-[#F3F4F6] px-3 py-1 rounded-full text-xs text-gray-600"
              >
                <i class="bx bx-package text-sm"></i>
                {{ post.quantity }}
                {{ post.product?.unit?.abbreviation }}
              </span>
              <span
                class="flex items-center gap-1 bg-[#F3F4F6] px-3 py-1 rounded-full text-xs text-gray-600"
              >
                <i class="bx bx-wallet text-sm"></i>
                {{ post.price }}
                {{ post.currency?.symbol }}
              </span>
            </div>
          </div>

          <div class="mt-2 flex flex-col gap-3 text-sm">
            <input
              v-model="price"
              type="number"
              placeholder="Enter your bid/offer price"
              class="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#10b481]/50 shadow-sm"
            />
            <textarea
              v-model="message"
              placeholder="Write your message... (optional)"
              class="w-full p-3 border border-gray-200 rounded-lg resize-none outline-none focus:ring-1 focus:ring-[#10b481]/50 shadow-sm"
              rows="4"
            ></textarea>
            <button
              :disabled="loading"
              @click="sendBid"
              :class="[
                'flex items-center justify-center gap-2 w-full',
                post.type_post?.type === 'Selling'
                  ? 'btn-primary'
                  : 'btn-third',
                loading ? 'opacity-60 cursor-not-allowed' : '',
              ]"
            >
              <i
                :class="
                  post.type_post?.type === 'Selling'
                    ? 'bx bx-basket'
                    : 'bx bx-gift'
                "
                class="text-lg"
              ></i>
              <span>
                {{
                  loading
                    ? "Processing..."
                    : post.type_post?.type === "Selling"
                    ? t("btnPlaceBid")
                    : t("btnMakeOffer")
                }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</transition>

  </div>

  <div
    v-else
    class="bg-white rounded-3xl shadow-sm p-1 w-full sm:min-w-[600px] border border-gray-100"
  >
    <div class="relative h-72 group">
      <img
        v-if="post.image_url"
        :src="post.image_url"
        class="absolute inset-0 w-full h-full object-cover rounded-2xl"
      />
      <div
        v-else
        class="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-500 rounded-2xl"
      >
        No image
      </div>

      <div
        class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent rounded-2xl"
      ></div>

      <div class="absolute top-6 right-6 flex items-center gap-3 z-10">
        <button
          @click="addToFavorite"
          :disabled="favoriteLoading"
          class="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow hover:scale-110 transition"
          :class="isFavorite ? 'text-red-600' : 'text-gray-600'"
        >
          <i
            :class="isFavorite ? 'bx bxs-heart' : 'bx bx-heart'"
            class="text-xl"
          ></i>
        </button>

        <div class="relative">
          <button
            @click="toggleReportMenu"
            class="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow hover:scale-110 transition"
          >
            <i class="bx bx-dots-vertical-rounded text-xl text-gray-600"></i>
          </button>

          <div
            v-if="showReportMenu"
            class="absolute right-0 mt-2 w-36 bg-white rounded shadow-lg border z-20"
          >
            <button
              @click="openReportModal"
              class="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50 rounded"
            >
              Signaler
            </button>
          </div>
        </div>
      </div>

      <div class="absolute top-6 left-6 z-10 flex items-center gap-3">
        <img
          v-if="post.user?.avatar_url"
          :src="post.user?.avatar_url"
          alt="avatar"
          class="w-12 h-12 rounded-full object-cover"
        />

        <div
          v-else
          class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg cursor-pointer shadow"
          :class="getAvatarColor(post.user?.username)"
          @click="goToProfile(post.user)"
        >
          {{ post.user?.username.charAt(0).toUpperCase() }}
        </div>

        <div class="text-white">
          <div class="flex items-center justify-center gap-1 font-semibold">
            <span class="leading-none">
              {{ post.user?.username }}
            </span>

            <i
              v-if="post.user?.is_verified"
              class="bx bxs-badge-check text-white text-lg align-middle"
              title="Utilisateur vérifié"
            ></i>
          </div>

          <div class="text-xs text-white/80">
            {{ formattedDate(props.post.updated_at) }}
          </div>
        </div>
      </div>

      <div class="absolute bottom-4 left-6 flex flex-row gap-3">
        <span
          class="rounded-full px-3 py-1 text-xs text-gray-600 shadow z-10"
          :class="
            post.type_post?.type === 'Selling' ? 'bg-white/90' : 'bg-white/90'
          "
        >
          {{ post.type_post?.type }}
        </span>
        <div
          class="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs text-gray-600 shadow z-10"
        >
          <i class="bx bx-location-plus"></i>
          <span>{{ post.location || "Localisation inconnue" }}</span>
        </div>
      </div>
    </div>

    <div class="p-6 space-y-2">
      <h2 class="text-xl font-bold text-gray-900 leading-snug">
        {{ post.title || "Sans titre" }}
      </h2>

      <p class="text-gray-700 text-sm leading-relaxed">
        {{
          showFullDescription
            ? post.description
            : post.description?.slice(0, 120) +
              (post.description?.length > 120 ? "..." : "")
        }}
        <button
          v-if="post.description?.length > 120"
          @click="toggleDescription"
          class="text-[#10b481] ml-1 hover:underline"
        >
          {{ showFullDescription ? "Voir moins" : "Voir plus" }}
        </button>
      </p>

      <div
        class="flex-1 flex flex-col gap-2 text-gray-700 text-sm justify-between pt-4"
      >
        <div
          class="w-full grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 bg-white overflow-hidden"
        >
          <div class="px-2 flex flex-col gap-1 text-gray-700">
            <div
              class="flex items-center justify-start gap-2 text-gray-900 font-semibold"
            >
              <i class="bx bx-cube text-lg text-gray-700"></i>
              <span class="text-sm text-gray-700">{{
                post.product?.product
              }}</span>
            </div>
          </div>

          <div class="px-2 flex flex-col gap-1 text-gray-700">
            <div
              class="flex items-center justify-center gap-2 text-gray-900 font-semibold"
            >
              <i class="bx bx-package text-lg text-gray-700"></i>
              <span class="text-sm text-gray-700">
                {{ post.quantity }} {{ post.product?.unit?.abbreviation }}
              </span>
            </div>
          </div>

          <div class="px-2 flex flex-col gap-1 text-gray-700">
            <div
              class="flex items-center justify-end gap-2 text-gray-900 font-semibold"
            >
              <i class="bx bx-wallet text-lg text-gray-700"></i>
              <span class="text-sm text-gray-700">
                {{ post.price }} {{ post.currency?.symbol }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between gap-4 w-full pt-6">
        <div class="flex flex-wrap gap-2">
          <span
            v-for="label in post.labels"
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

        <button
          v-if="
            (post?.current_status === 'published' ||
              post?.current_status === 'négociation') &&
            post?.can_receive_bids
          "
          @click="openModal"
          :class="[
            'flex items-center gap-2 shadow-lg',
            post.type_post?.type === 'Selling' ? 'btn-primary' : 'btn-third',
          ]"
        >
          <i
            :class="
              post.type_post?.type === 'Selling' ? 'bx bx-basket' : 'bx bx-gift'
            "
            class="text-lg"
          ></i>
          <span class="whitespace-nowrap">
            {{
              post.type_post?.type === "Selling"
                ? t("btnPlaceBid")
                : t("btnMakeOffer")
            }}
          </span>
        </button>
      </div>
    </div>

    <transition name="fade">
      <div
        v-if="modalOpen"
        class="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-"
      >
        <div
          class="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh] relative p-6"
        >
          <button
            @click="closeModal"
            class="absolute top-4 right-4 text-gray-400 text-xl hover:text-gray-700 transition"
          >
            <i class="bx bx-x"></i>
          </button>

          <div class="flex flex-col md:flex-row gap-6">
            <div class="md:w-1/2 relative">
              <img
                v-if="post.image_url"
                :src="post.image_url"
                alt="product"
                class="w-full h-80 md:h-[32rem] object-cover rounded-2xl shadow-md"
              />
              <div
                v-else
                class="w-full h-80 md:h-[32rem] bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 font-medium"
              >
                No image available
              </div>
              <div
                class="absolute inset-0 rounded-2xl pointer-events-none"
                style="
                  background: linear-gradient(
                    to bottom,
                    rgba(17, 40, 48, 0.4),
                    rgba(17, 40, 48, 0),
                    rgba(17, 40, 48, 0.4)
                  );
                "
              ></div>

              <div
                class="absolute top-4 left-4 right-4 flex justify-between items-start"
              >
                <div class="flex flex-col gap-2">
                  <div class="flex items-center gap-2">
                    <img
                      v-if="post.user?.avatar_url"
                      :src="post.user?.avatar_url"
                      alt="avatar"
                      class="w-12 h-12 rounded-full cursor-pointer shadow object-cover"
                    />

                    <div
                      v-else
                      class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg cursor-pointer shadow"
                      :class="getAvatarColor(post.user?.username)"
                      @click="goToProfile(post.user)"
                    >
                      {{ post.user?.username.charAt(0).toUpperCase() }}
                    </div>

                    <div class="text-white">
                      <div class="font-semibold leading-tight">
                        {{ post.user?.username }}
                      </div>
                      <div class="text-xs text-white/80">
                        {{ formattedDate(props.post.updated_at) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="absolute top-4 right-4 flex items-center gap-3 z-10">
                <button
                  @click="addToFavorite"
                  :disabled="favoriteLoading"
                  class="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow hover:scale-110 transition"
                  :class="isFavorite ? 'text-red-600' : 'text-gray-600'"
                >
                  <i
                    :class="isFavorite ? 'bx bxs-heart' : 'bx bx-heart'"
                    class="text-xl"
                  ></i>
                </button>

                <div class="relative">
                  <button
                    @click="toggleReportMenu"
                    class="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow hover:scale-110 transition"
                  >
                    <i
                      class="bx bx-dots-vertical-rounded text-xl text-gray-600"
                    ></i>
                  </button>

                  <div
                    v-if="showReportMenu"
                    class="absolute right-0 mt-2 w-36 bg-white rounded shadow-lg border z-20"
                  >
                    <button
                      @click="openReportModal"
                      class="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50 rounded"
                    >
                      Signaler
                    </button>
                  </div>
                </div>
              </div>

              <div class="absolute bottom-4 left-4 flex flex-row gap-3">
                <span
                  class="rounded-full px-3 py-1 text-xs text-gray-600 shadow z-10"
                  :class="
                    post.type_post?.type === 'Selling'
                      ? 'bg-white/90'
                      : 'bg-white/90'
                  "
                >
                  {{ post.type_post?.type }}
                </span>
                <div
                  class="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs text-gray-600 shadow z-10"
                >
                  <i class="bx bx-location-plus"></i>
                  <span>{{ post.location || "Localisation inconnue" }}</span>
                </div>
              </div>
            </div>

            <div class="md:w-1/2 flex flex-col justify-between gap-4">
              <div>
                <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  {{ post.title || "Product Name" }}
                </h2>

                <p class="text-gray-700 mb-3 text-sm">
                  {{ post.description || "No description available." }}
                </p>

                <div
                  class="flex-1 flex flex-col gap-2 text-gray-700 text-sm justify-between pt-4"
                >
                  <div
                    class="w-full grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 bg-white overflow-hidden"
                  >
                    <div class="px-2 flex flex-col gap-1 text-gray-700">
                      <div
                        class="flex items-center justify-start gap-2 text-gray-900 font-semibold"
                      >
                        <i class="bx bx-cube text-lg text-gray-700"></i>
                        <span class="text-sm text-gray-700">{{
                          post.product?.product
                        }}</span>
                      </div>
                    </div>

                    <div class="px-2 flex flex-col gap-1 text-gray-700">
                      <div
                        class="flex items-center justify-center gap-2 text-gray-900 font-semibold"
                      >
                        <i class="bx bx-package text-lg text-gray-700"></i>
                        <span class="text-sm text-gray-700">
                          {{ post.quantity }}
                          {{ post.product?.unit?.abbreviation }}
                        </span>
                      </div>
                    </div>

                    <div class="px-2 flex flex-col gap-1 text-gray-700">
                      <div
                        class="flex items-center justify-end gap-2 text-gray-900 font-semibold"
                      >
                        <i class="bx bx-wallet text-lg text-gray-700"></i>
                        <span class="text-sm text-gray-700">
                          {{ post.price }} {{ post.currency?.symbol }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex flex-wrap gap-2">
                <span
                  v-for="label in post.labels"
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

              <div class="mt-4 flex flex-col gap-3 text-sm">
                <input
                  v-model="price"
                  type="number"
                  placeholder="Enter your bid/offer price"
                  class="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#10b481] focus:border-[#10b481] shadow-sm"
                />
                <textarea
                  v-model="message"
                  placeholder="Write your message... (optional)"
                  class="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-[#10b481] focus:border-[#10b481] shadow-sm"
                  rows="4"
                ></textarea>
                <button
                  :disabled="loading"
                  @click="sendBid"
                  :class="[
                    'flex items-center justify-center gap-2 w-full',
                    post.type_post?.type === 'Selling'
                      ? 'btn-primary'
                      : 'btn-third',
                    loading ? 'opacity-60 cursor-not-allowed' : '',
                  ]"
                >
                  <i
                    :class="
                      post.type_post?.type === 'Selling'
                        ? 'bx bx-basket'
                        : 'bx bx-gift'
                    "
                    class="text-lg"
                  ></i>
                  <span>
                    {{
                      loading
                        ? "Processing..."
                        : post.type_post?.type === "Selling"
                        ? t("btnPlaceBid")
                        : t("btnMakeOffer")
                    }}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>

  <transition name="fade">
    <div
      v-if="reportModalOpen"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded w-full max-w-md p-6">
        <h3 class="text-lg font-semibold mb-3 text-gray-800">
          {{ t("report") }}
        </h3>

        <textarea
          v-model="reportReason"
          class="w-full border rounded p-3 text-sm resize-none outline-none"
          rows="4"
          :placeholder="t('reportPlaceholder')"
        ></textarea>

        <div class="flex justify-end gap-2 mt-4">
          <button
            @click="reportModalOpen = false"
            class="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300"
          >
            {{ t("cancel") }}
          </button>
          <button
            @click="sendReport"
            :disabled="reportLoading"
            class="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            <div
              v-if="reportLoading"
              class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
            ></div>

            <span v-else>
              {{ t("send") }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </transition>
  <transition name="slide-right">
    <div
      v-if="notification.visible"
      class="fixed bottom-4 right-4 z-[9999] bg-[#112830] rounded shadow-xl px-6 py-4 flex items-center gap-4 w-96 text-left border-l-4 transition-all duration-300"
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
              ? "Succès !"
              : "Une erreur est survenue."
          }}
        </p>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, onMounted, onUnmounted } from "vue";
import { API_URL } from "~/utils/config";
import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";
import { useRouter } from "vue-router";
import { parseISO, formatDistanceToNow } from "date-fns";
import { fr, enUS } from "date-fns/locale";
const router = useRouter();

const languageStore = useLanguageStore();
const t = (key: string) => {
  const lang = languageStore.lang;
  return translate[lang][key] || key;
};

const notification = ref({ visible: false, message: "", type: "success" });

const showNotification = (
  message: string,
  type = "success",
  duration = 3000
) => {
  notification.value = { visible: true, message, type };
  setTimeout(() => (notification.value.visible = false), duration);
};

const isMobile = ref(false);

function checkMobile() {
  isMobile.value = window.innerWidth <= 640; // ≤640px = sm breakpoint Tailwind
}

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});

const isFavorite = ref(false);
const favoriteLoading = ref(false);

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

function getAvatarColor(username: string) {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

const showFullDescription = ref(false);

function toggleDescription() {
  showFullDescription.value = !showFullDescription.value;
}

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const modalOpen = ref(false);
const message = ref("");
const price = ref(null);
const loading = ref(false);
const showReportMenu = ref(false);
const reportModalOpen = ref(false);
const reportReason = ref("");
const reportLoading = ref(false);
function toggleReportMenu() {
  showReportMenu.value = !showReportMenu.value;
}

function openReportModal() {
  showReportMenu.value = false;
  reportModalOpen.value = true;
}

async function sendReport() {
  if (!reportReason.value.trim()) {
    alert("Veuillez indiquer une raison.");
    return;
  }

  const token = localStorage.getItem("access_token");
  if (!token) {
    window.location.href = "/signin";
    return;
  }

  reportLoading.value = true;

  try {
    const res = await fetch(`${API_URL}/api/reports/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id_post: props.post.id,
        reason: reportReason.value,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      alert("Erreur lors du signalement : " + JSON.stringify(err));
      reportLoading.value = false;
      return;
    }

    alert("Signalement envoyé avec succès.");
    reportReason.value = "";
    reportModalOpen.value = false;
  } catch (err) {
    console.error(err);
    alert("Erreur interne.");
  }

  reportLoading.value = false;
}

function openModal() {
  const token = localStorage.getItem("access_token");
  if (!token) {
    window.location.href = "/signin";
    return;
  }
  modalOpen.value = true;
}
function closeModal() {
  modalOpen.value = false;
}

const formattedDate = (dateStr: string) => {
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

function formatApiError(err: { [x: string]: any; non_field_errors: any[] }) {
  if (!err || typeof err !== "object") {
    return "Une erreur est survenue.";
  }

  // Cas Django REST : non_field_errors
  if (Array.isArray(err.non_field_errors)) {
    return err.non_field_errors.join(", ");
  }

  // Cas erreurs par champ { price: ["..."] }
  const messages = [];

  for (const key in err) {
    if (Array.isArray(err[key])) {
      messages.push(err[key].join(", "));
    } else if (typeof err[key] === "string") {
      messages.push(err[key]);
    }
  }

  return messages.length ? messages.join(" | ") : "Erreur inconnue.";
}

async function sendBid() {
  if (!price.value || Number(price.value) <= 0) {
    showNotification("Veuillez entrer un prix valide.", "error");
    return;
  }

  const token = localStorage.getItem("access_token");
  if (!token) {
    window.location.href = "/signin";
    return;
  }

  loading.value = true;
  const postId = props.post.id;
  let chatId = null;

  try {
    // Créer le BID EN PREMIER
    const bidResponse = await fetch(
      `${API_URL}/api/posts/${postId}/place_bid/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          price: Number(price.value),
          message: message.value || "",
        }),
      }
    );

    if (!bidResponse.ok) {
      const err = await bidResponse.json();
      showNotification(formatApiError(err), "error");
      return;
    }

    // Créer le CHAT (uniquement si le bid est OK)
    const chatResponse = await fetch(`${API_URL}/api/chats/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id_post: postId,
        id_status_id: 1,
      }),
    });

    if (!chatResponse.ok) {
      throw new Error("Erreur création du chat");
    }

    const chatData = await chatResponse.json();
    chatId = chatData.id;

    // Créer le MESSAGE
    const finalMessage =
      message.value?.trim() ||
      `Bonjour, je propose ${price.value} ${props.post.currency?.symbol}`;

    const msgResponse = await fetch(`${API_URL}/api/messages/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message: finalMessage,
        id_chat: chatId,
        id_type_message_id: 1,
      }),
    });

    if (!msgResponse.ok) {
      throw new Error("Erreur envoi message");
    }

    // SUCCÈS TOTAL
    showNotification("Votre offre et message ont été envoyés !", "success");
    price.value = null;
    message.value = "";
    modalOpen.value = false;
  } catch (error) {
    console.error(error);

    // ROLLBACK : supprimer le chat si créé
    if (chatId) {
      await fetch(`${API_URL}/api/chats/${chatId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    showNotification(
      "Une erreur est survenue. Aucune action n’a été enregistrée.",
      "error"
    );
  } finally {
    loading.value = false;
  }
}

function goToProfile(user: { id: any }) {
  router.push(`/user/${user.id}`);
}

async function checkFavorite() {
  const token = localStorage.getItem("access_token");
  if (!token) return;

  try {
    const res = await fetch(
      `${API_URL}/api/favorites/?id_post=${props.post.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.ok) {
      const data = await res.json();
      // si le backend renvoie un tableau
      isFavorite.value = Array.isArray(data) && data.length > 0;
    }
  } catch (e) {
    console.error("Erreur check favorite", e);
  }
}

async function addToFavorite() {
  if (favoriteLoading.value || isFavorite.value) return;

  const token = localStorage.getItem("access_token");
  if (!token) {
    window.location.href = "/signin";
    return;
  }

  favoriteLoading.value = true;

  try {
    const res = await fetch(`${API_URL}/api/favorites/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id_post: props.post.id,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      showNotification(formatApiError(err), "error");
      return;
    }

    isFavorite.value = true;
    showNotification("Ajouté aux favoris", "success");
  } catch (e) {
    console.error(e);
    showNotification("Erreur lors de l’ajout aux favoris", "error");
  } finally {
    favoriteLoading.value = false;
  }
}

onMounted(() => {
  checkFavorite();
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
