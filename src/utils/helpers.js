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

module.exports = { capitalizeString, caseInsensitiveSearch };
