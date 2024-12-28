<template>
  <div class="mb-5">
    <h2 class="">Payment method</h2>
    <div
      class="flex h-10 w-full items-center justify-start gap-x-4 rounded-lg border border-gray-200 p-2 font-normal"
      variant="outline"
    >
      <UButton
        icon="i-icon-wallet-card"
        variant="ghost"
        class="flex-center flex h-8 w-8 rounded-full border border-[#009DE3] text-[#009DE3]"
      />

      <UPopover v-if="selectedCard" mode="hover" :popper="{ arrow: true }">
        <h2 class="">
          {{ paymentStore.maskCardNumber(selectedCard.cardNumber).masked }}
        </h2>
        <template #panel>
          <div class="w-fit p-4">
            <div class="mx-4 mb-2" v-for="(value, key) in selectedCardDetails">
              <div
                class="mb-3 flex items-center justify-between gap-x-10 text-sm"
              >
                <h2 class="capitalize text-gray-500">
                  {{ key }}
                </h2>
                <h2 class="">
                  {{ value }}
                </h2>
              </div>

              <UDivider />
            </div>
          </div>
        </template>
      </UPopover>
      <h2 class="" v-else>Card(VISA/MasterCard)</h2>
      <UDropdown
        :items="cardOptions"
        :popper="{
          placement: 'right-start',
          offsetDistance: 10,
          arrow: true,
        }"
        class="ml-auto"
      >
        <h2 class="ml-auto mr-0 flex items-center text-xs text-[#999999]">
          <span class="">change</span>
          <UIcon name="i-icon-arrow-right" class="h-5 w-5" />
        </h2>

        <template #addCard="{ item }">
          <div class="flex items-center text-xs" @click="addNewCard">
            <UIcon
              block
              name="i-icon-plus"
              class="mr-1 ms-auto h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500"
            />
            <p class="truncate">
              {{ item.label }}
            </p>
          </div>

          <UIcon
            name="i-icon-wallet-card"
            class="ms-auto h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500"
          />
        </template>

        <template #item="{ item }">
          <span class="truncate" @click="paymentStore.selectCard(item)">{{
            paymentStore.maskCardNumber(item.cardNumber).masked
          }}</span>

          <UIcon
            name="i-icon-wallet-card"
            class="ms-auto h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500"
          />
        </template>
      </UDropdown>
    </div>
    <UModal v-model="openAddCardModal">
      <WalletAddCard @close="openAddCardModal = false" />
    </UModal>
  </div>
</template>
<script setup lang="ts">
import { usePaymentStore } from "~/store/payment.store";

const { supportedCurrencies, walletCards, selectedCard, isCardAdded } =
  storeToRefs(usePaymentStore());
const paymentStore = usePaymentStore();
const openAddCardModal = ref(!isCardAdded.value);

const addNewCard = () => {
  openAddCardModal.value = true;
};

const cardOptions = computed(() => [
  [
    ...walletCards.value.map((card) => ({
      label: card.cardNumber.toString(),
      ...card,
    })),
    {
      label: "Add Card",
      slot: "addCard",
    },
  ],
]);

const selectedCardDetails = computed(() => {
  if (selectedCard.value !== null) {
    return {
      "Card Name": selectedCard.value.cardName,
      "Card Number": paymentStore.maskCardNumber(selectedCard.value.cardNumber)
        .masked,
      "Card CVV": selectedCard.value.cardCVV,
      "Expiry Date": gpDates.formatDate(selectedCard.value?.cardExpiryDate),
    };
  }
});
</script>
