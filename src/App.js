import React from "react";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import PageMain from "./components/PageMain";
import PageInfo from "./components/PageInfo";
import PagePaymentMethods from "./components/PagePaymentMethods";

import "./App.scss";

function App() {
  return (
    <div className="pageWrapper">
      <Router>
        <Switch>
          <Route exact path="/payment-methods">
            <PagePaymentMethods />
          </Route>
          <Route path="/:id">
            <PageMain />
          </Route>
          <Route path="/">
            <PageInfo
              type="error"
              textHeader="Водомат не знайдено"
              textDescription="Можливо на водоматi вказано неправильний QR код. Будь ласка зв'яжiтся
          з нашим мнеджером для вирiшення цієї проблеми."
            />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
