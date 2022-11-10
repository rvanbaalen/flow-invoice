export async function loadHistoryFromLocalStorage() {
    return new Promise((resolve, reject) => {
        if (localStorage.getItem('history')) {
            resolve(JSON.parse(localStorage.getItem('history')) ?? []);
        } else {
            resolve([]);
        }
    });
}

export async function saveHistoryToLocalStorage({history}) {
    return new Promise((resolve, reject) => {
        localStorage.setItem('history', JSON.stringify(history));
        resolve(history);
    });
}

export async function addItemToLocalStorageHistory({history, item}) {
    if (!history) {
        history = await loadHistoryFromLocalStorage();
    }

    return new Promise((resolve, reject) => {
        history.push(item);
        localStorage.setItem('history', JSON.stringify(history));
        resolve(history);
    });
}
