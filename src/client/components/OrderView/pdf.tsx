/* eslint-disable react/jsx-key */
/* eslint-disable react/display-name */
import React, { useEffect, useState } from "react";

import { InvoiceOrderProps } from "../../utils/OrderInterfaces";
import { PDFViewer, Page, Text, View, Image, Document, StyleSheet, Font, BlobProvider } from "@react-pdf/renderer";
import strings from "../../data/strings.json";

Font.register({
  family: "Oswald",
  src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
});
const stylesPDF = StyleSheet.create({
  logo: {
    width: 74,
    height: 66,
  },
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
    width: "595px",
    height: "842px",
  },
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    width: "595px",
    height: "842px",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    fontFamily: "Oswald",
  },
  author: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 40,
  },
  dataHeadline: {
    fontSize: 12,
    textAlign: "center",
  },
  timestamp: {
    fontSize: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    margin: 12,
    fontFamily: "Oswald",
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: "justify",
    fontFamily: "Times-Roman",
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 100,
  },
  header: {
    fontSize: 12,
    marginBottom: 8,
    textAlign: "center",
    color: "grey",
  },
  headerLeft: {
    fontSize: 12,
    marginBottom: 4,
    textAlign: "left",
    color: "grey",
  },
  headerLeftBold: {
    fontSize: 12,
    marginBottom: 4,
    textAlign: "left",
    color: "black",
    fontWeight: "bold",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
  invoiceHeader: {
    height: "15%",
    border: "2px solid pink",
    display: "flex",
    flexDirection: "column",
  },
  firstRow: {
    display: "flex",
    flexDirection: "row",
    border: "1.5px solid #44A4DD",
    padding: "10px",
    justifyContent: "space-evenly",
  },
  secondRow: {
    display: "flex",
    flexDirection: "row",
    border: "1px solid #44A4DD",
    justifyContent: "space-evenly",
    height: "400px",
  },
  thirdRow: {
    display: "flex",
    flexDirection: "row",
    borderBottom: "0.7px solid black",
    justifyContent: "space-evenly",
  },
  fourthRow: {
    height: "10%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    textAlign: "center",
    width: "100%",
    padding: "0 2%",
    fontSize: "12px",
  },
  productNrCrtHeadline: {
    fontSize: 16,
    fontFamily: "Times-Roman",
    border: "0.5px solid #44A4DD",
    width: "15%",
    padding: "0 2%",
    color: "white",
    backgroundColor: "#44A4DD",
  },
  productNrCrt: {
    fontSize: 16,
    fontFamily: "Times-Roman",
    border: "0.5px solid #44A4DD",
    width: "15%",
    padding: "0 2%",
  },
  productText: {
    fontSize: 16,
    fontFamily: "Times-Roman",
    border: "0.5px solid #44A4DD",
    width: "50%",
    padding: "0 2%",
    color: "white",
    backgroundColor: "#44A4DD",
  },
  productPrice: {
    fontSize: 16,
    fontFamily: "Times-Roman",
    border: "0.5px solid #44A4DD",
    width: "25%",
    padding: "0 2%",
    color: "white",
    backgroundColor: "#44A4DD",
  },
  productItemNumber: {
    fontSize: 16,
    fontFamily: "Times-Roman",
    border: "0.5px solid #44A4DD",
    width: "25%",
    textAlign: "center",
    color: "white",
    backgroundColor: "#44A4DD",
  },
  productTextResult: {
    fontSize: 16,
    fontFamily: "Times-Roman",
    border: "0.5px solid #44A4DD",
    width: "50%",
    padding: "0 2%",
    color: "black",
    backgroundColor: "white",
  },
  productPriceResult: {
    fontSize: 16,
    fontFamily: "Times-Roman",
    border: "0.5px solid #44A4DD",
    width: "25%",
    padding: "0 2%",
    color: "black",
    backgroundColor: "white",
  },
  productItemNumberResult: {
    fontSize: 16,
    fontFamily: "Times-Roman",
    border: "0.5px solid #44A4DD",
    width: "25%",
    textAlign: "center",
    color: "black",
    backgroundColor: "white",
  },
  totals: { width: "100%", fontSize: "16px", flexWrap: "nowrap" },
});

const PDF = ({ invoiceObject }: InvoiceOrderProps) => {
  let productsListInvoice: any[] =
    typeof invoiceObject.cartProducts === "string" ? JSON.parse(invoiceObject.cartProducts) : null;
  let companyInfo = strings.companyData;
  return (
    <Document>
      <Page size={{ width: 595, height: 842 }} style={stylesPDF.body}>
        <View style={stylesPDF.invoiceHeader}>
          <Text style={stylesPDF.header}>{strings.invoiceTemplate.headerTextInvoice}</Text>
          <Text style={stylesPDF.title}>{`Factura nr.${invoiceObject.invoiceID}`}</Text>

          <Text style={stylesPDF.timestamp}>{`Data:  ${invoiceObject.timestamp}`}</Text>
        </View>
        <View style={stylesPDF.firstRow}>
          <View style={{ width: "50%" }}>
            <Text style={stylesPDF.headerLeftBold}>{`CLIENT:`}</Text>
            <Text style={stylesPDF.headerLeft}>{`${invoiceObject.firstName} ${invoiceObject.lastName}`}</Text>
            <Text
              style={stylesPDF.headerLeft}
            >{`Adresa:${invoiceObject.deliveryAddress} jud.${invoiceObject.county}`}</Text>
            <Text style={stylesPDF.headerLeft}>{`Loc:${invoiceObject.city} jud.${invoiceObject.county}`}</Text>
          </View>
          <View style={{ width: "50%" }}>
            <Text style={stylesPDF.headerLeftBold}>{"FURNIZOR: "}</Text>
            <Text style={stylesPDF.headerLeft}>{`${companyInfo.name}`}</Text>
            <Text style={stylesPDF.headerLeft}>{`Reg.com: ${companyInfo.fiscal}`}</Text>
            <Text style={stylesPDF.headerLeft}>{`CUI: ${companyInfo.number}`}</Text>
            <Text style={stylesPDF.headerLeft}>{`Adresa: ${companyInfo.address}`}</Text>
            <Text style={stylesPDF.headerLeft}>{`Tel: ${companyInfo.phoneNumber}`}</Text>
            <Text style={stylesPDF.headerLeftBold}>{`Cont bancar: ANCA DANIEL-EMANUEL`}</Text>
            <Text style={stylesPDF.headerLeftBold}>{`IBAN: RO80BTRLRONCRT00M5700202`}</Text>
          </View>
        </View>
        <View style={stylesPDF.secondRow}>
          <View style={{ width: "100%", margin: "3% auto" }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                border: "0.6px solid black",
                borderBottom: "0.7px solid black",
              }}
            >
              <Text style={stylesPDF.productNrCrtHeadline}>{"Nr. crt"}</Text>
              <Text style={stylesPDF.productText}>{"Denumire produs"}</Text>
              <Text style={stylesPDF.productItemNumber}>{"buc."}</Text>
              <Text style={stylesPDF.productPrice}>{"Pret unitar"}</Text>
            </View>
            {productsListInvoice != null
              ? productsListInvoice.map((item, index) => (
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      border: "0.6px solid black",
                    }}
                  >
                    <Text style={stylesPDF.productNrCrt}>{index}</Text>
                    <Text style={stylesPDF.productTextResult}>{item.name}</Text>
                    <Text style={stylesPDF.productItemNumberResult}>{item.itemNumber}</Text>
                    <Text style={stylesPDF.productPriceResult}>{`${item.price} RON`}</Text>
                  </View>
                ))
              : "Factura eronata! Contactati administratorul"}
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                border: "0.6px solid black",
              }}
            >
              <Text style={stylesPDF.productNrCrt}>{productsListInvoice.length}</Text>
              <Text style={stylesPDF.productTextResult}>{"Servicii de curierat"}</Text>
              <Text style={stylesPDF.productItemNumberResult}>{"1"}</Text>
              <Text style={stylesPDF.productPriceResult}>{`${invoiceObject.shippingTax} RON`}</Text>
            </View>
          </View>
        </View>
        <View style={stylesPDF.thirdRow}>
          <View style={{ width: "100%", marginTop: "10px" }}>
            <View
              style={{
                display: "flex",
                position: "absolute",
                right: "0px",
                border: "1.5px solid #44A4DD",
                width: "200px",
                marginTop: "5px",
              }}
            >
              <Text style={stylesPDF.totals}>{`TOTAL:  ${
                Number(invoiceObject.cartSum) + Number(invoiceObject.shippingTax)
              } RON `}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

const PDFView = React.memo(({ invoiceObject }: InvoiceOrderProps) => {
  return (
    <PDFViewer width={"800px"} height={"1260px"} showToolbar={false}>
      <PDF invoiceObject={invoiceObject} />
    </PDFViewer>
  );
});
export { PDF, PDFView };
