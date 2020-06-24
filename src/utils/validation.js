import { getDiscountMessage, getMessageNoEnoughWater } from "../utils/messages";

export const isLitersValid = (value) => {
  return /^\d*(\.\d{0,1})?$/.test(value);
};

export const isMoneyValid = (value) => {
  return /^\d*(\.\d{0,2})?$/.test(value);
};

export const getValidationMessage = (discount, liters, maxLiters) => {
  if (liters > maxLiters) {
    return {
      message: getMessageNoEnoughWater(maxLiters),
      messageType: "error",
    };
  } else if (Number(discount) !== 0) {
    return {
      message: getDiscountMessage(discount),
      messageType: "info",
    };
  }

  return {
    message: "",
    messageType: "info",
  };
};
