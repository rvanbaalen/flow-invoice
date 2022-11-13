<template>
  <div class="bg-white py-16 sm:py-24">

    <NoInvoiceDueDialog :open="invoice.data === true" />

    <template v-if="typeof invoice.data === 'object'">
      <InvoiceDialog :open="state.overlayOpen" :invoice="invoice.data" />
    </template>

    <div class="relative sm:py-16 mb-10">
      <div aria-hidden="true" class="hidden sm:block">
        <div class="absolute inset-y-0 left-0 w-1/2 rounded-r-3xl bg-gray-50" />
        <svg class="absolute top-8 left-1/2 -ml-3" width="404" height="392" fill="none" viewBox="0 0 404 392">
          <defs>
            <pattern id="8228f071-bcee-4ec8-905a-2a059a2cc4fb" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="4" height="4" class="text-gray-200" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="404" height="392" fill="url(#8228f071-bcee-4ec8-905a-2a059a2cc4fb)" />
        </svg>
      </div>
      <div class="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
        <div class="relative overflow-hidden rounded-2xl bg-indigo-600 px-6 py-10 shadow-xl sm:px-12 sm:py-20">
          <div aria-hidden="true" class="absolute inset-0 -mt-72 sm:-mt-32 md:mt-0">
            <svg class="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 1463 360">
              <path class="text-indigo-500 text-opacity-40" fill="currentColor" d="M-82.673 72l1761.849 472.086-134.327 501.315-1761.85-472.086z" />
              <path class="text-indigo-700 text-opacity-40" fill="currentColor" d="M-217.088 544.086L1544.761 72l134.327 501.316-1761.849 472.086z" />
            </svg>
          </div>
          <div class="relative">
            <div class="sm:text-center">
              <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">View your outstanding Flow invoices.</h2>
              <p class="mx-auto mt-6 max-w-2xl text-lg text-indigo-200">Enter your account number below to view your outstanding invoices.</p>
              <TransitionRoot
                :show="state.error"
                enter="transition-opacity duration-300"
                enter-from="opacity-0 -translate-y-2"
                enter-to="opacity-100 translate-y-0"
                leave="transition-opacity duration-200"
                leave-from="opacity-100 translate-y-0"
                leave-to="opacity-0 -translate-y-2"
              >
                <Alert class="mt-6 max-w-xl mx-auto">
                  Invalid account number. Please try again.
                </Alert>
              </TransitionRoot>
            </div>
            <form @submit.prevent class="mt-12 sm:mx-auto sm:flex sm:max-w-lg">
              <div class="min-w-0 flex-1">
                <label for="cta-email" class="sr-only">Account number</label>
                <input :class="{'disabled:bg-slate-200 cursor-not-allowed transition-all duration-200': state.loading}" :disabled="state.loading" @keydown.esc="state.overlayOpen = !state.overlayOpen" ref="accountInput" v-model="account.number" id="accountNumber" type="text" autocomplete="off" class="block w-full rounded-md border border-transparent px-5 py-3 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600" placeholder="Account number" />
              </div>
              <div class="mt-4 sm:mt-0 sm:ml-3">
                <button :disabled="state.loading" data-button @click="fetchAccountDetails()" class="block w-full rounded-md border border-transparent bg-indigo-500 px-5 py-3 text-base font-medium text-white shadow hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 sm:px-10">
                  <span class="flex items-center hidden" ref="buttonLoadingLabel">
                    <svg class="animate-spin -ml-1 mr-3 -mt-1 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Retrieving invoice data...</span>
                  </span>
                  <span ref="buttonLabel">
                    View invoices
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <AccountList @select-account="(acc) => account.number = acc.number" />

    <div class="mt-20 border-t pt-3 text-center text-slate-300 max-w-3xl mx-auto text-sm">
      <p>This is a free and open-source tool.</p>
      <p>No information is stored on servers, account history is shown based in your browsers' local storage.</p>
      <p>This is not an official application of UTS/Flow Curaçao.</p>
      <p class="mt-4"> v{{ version }}</p>
    </div>
  </div>
</template>

<script setup>
import '@rvanbaalen/transitionjs/src/transitions.css';
import {getAccountDetails} from "./accountService.js";
import {onMounted, reactive, ref, watch} from "vue";
import {toggleTransition} from "@rvanbaalen/transitionjs";
import {Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot} from "@headlessui/vue";
import Alert from "./components/Alert.vue";
import {useAccountStore} from "./store/accountStore.js";
import AccountList from "./components/AccountList.vue";
import NoInvoiceDueDialog from "./components/NoInvoiceDueDialog.vue";
import InvoiceDialog from "./components/InvoiceDialog.vue";

const store = useAccountStore();
const version = __APP_VERSION__;

let account = reactive({number: ""});
account.number = store.mostRecentAccount?.number;

const accountInput = ref();
onMounted(() => {
  accountInput.value.focus();
});

let state = reactive({
  loading: false,
  error: false,
  overlayOpen: false
});

let invoice = reactive({
  data: false
});

watch(() => state.loading, () => {
  toggleLoadingState();
});

const buttonLabel = ref();
const buttonLoadingLabel = ref();
const toggleLoadingState = async () => {
  await toggleTransition([buttonLabel.value, buttonLoadingLabel.value], {
    transition: 'fade',
    state: !state.loading
  });
};

const fetchAccountDetails = async () => {
  state.loading = true;
  state.error = false;

  try {
    invoice.data = await getAccountDetails({accountNumber: account.number});
    store.addAccount({number: account.number, due: invoice.data !== true});
    if (invoice.data !== true) {
      state.overlayOpen = true;
    }
  } catch (e) {
    if (e === false) {
      state.error = true;
    } else {
      console.error(e);
    }
  } finally {
    state.loading = false;
  }
};
</script>
