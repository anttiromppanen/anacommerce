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
    productId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
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

// eslint-disable-next-line func-names
orderSchema.statics.get10MostSoldProducts = function () {
  const result = this.aggregate([
    {
      $unwind: '$items',
    },
    {
      $group: {
        _id: '$items.productId',
        amountSold: { $sum: '$items.quantity' },
      },
    },
    {
      $sort: { amountSold: -1 },
    },
    {
      $limit: 10,
    },
  ]);

  return result;
};

orderSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Order', orderSchema);
