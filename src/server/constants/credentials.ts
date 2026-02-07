export const adminUser = {
  email: "ancadaniel1994@gmail.com",
  password: "123",
};

const SessionIDs = ["ABCJWT", "ABCJWT"];
export const getSessionID = () => {
  return SessionIDs[0];
};

export const getAuthToken = (body: any) => {
  let authToken = JSON.parse(body);
  let TOKEN = authToken.authCookie;

  if (TOKEN === getSessionID()) {
    return true;
  } else return false;
};

export const emailAuth = {
  email: "diniubire.ro@gmail.com",
  password: "jrffukuelpyknzks",
};


export const dpdAuth = {
  username : "200929835",
  password : "9334936614"
};

export const sagaAuth = {
  Username :  "emilcristiann@gmail.com",
  Password : "003|0ce94bc1d6cf0e72834b138bb9d49b4c",
  companyVatCode : "51976722"
};