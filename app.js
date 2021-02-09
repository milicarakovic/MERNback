const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoute = require('./routes/authentication');
const productRoute = require('./routes/product');
const orderRoute = require('./routes/order');

mongoose.set('useFindAndModify', false);

mongoose.set('useFindAndModify', false);

require('dotenv/config');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello HOME');
});

app.use('/user', authRoute);
app.use('/product', productRoute);
app.use('/orders', orderRoute);

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // keepAlive: true,
};

mongoose.Promise = global.Promise;

mongoose.connect(process.env.DB_CONNECTION, options, () =>
  console.log('Connected to db...')
);
app.listen(3000, () => console.log('Server is Up and running...'));
