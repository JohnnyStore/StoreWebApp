var express = require('express');
var commonService = require('../service/commonService');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('forgetPassword', { title: '密码找回' });
});

router.post('/', function(req, res, next) {
  var service = new commonService.commonInvoke('forgetPassword');
  var data = {
    cellphone:  req.body.cellphone,
    email: req.body.email,
    password: req.body.password
  };

  service.change(data, function (result) {
    if(result.err){
      res.json({
        err: true,
        code: result.code,
        msg: result.msg
      });
    }else{
      res.json({
        err: !result.content.result,
        code: result.content.responseCode,
        msg: result.content.responseMessage
      });
    }
  });
});

module.exports = router;
