import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

const randomId = () => Math.random().toString(36).substr(2, 9);

export const useAccountStore = defineStore('accountList',{
    state: () => {
        return {
            accounts: useStorage('accounts', []),
            id: useStorage('accountId', randomId()),
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
            let label = '';
            let previousAccount = this.getAccountByNumber(account.number);
            if (previousAccount) {
                label = previousAccount.label;
            }

            this.accounts.push({...account, label, id: randomId(), timestamp: Date.now(), selected: false});
        },
        getAccountByNumber(accountNumber) {
            return this.accounts.find(account => account.number === accountNumber);
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
