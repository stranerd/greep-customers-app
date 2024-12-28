<template>
  <UCard class="mx-auto lg:w-2/5">
    <h2 class="mb-4 text-lg font-semibold">Add Details</h2>

    <div class="">
      <h2 class="">Amount</h2>
      <div class="flex w-full gap-x-2">
        <USelectMenu
          v-model="selectedCurrency"
          :options="supportedCurrencies"
          size="xl"
        >
          <template #label>
            <h2 class="flex items-center gap-x-2.5">
              <span class="">
                {{ selectedCurrency.currency }}
              </span>
              <UIcon :name="selectedCurrency.flag" class="h-4 w-4" />
            </h2>
          </template>

          <template #option="{ option: currency }">
            <h2 class="flex items-center gap-x-2.5">
              <span class="">
                {{ currency.currency }}
              </span>
              <UIcon :name="currency.flag" class="h-4 w-4" />
            </h2>
          </template>
        </USelectMenu>
        <UInput
          class="flex-1"
          size="xl"
          type="number"
          v-model.number="depositAmount"
          placeholder="Enter amount"
        />
      </div>
    </div>

    <div class="my-4">
      <h2 class="">Receive</h2>

      <div class="h-10 flex-1 items-center rounded-lg border px-4 py-2 shadow">
        <span class="block" v-if="depositAmount">
          {{
            gpNumbers.formatCurrency(depositAmount, selectedCurrency.currency)
          }}
        </span>
      </div>
    </div>
    <WalletPaymentMethod />
    <UButton class="rounded-lg" color="green" size="xl" block>Deposit</UButton>
  </UCard>
</template>

<script setup lang="ts">
import { usePaymentStore } from "~/store/payment.store";

const depositAmount = ref(0);

const { supportedCurrencies, isCardAdded } = storeToRefs(usePaymentStore());

const selectedCurrency = ref(supportedCurrencies.value[0]);
</script>

<style scoped></style>
