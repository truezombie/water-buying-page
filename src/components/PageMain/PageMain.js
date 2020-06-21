import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";

import Loader from "../Loader";
import Phones from "../Phones";
import Callout from "../Callout";
import PageInfo from "../PageInfo";

import { waterAmountLabel } from "../../utils/formats";
import { LINK_GET_DATA } from "./constants";
import config from "../../config";

const initialState = {
  address: "",
  available: true,
  cost: 0,
  discounts: [],
  maxLiters: 0,
};

const PageMain = () => {
  const [data, setData] = useState(initialState);
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
      (item) => Number(liters) >= item.min && Number(liters) <= item.max
    );

    return discountItem ? discountItem.discount : 0;
  };

  const getLitersByMoney = (money, cost) => {
    const liters = Number(money / cost).toFixed(1);
    const discount = getDiscount(liters);
    const litersDiscount = discount !== 0 ? discount * (cost * liters) : 0;

    return {
      liters: Number(liters - litersDiscount).toFixed(1),
      discount,
    };
  };

  const getMoneyByLiters = (liters, cost) => {
    const money = Number(liters * cost).toFixed(2);
    const discount = getDiscount(liters);
    const moneyDiscount = discount !== 0 ? discount * money : 0;

    return {
      money: Number(money - moneyDiscount).toFixed(2),
      discount,
    };
  };

  const isLitersValid = (value) => {
    return /^\d*(\.\d{0,1})?$/.test(value);
  };

  const isMoneyValid = (value) => {
    return /^\d*(\.\d{0,2})?$/.test(value);
  };

  const getValidationMessage = (discount, liters, maxLiters) => {
    if (liters > maxLiters) {
      return {
        message: `На данний момент в водоматі немає бажаної кiлькостi води. Доступно ${maxLiters} ${waterAmountLabel(
          maxLiters
        )}`,
        messageType: "error",
      };
    } else if (Number(discount) !== 0) {
      return {
        message: `Ваша знижка ${discount * 100}%`,
        messageType: "success",
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
      const { maxLiters } = data;
      const { discount, money } = getMoneyByLiters(
        event.target.value,
        data.cost
      );

      setInputsData({
        ...inputsData,
        money,
        liters: liters,
        info: getValidationMessage(discount, liters, maxLiters),
      });
    }
  };

  const onChangeMoney = (event) => {
    const money = event.target.value;

    if (isMoneyValid(money)) {
      const { maxLiters } = data;
      const { discount, liters } = getLitersByMoney(
        event.target.value,
        data.cost
      );

      setInputsData({
        ...inputsData,
        liters,
        money: money,
        info: getValidationMessage(discount, liters, maxLiters),
      });
    }
  };

  const getData = async () => {
    try {
      // const response = await fetch(LINK_GET_DATA);
      // const json = await response.json();
      setData({
        address: "вул.Познанська 7",
        available: false,
        cost: 0.8,
        discounts: [
          { discount: 0, max: 9, min: 0 },
          { discount: 0.2, max: 19, min: 10 },
          { discount: 0.3, max: 29, min: 20 },
          { discount: 0.4, max: 100, min: 30 },
        ],
        length: 4,
        maxLiters: 50,
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
    getData();
  }, []);

  useEffect(() => {
    if (window.$checkout && !loading && data) {
      // window.$checkout
      //   .get("PaymentButton", {
      //     element: ".payment-button-container",
      //     style: {
      //       type: "long",
      //       color: "black",
      //       height: 60,
      //     },
      //     data: {
      //       merchant_id: 1396424,
      //       currency: "UAH",
      //       amount: inputsData.money,
      //     },
      //   })
      //   .on("success", (model) => {
      //     console.log("success", model);
      //   })
      //   .on("error", (model) => {
      //     console.log("error", model);
      //   });
    }
  }, [data, loading, inputsData.money]);

  if (data && !data.available) {
    new Error("На данный момент водомат не доступный");
  }

  console.log(inputsData);

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
            <p>{data.address}</p>
            <Phones phones={config.phones} />
          </header>

          <main className="box">
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
                />
              </div>
              <div className="form-group-amount">грн</div>
            </div>
            <div className="payment-button-container" />
          </main>

          <footer>
            <Link className="payment-methods-link" to="/payment-methods">
              Методи оплати
            </Link>
          </footer>
        </>
      ) : null}
    </>
  );
};

export default PageMain;
