import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

const Callout = ({ text, type }) => {
  console.log(type);
  return (
    <div
      className={cx(
        {
          info: type === "info",
          error: type === "error",
          success: type === "success",
          warning: type === "warning",
        },
        "callout"
      )}
    >
      <div className="callout-icon">
        <svg data-icon="info-sign" width="20" height="20" viewBox="0 0 20 20">
          <desc>info-sign</desc>
          <path
            fill="currentColor"
            d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zM9 4h2v2H9V4zm4 12H7v-1h2V8H8V7h3v8h2v1z"
          ></path>
        </svg>
      </div>
      <div className="callout-description">{text}</div>
    </div>
  );
};

Callout.propTypes = {
  text: PropTypes.string,
  type: PropTypes.oneOf(["success", "error", "warning", "info"]),
};

export default Callout;
