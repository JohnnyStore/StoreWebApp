let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let indexRouter = require('./routes/index');
let itemCategoryRouter = require('./routes/itemCategory');
let itemsRouter = require('./routes/items');
let common = require('./routes/common');
let itemRouter = require('./routes/item');
let shoppingCartRouter = require('./routes/shoppingCart');
let orderRouter = require('./routes/order');
let shippingAddressRouter = require('./routes/shippingAddress');
let addShippingAddressRouter = require('./routes/addShippingAddress');
let paymentRouter = require('./routes/payment');
let paymentSuccessRouter = require('./routes/paymentSuccess');
let myOrderRouter = require('./routes/myorder');
let loginRouter = require('./routes/login');
let registerRouter = require('./routes/register');
let forgetPasswordRouter = require('./routes/forgetPassword');
let apply = require('./routes/apply');
let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/index', indexRouter);
app.use('/common', common);
app.use('/itemCategory', itemCategoryRouter);
app.use('/items', itemsRouter);
app.use('/item', itemRouter);
app.use('/shoppingCart', shoppingCartRouter);
app.use('/order', orderRouter);
app.use('/shippingAddress', shippingAddressRouter);
app.use('/addShippingAddress', addShippingAddressRouter);
app.use('/payment', paymentRouter);
app.use('/paymentSuccess', paymentSuccessRouter);
app.use('/myOrder', myOrderRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/forgetPassword', forgetPasswordRouter);
app.use('/apply', apply);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
