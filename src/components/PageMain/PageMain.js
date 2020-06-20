import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";

import Loader from "../Loader";
import Phones from "../Phones";
import Callout from "../Callout";
import PageInfo from "../PageInfo";

import { waterAmountLabel } from "../../utils/formats";
import { LINK_GET_DATA } from "./constants";

const PageMain = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inputsData, setInputsData] = useState({
    money: "",
    liter: "",
  });

  const onChangeLiters = (event) => {
    console.log(event.target.value);
    setInputsData({
      ...inputsData,
      liter: event.target.value,
    });
  };

  const onChangeMoney = (event) => {
    setInputsData({
      ...inputsData,
      money: event.target.value,
    });
  };

  const getData = async () => {
    try {
      const response = await fetch(LINK_GET_DATA);
      const json = await response.json();

      setData({ ...json });
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
      window.$checkout
        .get("PaymentButton", {
          element: ".payment-button-container",
          style: {
            type: "long",
            color: "black",
            height: 60,
          },
          data: {
            merchant_id: 1396424,
            currency: "UAH",
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
  }, [data, loading, inputsData.money]);

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
      {data && !error ? (
        <>
          <header className="box">
            <h1>Придбання води в водоматi</h1>
            <p>{data.address}</p>
            <Phones phones={data.phones} />
          </header>

          <main className="box">
            <Callout text="Для придбання води вы можете ввести бажану кiлькiсть літрів або суму грошей" />

            <label htmlFor="input-water-amount">Кiлькiсть лiтрiв</label>
            <div className="form-group mb-1-rem">
              <div className="form-group-input">
                <input
                  value={inputsData.liter}
                  onChange={onChangeLiters}
                  placeholder="0"
                  id="input-water-amount"
                  type="number"
                  min={0}
                />
              </div>
              <div className="form-group-amount">
                {waterAmountLabel(inputsData.liter)}
              </div>
            </div>

            <label htmlFor="input-money-amount">Cума грошей</label>
            <div className="form-group mb-1-rem">
              <div className="form-group-input">
                <input
                  value={inputsData.money}
                  onChange={onChangeMoney}
                  placeholder="0"
                  id="input-money-amount"
                  type="number"
                  min={0}
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
