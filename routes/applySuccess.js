var express = require('express');
var commonService = require('../service/commonService');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let orderNumber = req.query.orderNumber;
  var service = new commonService.commonInvoke('order');
  service.get(orderNumber, function (result) {
    if(result.err){
      res.render('error', {
        title: '网站出错啦',
        errorCode: result.code,
        errorMsg: result.msg
      });
    }else{
      if(result.content.responseData !== null){
        if(result.content.responseData.currencyType === 'CNY'){
          result.content.responseData.orderAmount = '¥' + result.content.responseData.orderAmount;
        }else{
          result.content.responseData.orderAmount = '$' + result.content.responseData.orderAmount;
        }
      }
      res.render('applySuccess', {
        title: '支付完成',
        order: result.content.responseData
      });
    }
  });
});

module.exports = router;
