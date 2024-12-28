<template>
  <UCard class="mx-auto">
    <VeeForm v-slot="{ handleSubmit, isSubmitting, errors }" class="h-fit p-2">
      <UForm
        :schema="schema"
        :state="state"
        class="mx-auto mt-4 grid w-full gap-4"
        @submit.prevent="handleSubmit($event, addCard)"
      >
        <UFormGroup label="Card Name" name="cardName" required>
          <UInput v-model="state.cardName" placeholder="Enter name on card" />
        </UFormGroup>
        <UFormGroup label="Card Number" name="cardNumber" required>
          <UInput
            v-model="state.cardNumber"
            placeholder="0000 0000 0000 0000"
          />
        </UFormGroup>
        <div class="grid grid-cols-2 gap-2">
          <UFormGroup label="Expiry Date" name="cardExpiryDate" required>
            <UPopover :popper="{ placement: 'bottom-start' }">
              <UButton
                icon="i-heroicons-calendar-days-20-solid"
                :label="gpDates.formatDate(state.cardExpiryDate)"
              />

              <template #panel="{ close }">
                <BaseDatePicker
                  v-model="state.cardExpiryDate"
                  is-required
                  placeholder="Select Date"
                  @close="close"
                />
              </template>
            </UPopover>
          </UFormGroup>
          <UFormGroup label="Card CVV" name="cardCVV" required>
            <UInput
              v-model="state.cardCVV"
              placeholder="3 digit code"
              size="md"
            />
          </UFormGroup>
        </div>

        <UButton
          :loading="isSubmitting"
          type="submit"
          color="green"
          size="lg"
          label="Add Card"
          block
          class="mb-2 h-12"
        />
      </UForm>
    </VeeForm>
  </UCard>
</template>
<script setup lang="ts">
import { Form as VeeForm } from "vee-validate";
import { object, string } from "yup";
import { usePaymentStore } from "~/store/payment.store";
import type { WalletCardEntity } from "~/types/payment";

const paymentStore = usePaymentStore();

const emit = defineEmits(["close"]);

const state = ref<WalletCardEntity>({
  cardNumber: "",
  cardName: "",
  cardCVV: "",
  cardExpiryDate: null,
});

const addCard = async (field: any) => {
  paymentStore.addUserCard(state.value);
  emit("close");
};

const schema = object({
  cardNumber: string()
    .matches(/^\d{16}$/, "Card number must be 16 digits")
    .required("Card number is required"),
  cardName: string()
    .min(2, "Card name must be at least 2 characters")
    .required("Card name is required"),
  cardCVV: string()
    .matches(/^\d{3,4}$/, "CVV must be 3 or 4 digits")
    .required("CVV is required"),
  cardExpiryDate: string().required("Expiry date is required"),
});
</script>

<style scoped></style>
