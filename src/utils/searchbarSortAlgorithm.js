function searchbarResultScore(resultName, queryString, category) {
  // if result starts with queryString, give highest sort order
  if (resultName.substr(0, queryString.length) === queryString) {
    // category and subcategory rank higher than products
    if (category === 'category' || category === 'subcategory') return -2;
    return -1;
  }

  // else sort from shortest name to longest
  return resultName.length - queryString.length;
}

module.exports = searchbarResultScore;
