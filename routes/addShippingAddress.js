var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('addShippingAddress', { title: '添加收获地址' });
});

module.exports = router;
