var express = require('express');
var commonService = require('../service/commonService');
var sysConfig = require('../config/sysConfig');
var router = express.Router();

router.get('/', function(req, res, next) {
  var service = new commonService.commonInvoke('orderHistory');
  var customerId = req.cookies['loginCustomerID'];
  var pageNumber = req.query.pageNumber;
  var pageSize = sysConfig.pageSize;
  var recentMonth = 12;
  var orderStatus = req.query.orderStatus;

  if(pageNumber === undefined) {
    pageNumber = 1;
  }

  if(recentMonth === undefined) {
    recentMonth = 3;
  }

  if(orderStatus === undefined) {
    orderStatus = 'N';
  }

  var parameter = pageNumber + '/' + pageSize + '/' + customerId + '/' + recentMonth + '/' + orderStatus;

  service.get(parameter, function (result) {
    if(result.err){
      res.render('error', {
        title: '网站出错啦',
        error: true,
        errorCode: result.code,
        errorMsg: result.msg
      });
    }else{
      if(result.content.responseData === null){
        res.render('myorder', {
          title: '我的订单',
          error: !result.content.result,
          pageNumber: pageNumber,
          orderStatus: orderStatus,
          totalCount: 0,
          toPayOrderCount: 0,
          toReceiveOrderCount: 0,
          toReviewOrderCount: 0,
          pageSize: 0
        });
      }else{
        result.content.responseData.forEach(function (data, index) {
          data.currencySymbol = data.currencyType === 'CNY'? '¥' : '$';
          data.currencySymbol = data.currencyType === 'CNY'? '¥' : '$';
          switch (data.orderStatus){
            case 'O':
              data.isWaitPay = true;
              break;
            case 'E':
              data.isExpired = true;
              break;
            case 'P':
              data.isWaitDelivery = true;
              break;
            case 'C':
              data.isCanceled = true;
              break;
            case 'S':
              data.isShipping = true;
              break;
            case 'R':
              data.isRefunded = true;
              break;
            case 'F':
              data.isCompleted = true;
              break;
          }
        });
        res.render('myorder', {
          title: '我的订单',
          pageNumber: pageNumber,
          error: !result.content.result,
          orderStatus: orderStatus,
          totalCount: result.content.totalCount > 99 ? '99+' : result.content.totalCount,
          toPayOrderCount: result.content.toPayOrderCount > 99 ? '99+' : result.content.toPayOrderCount,
          toReceiveOrderCount: result.content.toReceiveOrderCount > 99 ? '99+' : result.content.toReceiveOrderCount,
          toReviewOrderCount: result.content.toReviewOrderCount > 99 ? '99+' : result.content.toReviewOrderCount,
          pageSize: pageSize,
          orderList: result.content.responseData
        });
      }
    }
  });
});

router.post('/addItemReview', function (req, res, next) {
  var service = new commonService.commonInvoke('addItemReview');
  var data = {
    customerID: req.body.customerID,
    itemID: req.body.itemID,
    starNum: req.body.starNum,
    reviewLevel: req.body.reviewLevel,
    reviewText: req.body.reviewText,
    reviewStatus: req.body.reviewStatus,
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
        data: result.content
      });
    }
  });
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
