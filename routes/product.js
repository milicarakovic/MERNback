const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const verify = require('./verifyToken');
const jwt = require('jsonwebtoken');
const Product = require('../models/Product');

router.get('/', verify, async (req, res) => {
  try {
    let token = jwt.decode(req.header('auth-token'), process.env.TOKEN_SECRET);
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(400).json({ message: err });
    console.log(err);
  }
});

module.exports = router;
