const formatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
});

export const formatFromPence = (pence: number) => formatter.format(pence / 100);




