const formatPrice = (price, currency = 'RON') => {
  if (price == null) return ''; 

  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export default formatPrice;