// @ts-nocheck
export const convertDate = (theDate) => {
  let dateSplit = theDate.split("/");
  let tempMonth = dateSplit[0];
  return new Date(`${dateSplit[1]}/${tempMonth}/${dateSplit[2]}`).getTime();
};
