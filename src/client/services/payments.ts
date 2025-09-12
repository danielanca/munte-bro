export const getClientSecret = async (numberOfDays:number,currency:string) => {
    return await fetch('https://us-central1-oasisresidenceweb-b7f37.cloudfunctions.net/createPayment', {
        method: 'POST',
        body: JSON.stringify({ numberOfDays: numberOfDays , currency: currency}),
      })
        .then((res) => res.json())
        .then((data) => data.clientSecret);
}

