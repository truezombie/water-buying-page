export const isLitersValid = (value) => {
  return /^\d*(\.\d{0,1})?$/.test(value);
};

export const isMoneyValid = (value) => {
  return /^\d*(\.\d{0,2})?$/.test(value);
};
