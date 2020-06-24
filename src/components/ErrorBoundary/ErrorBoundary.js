import React from "react";
import { inject, observer } from "mobx-react";

import PageInfo from "../PageInfo";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error, errorInfo) {
    return { hasError: true, errorMessage: error.message };
  }

  render() {
    const { hasError, errorMessage } = this.state;
    const {
      storeWaterMachine: { data },
    } = this.props;

    if (hasError) {
      return (
        <PageInfo
          type="error"
          phones={data && data.phones}
          textHeader="Помилка платiжної сторiнки"
          textDescription={
            errorMessage || "Внтурiшня помилка платiжної сторiнки"
          }
        />
      );
    }

    return this.props.children;
  }
}

export default inject("storeWaterMachine")(observer(ErrorBoundary));
