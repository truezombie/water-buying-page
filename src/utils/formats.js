export const waterAmountLabel = (value) => {
  switch (value) {
    case "1":
      return "лiтр";
    case "2":
    case "3":
    case "4":
      return "лiтри";
    default:
      return "лiтрiв";
  }
};
