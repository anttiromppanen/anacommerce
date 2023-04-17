/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');
const { paymentStatusTypes, orderStatusTypes } = require('./fieldTypes');

const orderSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: Object.values(paymentStatusTypes),
    required: true,
  },
  status: {
    type: String,
    enum: Object.keys(orderStatusTypes),
    required: true,
  },
  amount: {
    type: mongoose.Types.Decimal128,
    required: true,
  },
  items: [{
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: mongoose.Types.Decimal128,
      required: true,
    },
    discountPercentage: {
      type: Number,
    },
  }],
  shippingAddress: {
    country: {
      type: String,
      required: true,
    },
    street1: {
      type: String,
      required: true,
    },
    street2: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    zip: {
      type: String,
      required: true,
    },
  },
  billingAddress: {
    country: {
      type: String,
      required: true,
    },
    street1: {
      type: String,
      required: true,
    },
    street2: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    zip: {
      type: String,
      required: true,
    },
  },
});

orderSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Order', orderSchema);
