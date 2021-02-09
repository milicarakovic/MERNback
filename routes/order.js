const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const verify = require('./verifyToken');
const jwt = require('jsonwebtoken');

router.get('/', verify, async (req, res) => {
  try {
    let token = jwt.decode(req.header('auth-token'), process.env.TOKEN_SECRET);
    const orders = await Order.find({ userID: token._id });
    res.json(orders);
  } catch (err) {
    res.status(400).json({ message: err });
    console.log(err);
  }
});

router.post('/', verify, async (req, res) => {
  try {
    let token = jwt.decode(req.header('auth-token', process.env.TOKEN_SECRET));
    let orderToMake = req.body;

    const order = new Order({
      date: orderToMake.date,
      about: orderToMake.about,
      userID: token._id,
      orderItems: [],
    });

    await order.save();
    let savedOrder = await Order.find({ date: order.date });

    for (let index = 0; index < orderToMake.orderItems.length; index++) {
      let element = new OrderItem({
        orderId: savedOrder[0]._id,
        quantity: orderToMake.orderItems[index].quantity,
        // productId: orderToMake.orderItems[index].product._id,
        product: orderToMake.orderItems[index].product,
      });
      await element.save();
    }

    const items = await OrderItem.find({ orderId: savedOrder[0]._id });

    await Order.findById(savedOrder[0]._id, (err, updatedOrder) => {
      updatedOrder.orderItems = items;
      updatedOrder.save();
    });
    res.send({ order: savedOrder[0]._id });
  } catch (err) {
    res.status(400).json({ message: err });
    console.log(err);
  }
});

router.put('/', verify, async (req, res) => {
  try {
    let token = jwt.decode(req.header('auth-token', process.env.TOKEN_SECRET));
    let orderToMake = req.body;
    let existingOrder = await Order.findById(orderToMake._id);

    existingOrder.date = orderToMake.date;
    existingOrder.about = orderToMake.about;
    existingOrder.orderItems = [];
    await existingOrder.save();
    await OrderItem.deleteMany({ orderId: existingOrder._id });

    for (let index = 0; index < orderToMake.orderItems.length; index++) {
      let element = new OrderItem({
        orderId: existingOrder._id,
        quantity: orderToMake.orderItems[index].quantity,
        product: orderToMake.orderItems[index].product,
      });
      await element.save();
    }

    const items = await OrderItem.find({ orderId: existingOrder._id });

    await Order.findById(existingOrder._id, (err, updatedOrder) => {
      updatedOrder.orderItems = items;
      updatedOrder.save();
    });
    res.send({ order: existingOrder._id });
  } catch (err) {
    res.status(400).json({ message: err });
    console.log(err);
  }
});

router.delete('/', verify, async (req, res) => {
  try {
    let token = jwt.decode(req.header('auth-token'), process.env.TOKEN_SECRET);
    const orders = await Order.deleteMany({ userID: token._id });
    const orders1 = await OrderItem.deleteMany({});
    res.json(orders);
  } catch (err) {
    res.status(400).json({ message: err });
    console.log(err);
  }
});

router.delete('/:orderId', verify, async (req, res) => {
  try {
    let token = jwt.decode(req.header('auth-token'), process.env.TOKEN_SECRET);
    const deletedOrder = await Order.remove({ _id: req.params.orderId });

    res.json(deletedOrder);
  } catch (err) {
    res.status(400).json({ message: err });
    console.log(err);
  }
});

module.exports = router;
