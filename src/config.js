const config = {
  merchant: process.env.REACT_APP_MERCHANT_ID,
  currency: process.env.REACT_APP_CURRENCY,
  phones: process.env.REACT_APP_PHONES.split(" "),
};

export default config;
