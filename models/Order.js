const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  about: {
    type: String,
  },
  userID: {
    type: String,
    required: true,
  },
  // orderItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderItems' }],
  orderItems: [{ type: Object }],
});

module.exports = mongoose.model('Orders', OrderSchema);
