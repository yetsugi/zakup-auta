export const currencyFormatter = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "PLN",
});

export const mileageFormatter = new Intl.NumberFormat("pl-PL", {
  style: "unit",
  unit: "kilometer",
});
