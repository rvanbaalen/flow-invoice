import {addItemToLocalStorageHistory} from "./historyService.js";
import {randomString} from "./utilities.js";

export async function getAccountDetails({accountNumber}) {
    await saveAccountNumber({accountNumber});

    return new Promise((resolve, reject) => {
        fetch(`https://uts.cw/outstanding.php?id=${accountNumber}`)
            .then(response => response.json())
            .then(data => {
                let result = data.pop();
                if (result.is_result_available) {
                    addItemToLocalStorageHistory({item: {
                        id: randomString(8),
                        content: 'Lookup of account number',
                        target: accountNumber,
                        timestamp: new Date().getTime(),
                        iconBackground: 'bg-green-400',
                    }})

                    resolve(result);
                }

                reject(false);
            })
            .catch(error => {
                reject(false);
            })
    });
}

export function loadAccountNumber() {
    return new Promise((resolve, reject) => {
        let accountNumber = localStorage.getItem('accountNumber');
        if (accountNumber) {
            resolve(accountNumber);
            return;
        }
        resolve('');
    });
}

export function saveAccountNumber({accountNumber}) {
    return new Promise((resolve, reject) => {
        localStorage.setItem('accountNumber', accountNumber);
        resolve(accountNumber);
    });
}
