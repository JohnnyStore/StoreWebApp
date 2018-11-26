var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('paymentSuccess', { title: '支付成功' });
});

module.exports = router;
