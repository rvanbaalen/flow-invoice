<template>




  <div class="flex mx-auto max-w-lg flex-col space-y-8">
    <h3 class="font-semibold text-3xl text-center text-indigo-500">Lookup history</h3>

    <div class="flow-root" v-if="accountsByDate.length > 0">
      <ul role="list" class="-mb-8">
        <li v-for="(account, accountIndex) in accountsByDate" :key="account.id" class="group">
          <div class="relative pb-8">
            <span v-if="accountIndex !== accountsByDate.length - 1" class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
            <div class="relative flex space-x-3">
              <div>
                <span :title="account.due ? 'Account was overdue' : 'Account was paid in full'" :class="[account.due ? 'bg-rose-700' : 'bg-green-700', 'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white']">
                  <DocumentTextIcon class="h-5 w-5 text-white" aria-hidden="true" />
                </span>
              </div>
              <div class="flex min-w-0 flex-1 items-center justify-between space-x-4">
                <div>
                  <span class="text-sm cursor-pointer" :title="account.label ? 'Click to edit' : ''" :class="[!account.label ? 'text-slate-400' : '']" v-if="editLabel !== account.id" @click.stop="editLabel = account.id">{{ account.label || 'Click to add a label' }}</span>
                  <input ref="accountLabelInput" @keyup.enter="editLabel = false" v-show="editLabel === account.id" type="text" class="inline-block px-2 py-1 text-xs flex-shrink rounded-sm mb-1" v-model="account.label" placeholder="Add label" />
                  <p class="text-sm text-gray-500">
                    <a href="#" @click.stop="$emit('selectAccount', account)" class="font-medium text-slate-900 group-hover:text-indigo-600 transition-all duration-200 group-hover:cursor-pointer mr-3">
                      Account #{{ account.number }}
                    </a>
                    <span :class="[account.due ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800']" class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
                      {{ account.due ? 'Overdue' : 'Paid in full' }}
                    </span>
                  </p>
                </div>
                <div class="whitespace-nowrap text-right text-sm text-gray-500 flex-grow">
                  <time class="cursor-help" :datetime="account.timestamp" :title="dayjs(account.timestamp).format('DD MMMM, HH:mm')">{{ calculateDiff(account.timestamp) }}</time>
                </div>
                <div class="whitespace-nowrap text-right text-sm text-gray-500">
                  <button @click.stop="store.deleteAccount(account.id)">&#10060;</button>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div class="text-center mt-8">
        <a href="#" @click.stop="store.clearAccounts()" class="rounded-md py-2 px-4 text-slate-300 hover:text-white transition-all duration-200 hover:bg-indigo-700">Clear history</a>
      </div>
    </div>

    <div v-else class="bg-slate-200 rounded-lg border-dashed border-2 border-slate-500">
      <p class="text-center px-2 py-4">If you have looked up an account number before, it will show up in this list.</p>
    </div>

  </div>
</template>

<script setup>
import {useAccountStore} from "../store/accountStore.js";
import {storeToRefs} from "pinia";
import {DocumentTextIcon} from "@heroicons/vue/24/outline";
import dayjs from "dayjs";
import Duration from "dayjs/esm/plugin/duration";
import RelativeTime from "dayjs/esm/plugin/relativeTime";
import {ref, watch} from "vue";

dayjs.extend(Duration);
dayjs.extend(RelativeTime);

defineEmits(['selectAccount']);
defineProps({});

const store = useAccountStore();
const { accountsByDate } = storeToRefs(store);

let editLabel = ref('');
const accountLabelInput = ref();

watch(() => editLabel, (value) => {
  if (value) {
    accountLabelInput.value.focus();
  }
});

const calculateDiff = (timestamp) => {
  const diff = dayjs.duration(dayjs(timestamp).diff(dayjs()));
  return diff.humanize(true);
}

</script>

