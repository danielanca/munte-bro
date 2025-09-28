import { InputProps } from "./typeProps";
import { orderProps } from "../../utils/OrderInterfaces";
import strings from "./../../data/strings.json";
import { componentStrings } from "../../data/componentStrings";

export const getInputFields = (
  orderData: orderProps,
  inputHandler: (data: React.ChangeEvent<HTMLInputElement>) => void
) => {
  let { orderFinishPage: orderString } = strings;
  const inputObject: InputProps = {
    lastName: {
      name: "lastName",
      inputListener: inputHandler,
      value: orderData.lastName,
      labelText: orderString.inputsLabels.lastName,
      mandatoryInput: true
    },
    firstName: {
      name: "firstName",
      inputListener: inputHandler,
      value: orderData.firstName,
      labelText: orderString.inputsLabels.firstName,
      mandatoryInput: true
    },
    deliveryAddress: {
      name: "deliveryAddress",
      inputListener: inputHandler,
      value: orderData.deliveryAddress,
      labelText: orderString.inputsLabels.deliveryAddress,
      mandatoryInput: true
    },
    city: {
      name: "city",
      inputListener: inputHandler,
      value: orderData.city,
      labelText: orderString.inputsLabels.city,
      mandatoryInput: true
    },
    county: {
      name: "county",
      inputListener: inputHandler,
      value: orderData.county,
      labelText: orderString.inputsLabels.county,
      mandatoryInput: true,
      inputOptions: {
        autoComplete: "false",
        list: "county"
      },
      otherStructure: {
        dataList: {
          name: "county",
          list: componentStrings.FinishOrder.countyList
        }
      }
    },
    phoneNo: {
      name: "phoneNo",
      inputListener: inputHandler,
      value: orderData.phoneNo,
      labelText: orderString.inputsLabels.phoneNo,
      mandatoryInput: true
    },
    emailAddress: {
      name: "emailAddress",
      inputListener: inputHandler,
      value: orderData.emailAddress,
      labelText: orderString.inputsLabels.emailAddress,
      mandatoryInput: false
    }
  };

  return inputObject;
};
