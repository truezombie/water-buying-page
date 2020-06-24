import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import Phones from "../Phones";

const PageInfo = ({ textHeader, textDescription, type, phones }) => {
  return (
    <>
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
        <p className="error page-info-wrapper-contacts">
          Якщо у вас є питання ви можете зв'язатися з нашими менеджерами
        </p>
        {phones ? <Phones phones={phones} /> : null}
      </div>
    </>
  );
};

PageInfo.propTypes = {
  textHeader: PropTypes.string,
  textDescription: PropTypes.string,
  type: PropTypes.oneOf(["success", "error", "warning", "info"]),
  phones: PropTypes.arrayOf(PropTypes.string),
};

export default PageInfo;
