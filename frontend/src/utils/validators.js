export const isValidPhone = (value) => {
  const regex = /^\+?\d*$/;

  if (regex.test(value) && value.length <= 15) {
    return true;
  }
  return false;
};
