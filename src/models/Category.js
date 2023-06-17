/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');
const { productCategoryTypes } = require('./fieldTypes');

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    enum: Object.values(productCategoryTypes),
    required: true,
  },
  subcategories: [{
    subcategoryName: {
      type: String,
      required: true,
    },
    subcategoryIcon: {
      type: String,
      required: true,
    },
  }],
});

categorySchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Category', categorySchema);
