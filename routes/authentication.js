const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { loginValidation, registerValidation } = require('../validation');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  try {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(400).send('Username not found.');

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Invalid password.');

    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).status(200).send({ token: token });
  } catch (err) {
    console.log(err);
    res.send({ error: err });
  }
});

router.post('/register', async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const usernameExists = await User.findOne({ username: req.body.username });
  if (usernameExists) return res.status(400).send('Username aready exists.');

  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    username: req.body.username,
    password: hashedPass,
  });

  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
