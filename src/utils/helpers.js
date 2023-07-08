function capitalizeString(stringToCapitalize) {
  const stringLowerCase = stringToCapitalize.toLowerCase();
  const stringCapitalized = stringLowerCase
    .charAt(0)
    .toUpperCase()
    + stringLowerCase.slice(1);

  return stringCapitalized;
}

module.exports = { capitalizeString };
