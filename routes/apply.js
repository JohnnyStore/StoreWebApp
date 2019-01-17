var express = require('express');
var commonService = require('../service/commonService');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('apply', {title: '订单结算'});
});

module.exports = router;
