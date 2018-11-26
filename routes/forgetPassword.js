var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('forgetPassword', { title: '找回密码' });
});

module.exports = router;
