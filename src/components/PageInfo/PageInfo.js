import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

const PageInfo = ({ textHeader, textDescription, type }) => {
  return (
    <div
      className={cx(
        {
          info: type === "info",
          error: type === "error",
          success: type === "success",
          warning: type === "warning",
        },
        "page-info-wrapper"
      )}
    >
      <div className="box">
        <h1 className="page-info-wrapper-header">{textHeader}</h1>
        <p className="page-info-wrapper-description">{textDescription}</p>
      </div>
    </div>
  );
};

PageInfo.propTypes = {
  textHeader: PropTypes.string,
  textDescription: PropTypes.string,
  type: PropTypes.oneOf(["success", "error", "warning", "info"]),
};

export default PageInfo;
