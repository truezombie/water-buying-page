import { waterAmountLabel } from "./formats";

export const getMessageNoEnoughWater = (maxLiters) => {
  return `На данний момент в водоматі немає бажаної кiлькостi води. Доступно ${maxLiters} ${waterAmountLabel(
    maxLiters
  )}`;
};

export const getDiscountMessage = (discount) => {
  return `Ваша знижка ${discount * 100}%`;
};
