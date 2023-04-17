const productCategoryTypes = Object.freeze({
  Food: 'Food',
  Clothes: 'Clothing',
});

const paymentStatusTypes = Object.freeze({
  Pending: 'Pending',
  Complete: 'Complete',
  Refunded: 'Refunded',
  Failed: 'Failed',
  Abandoned: 'Abandoned',
  Cancelled: 'Cancelled',
});

const orderStatusTypes = Object.freeze({
  Ready: 'Ready for shipping',
  Waiting: 'Waiting for products',
  Delivered: 'Delivered',
  Shipped: 'Order shipped',
});

module.exports = { productCategoryTypes, paymentStatusTypes, orderStatusTypes };
