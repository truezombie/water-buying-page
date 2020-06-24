import { statusesServer, statusesClient } from "../constants/statuses";

export const errorHandling = (status) => {
  switch (status) {
    case statusesClient.UNDEFINED_ERROR:
    case statusesServer.CONNECTION_FAIL:
      throw new Error("Помилка при отриманні даних з серверу.");
    case statusesServer.SALES_STOPPED:
      throw new Error(
        "На данний момент водомат не має можливості продати вам воду."
      );
    case statusesServer.DOES_NOT_WORK:
      throw new Error("На данний момент водомат не працює.");
    case statusesServer.AUTOMATE_NOT_FOUND:
      throw new Error(
        "Водомат не знайдено. Спробуйте відсканувати QR код ще раз."
      );
    default:
      return null;
  }
};
