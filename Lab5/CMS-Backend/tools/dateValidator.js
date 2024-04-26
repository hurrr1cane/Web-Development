// Define custom validator function for date of birth
const validateDate = function(value) {
  // Check if the value is a valid date string in the format dd.MM.yyyy
  if (!/^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.(19|20)\d\d$/.test(value)) {
      return false;
  }

  // Parse the date string and check if it's a valid date according to the calendar
  const parts = value.split('.');
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  // Use JavaScript's Date object to check if the date is valid
  const date = new Date(year, month - 1, day);
  return date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year;
}

module.exports = validateDate;
