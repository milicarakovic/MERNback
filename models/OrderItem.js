const mongoose = require('mongoose');
const Product = require('./Product');

const OrderItemSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  // productId: {
  //   type: String,
  //   required: true,
  // },
  product: {
    type: Object,
  },
});

module.exports = mongoose.model('OrderItems', OrderItemSchema);
