var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('myorder', { title: '我的订单' });
});

module.exports = router;
