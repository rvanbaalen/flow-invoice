import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

export const useAccountStore = defineStore('accountList',{
    state: () => {
        return {
            accounts: useStorage('accounts', []),
            id: useStorage('accountId', 0),
        };
    },
    getters: {
        mostRecentAccount: (state) => {
            return state.accounts[state.accounts.length - 1];
        },
        accountsByDate: (state) => {
            return state.accounts.sort((a, b) => {
                return new Date(b.timestamp) - new Date(a.timestamp);
            });
        }
    },
    actions: {
        addAccount(account) {
            this.accounts.push({...account, id: this.id++, timestamp: Date.now(), selected: false});
        },
        deleteAccount(id) {
            this.accounts = this.accounts.filter(account => account.id !== id);
        },
        clearAccounts() {
            this.accounts = [];
            this.id = 0;
        }
    }
});
