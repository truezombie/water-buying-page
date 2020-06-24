import React, { useEffect, useState, useMemo } from "react";
import { inject, observer } from "mobx-react";

import Loader from "../Loader";
import Phones from "../Phones";
import Callout from "../Callout";

import { waterAmountLabel } from "../../utils/formats";
import {
  isLitersValid,
  isMoneyValid,
  getValidationMessage,
} from "../../utils/validation";
import { errorHandling } from "../../utils/errorsHandling";
import config from "../../config";

const PageMain = ({ storeWaterMachine }) => {
  const { data, isLoading, error } = storeWaterMachine;
  const [wantToPay, setWantToPay] = useState(false);
  const [isCardPaymentMethod, setCardCardPaymentMethod] = useState(false);
  const [inputsData, setInputsData] = useState({
    info: {
      message: "",
      messageType: "info",
    },
    money: "",
    liters: "",
  });

  const getDiscount = (liters) => {
    const discountItem = data.discounts.find(
      (item) =>
        Number(liters) >= item.startRange && Number(liters) < item.endRange
    );

    return discountItem ? discountItem.discount / 100 : 0;
  };

  const getLitersByMoney = (money, price) => {
    const liters = Number(money / price).toFixed(1);
    const discount = getDiscount(liters);
    const litersDiscount = discount !== 0 ? discount * (price * liters) : 0;

    return {
      liters: Number(liters - litersDiscount).toFixed(1),
      discount,
    };
  };

  const getMoneyByLiters = (liters, price) => {
    const money = Number(liters * price).toFixed(2);
    const discount = getDiscount(liters);
    const moneyDiscount = discount !== 0 ? discount * money : 0;

    return {
      money: Number(money - moneyDiscount).toFixed(2),
      discount,
    };
  };

  const onChangeLiters = (event) => {
    const liters = event.target.value;

    if (isLitersValid(liters)) {
      const { waterAvailable } = data;
      const { discount, money } = getMoneyByLiters(
        event.target.value,
        data.price / 100
      );

      setInputsData({
        ...inputsData,
        money,
        liters: liters,
        info: getValidationMessage(discount, liters, waterAvailable),
      });
    }
  };

  const onChangeMoney = (event) => {
    const money = event.target.value;

    if (isMoneyValid(money)) {
      const { waterAvailable } = data;
      const { discount, liters } = getLitersByMoney(
        event.target.value,
        data.price / 100
      );

      setInputsData({
        ...inputsData,
        liters,
        money: money,
        info: getValidationMessage(discount, liters, waterAvailable),
      });
    }
  };

  const onToggleWantToPay = () => {
    setWantToPay(!wantToPay);
  };

  const onTogglePaymentMethod = () => {
    setCardCardPaymentMethod(!isCardPaymentMethod);
  };

  const loader = useMemo(() => {
    return isLoading ? <Loader /> : null;
  }, [isLoading]);

  useEffect(() => {
    storeWaterMachine.fetchWaterMachineData();
  }, []);

  useEffect(() => {
    if (
      !isCardPaymentMethod &&
      window.$checkout &&
      wantToPay &&
      inputsData.money
    ) {
      window.$checkout
        .get("PaymentButton", {
          element: ".payment-button-container",
          style: {
            type: "long",
            color: "black",
            height: 60,
          },
          data: {
            merchant_id: config.merchantId,
            currency: config.currency,
            amount: inputsData.money,
          },
        })
        .on("success", (model) => {
          console.log("success", model);
        })
        .on("error", (model) => {
          console.log("error", model);
        });
    }
  }, [wantToPay, isCardPaymentMethod, inputsData.money]);

  errorHandling(error || data ? data.status : "");

  return (
    <>
      {loader}
      {!isLoading && data ? (
        <>
          <header className="box">
            <h1>Придбання води в водоматi</h1>
            <p>{`${data.town} ${data.street}, ${data.build}`}</p>
            <Phones phones={data.phones} />
          </header>

          <main className="box mb-1-rem">
            <Callout text="Для придбання води вы можете ввести бажану кiлькiсть літрів або суму грошей" />

            {inputsData.info.message ? (
              <Callout
                type={inputsData.info.messageType}
                text={inputsData.info.message}
              />
            ) : null}

            <label htmlFor="input-water-amount">Кiлькiсть лiтрiв</label>
            <div className="form-group mb-1-rem">
              <div className="form-group-input">
                <input
                  value={inputsData.liters}
                  onChange={onChangeLiters}
                  placeholder="0"
                  id="input-water-amount"
                  type="text"
                  disabled={wantToPay}
                />
              </div>
              <div className="form-group-amount">
                {waterAmountLabel(inputsData.liters)}
              </div>
            </div>

            <label htmlFor="input-money-amount">Cума грошей</label>
            <div className="form-group">
              <div className="form-group-input">
                <input
                  value={inputsData.money}
                  onChange={onChangeMoney}
                  placeholder="0"
                  id="input-money-amount"
                  type="text"
                  disabled={wantToPay}
                />
              </div>
              <div className="form-group-amount">грн</div>
            </div>
            <input
              onClick={onToggleWantToPay}
              className="mt-1-rem"
              type="button"
              disabled={Number(inputsData.money) === 0}
              value={wantToPay ? "Відредагувати" : "Сплатити"}
            />
          </main>
        </>
      ) : null}
      {wantToPay ? (
        <>
          <footer className="box mb-1-rem">
            {isCardPaymentMethod ? (
              <div>card</div>
            ) : (
              <div className="payment-button-container" />
            )}
          </footer>
          <p onClick={onTogglePaymentMethod} className="payment-another-method">
            {isCardPaymentMethod ? "Сплатити телефоном" : "Сплатити карткою"}
          </p>
        </>
      ) : null}
    </>
  );
};

export default inject("storeWaterMachine")(observer(PageMain));
