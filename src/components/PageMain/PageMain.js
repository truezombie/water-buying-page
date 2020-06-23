import React, { useEffect, useState, useMemo } from "react";

import Loader from "../Loader";
import Phones from "../Phones";
import Callout from "../Callout";
import PageInfo from "../PageInfo";

import { waterAmountLabel } from "../../utils/formats";
import { isLitersValid, isMoneyValid } from "../../utils/validation";
import { responseStatuses } from "../../constants/statuses";
import {
  getDiscountMessage,
  getMessageNoEnoughWater,
} from "../../utils/messages";
import config from "../../config";

const initialState = {
  automate_number: 0,
  town: "",
  street: "",
  build: 0,
  phones: [],
  maxLiters: 50, // TODO: need to delete
  water_available: 0,
  price: 0,
  discounts: [],
  status: "OK",
  error: "OK",
};

const PageMain = () => {
  const [data, setData] = useState(initialState);
  const [wantToPay, setWantToPay] = useState(false);
  const [isCardPaymentMethod, setCardCardPaymentMethod] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
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
        Number(liters) >= item.start_range && Number(liters) < item.end_range
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

  const getValidationMessage = (discount, liters, maxLiters) => {
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

  const onChangeLiters = (event) => {
    const liters = event.target.value;

    if (isLitersValid(liters)) {
      const { water_available } = data;
      const { discount, money } = getMoneyByLiters(
        event.target.value,
        data.price
      );

      setInputsData({
        ...inputsData,
        money,
        liters: liters,
        info: getValidationMessage(discount, liters, water_available),
      });
    }
  };

  const onChangeMoney = (event) => {
    const money = event.target.value;

    if (isMoneyValid(money)) {
      const { water_available } = data;
      const { discount, liters } = getLitersByMoney(
        event.target.value,
        data.price
      );

      setInputsData({
        ...inputsData,
        liters,
        money: money,
        info: getValidationMessage(discount, liters, water_available),
      });
    }
  };

  const onToggleWantToPay = () => {
    setWantToPay(!wantToPay);
  };

  const onTogglePaymentMethod = () => {
    setCardCardPaymentMethod(!isCardPaymentMethod);
  };

  const getWaterMachineData = async () => {
    try {
      // const waterMachine = await fetch(LINK_GET_DATA);
      // const waterMachineAvailable = await fetch(LINK_GET_DATA);

      setData({
        ...initialState,
      });
    } catch (error) {
      setError(
        new Error("При отримання даних платiжної сторiнки. Выникла помилка.")
      );
    } finally {
      setLoading(false);
    }
  };

  const loader = useMemo(() => {
    return loading && !data ? <Loader /> : null;
  }, [loading, data]);

  useEffect(() => {
    getWaterMachineData();
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
            merchant_id: config.merchant_id,
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

  console.log(error);

  if (data.error === responseStatuses.error || error.message) {
    throw new Error("Виникла помилка при отриманнi данних платіжної сторінки.");
  }

  if (data.status === responseStatuses.error) {
    throw new Error("На данний момент продаж води в водоматі не доступний.");
  }

  return (
    <>
      {loader}
      {error ? (
        <PageInfo
          textHeader="Виникла помилка"
          textDescription={error.message}
          type="error"
        />
      ) : null}
      {!error ? (
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

export default PageMain;
