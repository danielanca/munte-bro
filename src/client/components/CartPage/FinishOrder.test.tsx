// import React from "react";
// import { getByTestId, render, screen } from "@testing-library/react";
// import OrderDone from "./OrderDone";
// import { areInputsValid } from "./funcs";
// import { describe, expect, test } from "@jest/globals";
// import "@testing-library/jest-dom";

// let mockObject = {
//   firstName: "",
//   lastName: "",
//   emailAddress: "",
//   deliveryAddress: "",
//   city: "",
//   county: "",
//   paymentMethod: "",
//   cartProducts: "",
//   phoneNo: "",
//   cartSum: 0,
//   shippingTax: 15,
//   orderNotes: "",
//   deliveryName: "DPD Curier",
//   paymentStatus: "NOT_PAID"
// };

// let mockObjectFullFilled = {
//   firstName: "Daniel",
//   lastName: "Anca",
//   emailAddress: "ancadaniel1994@gmailcom",
//   deliveryAddress: "Plopilor nr.3",
//   city: "Turda",
//   county: "Cluj",
//   paymentMethod: "",
//   cartProducts: "",
//   phoneNo: "0745469907",
//   cartSum: 0,
//   shippingTax: 15,
//   orderNotes: "",
//   deliveryName: "DPD Curier",
//   paymentStatus: "NOT_PAID"
// };
// let mockObject_firstNameEmpty = {
//   ...mockObjectFullFilled,
//   firstName: "D"
// };
// let mockObject_lastNameEmpty = {
//   ...mockObjectFullFilled,
//   lastName: "D"
// };

// describe("[FinishOrder] Checks the areInputsValid functions", () => {
//   test("Inputs are initialized with empty strings", () => {
//     expect(areInputsValid(mockObject)).not.toBe(true);
//   });

//   test("(AllInputFields) filled with over 4characters each", () => {
//     expect(areInputsValid(mockObjectFullFilled)).toBe(true);
//   });
//   test("(InputField) First Name -> have 1 character", () => {
//     expect(areInputsValid(mockObject_firstNameEmpty)).toBe(false);
//   });
//   test("(InputField) Last Name -> have 1 character", () => {
//     expect(areInputsValid(mockObject_lastNameEmpty)).toBe(false);
//   });
// });
