import React from "react";
import PropTypes from "prop-types";

import { ReactComponent as PhoneIco } from "./phone.svg";

const Phones = ({ phones }) => {
  return (
    <div>
      {phones.map((phone) => {
        return (
          <div key={phone}>
            <PhoneIco />
            <a href={`tel:${phone}`}>{phone}</a>
          </div>
        );
      })}
    </div>
  );
};

Phones.propTypes = {
  phones: PropTypes.arrayOf(PropTypes.number),
};

export default Phones;
