import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import ErrorBoundary from "./components/ErrorBoundary";
import PageMain from "./components/PageMain";
import PageInfo from "./components/PageInfo";

import { routes } from "./constants/routes";

import "./App.scss";

function App() {
  return (
    <div className="pageWrapper">
      <Router>
        <Switch>
          <Route exact path={routes.notFoundWaterMachine}>
            <PageInfo
              type="error"
              textHeader="Водомат не знайдено"
              textDescription="Можливо на водоматi вказано неправильний QR код. Будь ласка зв'яжiтся
          з нашим мнеджером для вирiшення цієї проблеми."
            />
          </Route>
          <Route exact path={routes.success}>
            <PageInfo
              type="success"
              textHeader="Оплата успiшна"
              textDescription="Встановіть пляшку в водомат і натисніть кнопку пуск."
            />
          </Route>
          <Route path={routes.waterMachine}>
            <ErrorBoundary>
              <PageMain />
            </ErrorBoundary>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
