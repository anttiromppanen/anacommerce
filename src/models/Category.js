/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');
const { productCategoryTypes } = require('./fieldTypes');

const categorySchema = mongoose.Schema({
  _id: {
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
    additionalMenuFields: [{
      name: {
        type: String,
        required: true,
      },
      fieldType: {
        type: String,
        required: true,
      },
    }],
  }],
  menuFields: [{
    name: {
      type: String,
      required: true,
    },
    fieldType: {
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
