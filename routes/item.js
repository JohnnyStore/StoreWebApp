var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('item', { title: '商品明细' });
});

module.exports = router;
