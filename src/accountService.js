export async function getAccountDetails({accountNumber}) {
    return new Promise((resolve, reject) => {
        fetch(`https://uts.cw/outstanding.php?id=${accountNumber}`)
            .then(response => response.json())
            .then(data => {
                let result = data.pop();
                if (result.is_result_available) {
                    resolve(result);
                }
                if (!result.is_result_available && result.is_paid === 1) {
                    resolve(true);
                }

                reject(false);
            })
            .catch(error => {
                reject(false);
            })
    });
}
