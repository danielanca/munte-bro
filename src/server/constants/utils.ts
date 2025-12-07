export const getTimestamp = () => {
  let now = new Date();
  return `${now.getDay()}/${now.getMonth()}/${now.getFullYear()}  ${now.getHours()}:${now.getMinutes()} `;
};
export const generateInvoiceID = () => {
  return Math.ceil(Math.random() * 15044332);
};


export const getDateAndHour = () => {
  let TodayDate = new Date();
  return `${TodayDate.getDate()}/${
    TodayDate.getMonth() + 1
  }/${TodayDate.getFullYear()} ${TodayDate.getHours()}:${TodayDate.getMinutes()}`;
};

/*

export const getDateAndHour = () => {
  const now = new Date();

  const pad = (n: number) => n.toString().padStart(2, "0");

  const day = pad(now.getDate());
  const month = pad(now.getMonth() + 1);
  const year = now.getFullYear();
  const hour = pad(now.getHours());
  const minutes = pad(now.getMinutes());

  return `${day}/${month}/${year} ${hour}:${minutes}`;
};
*/