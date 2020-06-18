import React from "react";

import { Link } from "react-router-dom";

import Callout from "../Callout";

const PageMain = () => {
  return (
    <>
      <header className="box">
        <h1>Придбання води в водоматi</h1>
        <p>вул. Познанська 7</p>
      </header>

      <main className="box">
        <Callout text="Для покупки води вы можете ввести бажану кiлькiсть лiтрiв або грошей" />
        <label htmlFor="input-water-amount">Кiлькiсть лiтрiв</label>
        <input
          placeholder="лiтри"
          id="input-water-amount"
          type="number"
          min={0}
        />
        <label htmlFor="input-money-amount">Кiлькiсть грошей (грн)</label>
        <input
          placeholder="грошi"
          id="input-money-amount"
          type="number"
          min={0}
        />
        <input type="button" value="Оплатити" />
      </main>

      <footer>
        <Link className="payment-methods-link" to="/payment-methods">
          Iншi методи оплати
        </Link>
      </footer>
    </>
  );
};

export default PageMain;
