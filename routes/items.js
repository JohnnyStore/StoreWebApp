var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('items', { title: '商品列表' });
});

module.exports = router;
