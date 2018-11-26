var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('shippingAddress', { title: '配送地址' });
});

module.exports = router;
