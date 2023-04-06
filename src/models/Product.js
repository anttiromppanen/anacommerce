/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  skus: [{
    weight: {
      type: mongoose.Decimal128,
      required: true,
    },
    originCountry: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  }],
  images: [{
    type: String,
  }],
});

productSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Product', productSchema);
