var express = require('express');
var commonService = require('../service/commonService');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var service = new commonService.commonInvoke('shoppingCart4Customer');
  var customerId = req.cookies['loginCustomerID'];
  var parameter = customerId + '/A';
  service.get(parameter, function (result) {
    if(result.err){
      res.render('shoppingCart', {
        title: '购物车',
        err: true
      });
    }else{
      res.render('shoppingCart', {
        title: '购物车',
        err: !result.content.result,
        shoppingCartList: result.content.responseData
      });
    }
  });
});

router.put('/resetStatus', function (req, res, next) {
  var service = new commonService.commonInvoke('resetShoppingCartStatus4Customer');
  var data = {
    shoppingCartID: req.body.shoppingCartID,
    itemID: req.body.itemID,
    customerID: req.body.customerID,
    shoppingCount: req.body.shoppingCount,
    status: req.body.status,
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

router.put('/', function (req, res, next) {
  var service = new commonService.commonInvoke('shoppingCart');
  var data = {
    shoppingCartID: req.body.shoppingCartID,
    itemID: req.body.itemID,
    customerID: req.body.customerID,
    shoppingCount: req.body.shoppingCount,
    status: req.body.status,
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

router.delete('/', function (req, res, next) {
  var service = new commonService.commonInvoke('shoppingCart');
  var shoppingCarID = req.query.shoppingCarID;

  service.delete(shoppingCarID, function (result) {
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
