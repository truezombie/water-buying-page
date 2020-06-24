import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import ErrorBoundary from "./components/ErrorBoundary";
import PageMain from "./components/PageMain";
import PageInfo from "./components/PageInfo";

import { routes } from "./constants/routes";

import "./App.scss";

const App = () => (
  <div className="pageWrapper">
    <Router>
      <Switch>
        <Route exact path={routes.success}>
          <PageInfo
            type="success"
            textHeader="Оплата успiшна"
            textDescription="Встановіть пляшку в водомат і натисніть кнопку пуск."
          />
        </Route>
        <Route path={[routes.waterMachine, routes.main]}>
          <ErrorBoundary>
            <PageMain />
          </ErrorBoundary>
        </Route>
      </Switch>
    </Router>
  </div>
);

export default App;
