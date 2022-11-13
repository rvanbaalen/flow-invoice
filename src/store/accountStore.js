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
                this.updateAccount(previousAccount, {timestamp: Date.now()});
                return;
            }

            this.accounts.push({...account, label, id: randomId(), timestamp: Date.now(), selected: false});
        },
        getAccountByNumber(accountNumber) {
            return this.accounts.find(account => account.number === accountNumber);
        },
        deleteAccount(id) {
            this.accounts = this.accounts.filter(account => account.id !== id);
        },
        updateAccount(account, props) {
            let index = this.accounts.findIndex(item => item.id === account.id);
            this.accounts[index] = {...account, ...props};
        },
        clearAccounts() {
            this.accounts = [];
            this.id = 0;
        }
    }
});
