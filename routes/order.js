var express = require('express');
var commonService = require('../service/commonService');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var customerID = req.cookies['loginCustomerID'];
  var service = new commonService.commonInvoke('shoppingCart4Customer');
  var parameter = customerID + '/C';
  if(customerID === undefined){
    res.render('error', {
      title: '订单结算',
      error: true
    });
  }else{
    service.get(parameter, function (result) {
      if(result.err){
        res.render('error', {
          title: '订单结算',
          error: true
        });
      }else{
        let totalAmount4RMB = 0;
        let totalAmount4USD = 0;
        if(result.content.responseData !== null){
          result.content.responseData.forEach(function(data, index){
            totalAmount4RMB += data.totalPrice4RMB;
            totalAmount4USD += data.totalPrice4USD
          });
        }

        res.render('order', {
          title: '订单结算',
          shoppingCartList: result.content.responseData,
          shippingID: req.query.shippingID,
          totalAmount4RMB: totalAmount4RMB.toFixed(2),
          totalAmount4USD: totalAmount4USD.toFixed(2)
        });
      }
    });
  }
});

router.post('/', function (req, res, next) {
  var service = new commonService.commonInvoke('order');
  var data = {
    customerID: req.body.customerID,
    orderAmount: req.body.orderAmount,
    shippingAddressID: req.body.shippingAddressID,
    currencyType: req.body.currencyType,
    memo: req.body.memo,
    shoppingCartIdList: req.body.shoppingCartIdList,
    orderItemsJson: req.body.orderItems,
    loginUser: req.body.loginUser
  };

  service.add(data, function (result) {
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
        data: result.content.responseData
      });
    }
  });
});

module.exports = router;
