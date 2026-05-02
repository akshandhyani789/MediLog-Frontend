export const isValidIndianPhone = (phone) => {
  const cleanedPhone = String(phone).trim();

  // Indian mobile number: starts with 6,7,8,9 and total 10 digits
  return /^[6-9]\d{9}$/.test(cleanedPhone);
};