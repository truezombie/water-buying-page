import React from "react";

import PageInfo from "../PageInfo";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error, errorInfo) {
    return { hasError: true };
  }

  render() {
    const { hasError } = this.state;

    if (hasError) {
      return (
        <PageInfo
          type="error"
          textHeader="Помилка платiжної сторiнки"
          textDescription="Внтурiшня помилка платiжної сторiнки"
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
