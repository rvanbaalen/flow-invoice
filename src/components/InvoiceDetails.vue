<template>
  <div class="overflow-hidden bg-white shadow sm:rounded-lg">
    <div class="px-4 py-5 sm:px-6">
      <div class="flex items-center">
        <div class="flex-grow">
          <h3 class="text-lg font-medium leading-6 text-gray-900">Flow monthly invoice details</h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">Invoice details for account '{{ invoice.account_number ?? 'unknown' }}'.</p>
        </div>
        <div>
          <span class="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">{{ openBalance }} due</span>
        </div>
      </div>
    </div>
    <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
      <dl class="sm:divide-y sm:divide-gray-200">
        <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Invoice number</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
            <SelectableData :value="invoiceNumber" />
          </dd>
        </div>
        <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Account number</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
            <SelectableData :value="invoice.account_number" />
          </dd>
        </div>
        <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Invoice amount (ANG)</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
            <SelectableData :value="invoiceAmount" />
          </dd>
        </div>
        <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Open balance (ANG)</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
            <SelectableData :value="openBalance" :class="{'text-rose-700 font-semibold': openBalance > 0}" />
          </dd>
        </div>
        <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Due Date</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ dueDate.format('DD MMMM YYYY') }}</dd>
        </div>
        <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Invoice period</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ period.format('DD MMMM YYYY') }}</dd>
        </div>
        <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Invoice Status</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0" :class="{'text-rose-700': status.toLowerCase() === 'open'}">{{ status }}</dd>
        </div>
        <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Invoice Date</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ invoiceDate.format('DD MMMM YYYY') }}</dd>
        </div>
        <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Product ID</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ invoice.number }}</dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script setup>
import SelectableData from "./SelectableData.vue";
import dayjs from "dayjs";
const props = defineProps({
  invoice: {
    type: Object,
    required: true,
  },
});

const currencyToNumber = (currency) => {
  return Number(currency.replace(/[^0-9.-]+/g, ""));
};

let [invoiceNumber, period, status, invoiceDate, dueDate, invoiceAmount, openBalance] = props.invoice.invoice_result[0];
invoiceAmount = currencyToNumber(invoiceAmount);
openBalance = currencyToNumber(openBalance);

dueDate = dayjs(dueDate);
invoiceDate = dayjs(invoiceDate);
period = dayjs(period);
</script>
