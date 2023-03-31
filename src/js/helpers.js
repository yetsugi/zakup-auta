export const currencyFormatter = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "PLN",
});

export const mileageFormatter = new Intl.NumberFormat("pl-PL", {
  style: "unit",
  unit: "kilometer",
});

export function nowAddDays(days) {
  const now = new Date();

  const date = new Date();
  date.setDate(now.getDate() + days);

  return date.toISOString().split("T")[0];
}
