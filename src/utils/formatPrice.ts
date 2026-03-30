const priceFormatter = new Intl.NumberFormat('en-BD', {
  maximumFractionDigits: 0,
});

export function formatPrice(amount: number) {
  return `৳ ${priceFormatter.format(amount)}`;
}
