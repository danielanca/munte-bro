export const getCookie = (name: string) => {
    let parts;
    const value = `; ${document.cookie}`;
    parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    else return "Nothing";
};

export const setJWT = (cname: string, cvalue: string, expireHours: number) => {
  
  return new Promise(function (resolve, reject) {
    const d = new Date();
    d.setTime(d.getTime() + expireHours * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();

    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    resolve(true);
  });
};
