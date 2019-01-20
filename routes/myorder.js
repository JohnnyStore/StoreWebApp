var express = require('express');
var commonService = require('../service/commonService');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('myorder', { title: '我的订单' });
});

router.put('/changeOrderStatus', function (req, res, next) {
  var service = new commonService.commonInvoke('changeOrderStatus');
  var data = {
    orderID: req.body.orderID,
    orderStatus: req.body.orderStatus,
    loginUser: req.body.loginUser
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
        msg: result.content.responseMessage,
        data: result.content
      });
    }
  });
});

module.exports = router;
