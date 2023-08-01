function capitalizeString(stringToCapitalize) {
  const stringLowerCase = stringToCapitalize.toLowerCase();
  const stringCapitalized = stringLowerCase
    .charAt(0)
    .toUpperCase()
    + stringLowerCase.slice(1);

  return stringCapitalized;
}

function caseInsensitiveSearch(string) {
  return { $regex: new RegExp(string, 'i') };
}

function roundDownIfResultNotZero(number) {
  const numberRoundedDown = Math.floor(number);
  if (numberRoundedDown === 0) return 1;
  return numberRoundedDown;
}

module.exports = { capitalizeString, caseInsensitiveSearch, roundDownIfResultNotZero };
