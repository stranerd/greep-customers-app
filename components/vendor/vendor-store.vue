<template>
  <div class="flex max-w-[calc(100vw-260px)] flex-col py-5">
    <UButton
      icon="i-icon-arrow-left"
      label="Back"
      variant="outline"
      color="gray"
      :ui="{ rounded: 'rounded-3xl' }"
      class="ml-5 flex w-fit items-center text-black ring-gray-500"
      @click="router.push({ name: GP_ROUTES.DASHBOARD.HOME })"
    />

    <div v-if="selectedVendor" class="mx-auto flex w-full flex-col gap-4 p-5">
      <img
        :alt="selectedVendor.publicName"
        class="h-[237px] w-full rounded-xl object-cover"
        :src="selectedVendor?.bio?.photo?.link ?? '/blank.png'"
      />

      <div class="flex items-center justify-between">
        <VendorName
          class="text-xl font-semibold"
          :name="
            selectedVendor.publicName !== ''
              ? selectedVendor.publicName
              : 'Greep Store'
          "
        />
        <div class="flex items-center gap-x-10">
          <UButton
            square
            icon="i-icon-chat"
            size="xl"
            variant="soft"
            color="green"
            class="p-2"
            v-if="selectedVendor.id !== user?.id"
            @click="
              messageStore.setActiveChat(
                selectedVendor.id,
                'personal',
                selectedVendor.publicName,
              );
              openChatsModal = true;
            "
            :ui="{ rounded: 'rounded-full' }"
          />
          <UInput
            icon="i-icon-search-icon"
            size="lg"
            color="white"
            :trailing="false"
            :ui="{ rounded: 'rounded-3xl' }"
            placeholder="Search Store"
          />
        </div>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex gap-x-10">
          <h2 class="text-xs text-[#7E8392]">
            Opening Hours
            <span
              class="block text-sm text-black"
              v-if="selectedVendor.vendor.schedule"
              >{{
                gpDates.getVendorSchedule(selectedVendor.vendor.schedule)
              }}</span
            >
          </h2>

          <h2
            class="text-xs text-[#7E8392]"
            v-if="selectedVendor.vendor.averagePrepTimeInMins"
          >
            Delivery Time
            <span class="block text-sm text-black">
              {{
                gpDates.getTimeDifference(
                  selectedVendor.vendor.averagePrepTimeInMins.from,
                  selectedVendor.vendor.averagePrepTimeInMins.to,
                )
              }}
            </span>
          </h2>
        </div>
      </div>
    </div>

    <div class="p-5">
      <h2 class="text-xl font-semibold">Reviews and Rating</h2>
      <div class="my-2 flex items-center gap-x-1 font-medium">
        <span class="">
          {{ gpNumbers.formatNumber(totalRating / reviews.length) }}</span
        >
        <UIcon class="h-4 w-4" name="i-icon-star" />
        <span class="text-sm text-gray-400"> ({{ totalRating }})</span>
      </div>
      <div class="flex w-full items-center gap-x-3">
        <UCard class="h-[236px] w-[480px]">
          <div
            class="flex min-h-[180px] w-full flex-col-reverse justify-between gap-2"
          >
            <div class="flex items-center gap-x-2" v-for="rating in ratingData">
              <UMeter
                color="green"
                size="xl"
                block
                class="w-3/5"
                :ui="{
                  meter: {
                    background: 'bg-[#4D4D4D] ',
                    color: 'text-[#10BB76] ',
                  },
                }"
                :value="rating.value"
              />
              <div class="flex items-center">
                <UIcon
                  class="h-5 w-5"
                  :name="
                    i <= rating.rating ? 'i-icon-star' : 'i-icon-star-outline'
                  "
                  v-for="i in 5"
                />
              </div>
              <h2 class="w-12 whitespace-nowrap text-sm font-medium">
                {{ rating.percentage }}
              </h2>
            </div>
          </div>
        </UCard>

        <div
          class="hide-scrollbar flex flex-1 items-center gap-x-4 overflow-scroll p-1"
        >
          <UCard class="h-[240px] min-w-96 bg-gray-50" v-for="item in reviews">
            <h2 class="font-semibold">
              {{ item.user }}
              <span class="ml-2 text-xs font-normal text-gray-400">
                {{ gpDates.getTimeAgo(item.time) }}</span
              >
            </h2>
            <UIcon name="i-icon-star" v-for="i in item.rating" />
            <p class="text-sm text-gray-500">{{ item.review }}</p>
          </UCard>
        </div>
      </div>
    </div>

    <div class="bg-[#0092600D] p-5" v-if="selectedVendor">
      <CarouselProducts
        :products="vendorProducts"
        :title="
          selectedVendor?.type?.vendorType === 'foods'
            ? 'Top Meals'
            : 'Top Products'
        "
      />
    </div>

    <div class="grid gap-1 p-5">
      <h2 class="mb-2 flex items-center gap-x-2 text-xl font-semibold">
        <template v-if="selectedVendor?.type?.vendorType === 'foods'">
          <UIcon name="i-icon-landmark " />Our Menu
        </template>
        <template v-else>
          <UIcon name="i-icon-landmark " />Our Products</template
        >
      </h2>
      <div class="flex flex-wrap gap-4">
        <ProductCard :product="product" v-for="product in vendorProducts" />
      </div>
    </div>

    <USlideover
      v-model="openChatsModal"
      :overlay="false"
      class="z-[2000]"
      v-if="selectedVendor"
    >
      <SliderChatMessage @close="openChatsModal = false" />
    </USlideover>
  </div>
</template>

<script setup lang="ts">
import { GP_ROUTES } from "~/constants/routes";
import { useAuthStore } from "~/store/auth.store";
import { useMessageStore } from "~/store/message.store";
import { useProductStore } from "~/store/product.store";
import { useVendorStore } from "~/store/vendor.store";
import type { UserEntity } from "~/types/user";

const { selectedVendor } = storeToRefs(useVendorStore());
const { vendorProducts, productLoadingStates } = storeToRefs(useProductStore());
const { user } = storeToRefs(useAuthStore());

const productStore = useProductStore();
const vendorStore = useVendorStore();
const messageStore = useMessageStore();
const route = useRoute();
const router = useRouter();

const openChatsModal = ref(false);

const reviews = ref([
  {
    user: "David Jong",
    rating: 4,
    time: "2024-12-18T14:34:56.789Z",
    review:
      "The service was quite satisfactory overall. The staff were friendly, and the process was smooth. However, there were minor delays that could be improved upon. I would recommend this service to friends, but it would benefit from addressing a few efficiency concerns to enhance the overall experience.",
  },
  {
    user: "Emma Blake",
    rating: 5,
    time: "2024-12-16T11:23:45.123Z",
    review:
      "Absolutely amazing experience from start to finish! The attention to detail and customer care exceeded all expectations. I couldn’t have asked for a better service, and I will definitely be returning. Kudos to the team for such a professional and seamless experience. Highly recommend!",
  },
  {
    user: "Michael Perez",
    rating: 3,
    time: "2024-12-13T08:15:30.456Z",
    review:
      "It was okay, but there’s room for improvement. While the service was decent, I felt there were some noticeable gaps in communication and timing. The staff seemed a bit rushed, which impacted the overall experience. With a few tweaks, this could be a top-tier service.",
  },
  {
    user: "Michael Perez",
    rating: 3,
    time: "2024-12-13T08:15:30.456Z",
    review:
      "It was okay, but there’s room for improvement. While the service was decent, I felt there were some noticeable gaps in communication and timing. The staff seemed a bit rushed, which impacted the overall experience. With a few tweaks, this could be a top-tier service.",
  },
  {
    user: "Michael Perez",
    rating: 3,
    time: "2024-12-13T08:15:30.456Z",
    review:
      "It was okay, but there’s room for improvement. While the service was decent, I felt there were some noticeable gaps in communication and timing. The staff seemed a bit rushed, which impacted the overall experience. With a few tweaks, this could be a top-tier service.",
  },
  {
    user: "Sophia White",
    rating: 2,
    time: "2024-12-08T17:42:10.789Z",
    review:
      "Not very impressed with the overall experience. The service was below expectations, and there were several miscommunications along the way. The staff tried their best, but I feel like there’s a significant need for better management and customer focus. I hope future experiences improve.",
  },
  {
    user: "Liam Carter",
    rating: 5,
    time: "2024-12-17T09:05:25.678Z",
    review:
      "Excellent service! From the moment I arrived, everything was handled with utmost professionalism. The staff were knowledgeable, courteous, and went above and beyond to ensure my satisfaction. I would highly recommend this service to anyone looking for a seamless and pleasant experience.",
  },
  {
    user: "Olivia Martin",
    rating: 1,
    time: "2024-12-05T12:50:00.123Z",
    review:
      "Terrible experience. The staff were unhelpful, and the entire process was a nightmare. I wouldn’t recommend this service to anyone. It was a complete waste of time and money.",
  },
  {
    user: "Olivia Martin",
    rating: 1,
    time: "2024-12-05T12:50:00.123Z",
    review:
      "Terrible experience. The staff were unhelpful, and the entire process was a nightmare. I wouldn’t recommend this service to anyone. It was a complete waste of time and money.",
  },
  {
    user: "Olivia Martin",
    rating: 1,
    time: "2024-12-05T12:50:00.123Z",
    review:
      "Terrible experience. The staff were unhelpful, and the entire process was a nightmare. I wouldn’t recommend this service to anyone. It was a complete waste of time and money.",
  },
  {
    user: "Olivia Martin",
    rating: 1,
    time: "2024-12-05T12:50:00.123Z",
    review:
      "Terrible experience. The staff were unhelpful, and the entire process was a nightmare. I wouldn’t recommend this service to anyone. It was a complete waste of time and money.",
  },
  {
    user: "Olivia Martin",
    rating: 1,
    time: "2024-12-05T12:50:00.123Z",
    review:
      "Terrible experience. The staff were unhelpful, and the entire process was a nightmare. I wouldn’t recommend this service to anyone. It was a complete waste of time and money.",
  },
  {
    user: "James Taylor",
    rating: 4,
    time: "2024-12-10T16:25:40.456Z",
    review:
      "Good service overall, but there’s room for improvement. The staff were helpful, and most things went smoothly. However, there were a few minor issues with the timing, which could have been better managed.",
  },
  {
    user: "Isabella Moore",
    rating: 5,
    time: "2024-12-09T15:30:15.789Z",
    review:
      "Fantastic experience! Everything went better than expected. The staff were attentive and ensured everything was perfect. I’ll definitely be using this service again in the future.",
  },
  {
    user: "William Brown",
    rating: 3,
    time: "2024-12-06T14:15:20.678Z",
    review:
      "An average experience. There were some good moments, but there’s still a lot of room for improvement. The staff tried their best, but the overall execution left much to be desired.",
  },
  {
    user: "Mia Wilson",
    rating: 5,
    time: "2024-12-11T19:20:05.890Z",
    review:
      "An exceptional experience! Everything was perfect from start to finish. The service was fast, the staff were extremely helpful, and I couldn’t be happier. I highly recommend this to everyone.",
  },
]);

const ratingData = computed(() => {
  const ratingSummary = reviews.value.reduce<Record<number, number>>(
    (acc, review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1;
      return acc;
    },
    {},
  );

  return Object.entries(ratingSummary).map(([rating, count]) => ({
    rating: Number(rating),
    count,
    value: (count / reviews.value.length) * 100,
    percentage: gpNumbers.getPercentage(count, reviews.value.length),
  }));
});

const totalRating = computed(() => {
  return reviews.value.reduce((acc, review) => {
    acc = review.rating + acc;
    return acc;
  }, 0);
});

onBeforeMount(async () => {
  await productStore.getVendorProducts(route.params.id as string);
  await vendorStore.getSelectedVendor(route.params.id as string);
});
</script>

<style scoped></style>
