let express = require('express');
let router = express.Router();

router.get('/', function(req, res, next) {
  res.render('error', {
    title: '主页',
    errorCode: req.query.errorCode,
    errorMsg: req.query.errorMsg
  })
});

module.exports = router;
