import React from "react";
import { useTranslation } from "react-i18next";
// import useFetch, { useMockFetch } from "../hook/useFetch";
import CustomTable from "../components/tables/customTable/CustomTable";
import { IcustomersTable } from "../interfaces/Itable";
import { customers, customersHeader } from "../constants/tables";
import LoadingSpinner from "../components/UI/loadingSpinner/LoadingSpinner";
const url = "success";
function Customers() {
  const { t } = useTranslation();
  // const { data, error, status } = useMockFetch<IcustomersTable[]>(url);
  let customerTable;

  // if (status === "loading") {
  //   customerTable = <LoadingSpinner />;
  // }

  // if (error) {
  //   customerTable = <CustomTable limit={10} headData={customersHeader} bodyData={customers} />;
  // }

  // if (status === "fetched" && data) {
  //   customerTable = <CustomTable limit={10} headData={customersHeader} bodyData={data} />;
  // }
  // console.log("Status is:", status);
  return (
    <section>
      <h2 className="title">{t("customers")} TEST</h2>
      {customerTable}
    </section>
  );
}

export default Customers;
