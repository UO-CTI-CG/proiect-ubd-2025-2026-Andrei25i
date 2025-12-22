export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return "";

  const phoneStr = String(phoneNumber).trim();
  const isInternational = phoneStr.startsWith("+");

  const digits = phoneStr.replace(/\D/g, "");
  if (digits.length === 10 && !isInternational) {
    return digits.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
  }

  if (isInternational && digits.length === 11 && digits.startsWith("40")) {
    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{3})/, "+$1 $2 $3 $4");
  }

  return isInternational ? `+${digits}` : digits;
};