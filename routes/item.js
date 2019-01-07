var express = require('express');
var commonService = require('../service/commonService');
var sysConfig = require('../config/sysConfig');
var router = express.Router();

router.get('/', function(req, res, next) {
  var itemId = req.query.itemID;
  var brandId = req.query.brandID;
  var categoryId = req.query.categoryID;
  var subCategoryId = req.query.subCategoryID;
  var itemGroupId = req.query.itemGroupID;
  var seriesID = req.query.seriesID;
  var colorID = req.query.colorID;
  var sizeID = req.query.sizeID;
  var shippingID = req.query.shippingID;
  var parameter = '';
  var service = null;

  if(itemId !== undefined){
    parameter = '/' + itemId;
    service = new commonService.commonInvoke('itemDetail');
  }else{
    parameter = '/' + brandId + '/' + categoryId + '/' + subCategoryId + '/' + itemGroupId + '/' + seriesID + '/' + colorID + '/' + sizeID;
    service = new commonService.commonInvoke('item');
  }

  service.get(parameter, function (result) {
    if(result.err){
      res.render('error', {
        title: '网站出错啦',
        errorCode: result.code,
        errorMsg: result.msg
      });
    }else{
      if(result.content.responseData === null){
        res.render('item', {
          title: '商品详细信息'
        });
      }else{
        res.render('item', {
          title: '商品详细信息',
          shippingID: shippingID,
          itemDetail: result.content.responseData
        });
      }
    }
  });
});

router.get('/seriseList', function(req, res, next) {
  var itemId = req.query.itemID;
  var service = new commonService.commonInvoke('seriesList4Item');
  service.get(itemId, function (result) {
    if(result.err){
      res.json({
        err: true,
        code: result.code,
        msg: result.msg
      });
    }else{
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage,
        data: result.content.responseData
      });
    }
  });
});

router.get('/colorList', function(req, res, next) {
  var itemId = req.query.itemID;
  var seriesID = req.query.seriesID;
  var parameter = itemId + '/' + seriesID;
  var service = new commonService.commonInvoke('colorList4Item');
  service.get(parameter, function (result) {
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

router.get('/sizeList', function(req, res, next) {
  var itemId = req.query.itemID;
  var seriesID = req.query.seriesID;
  var colorID = req.query.colorID;
  var parameter = itemId + '/' + seriesID + '/' + colorID;
  var service = new commonService.commonInvoke('sizeList4Item');
  service.get(parameter, function (result) {
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

router.get('/imageList', function(req, res, next) {
  var parameter = req.query.itemID + '/' + 'I';
  var service = new commonService.commonInvoke('imageList4Item');
  service.get(parameter, function (result) {
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

router.get('/reviewList', function(req, res, next) {
  var itemID = req.query.itemID;
  var reviewLevel = req.query.reviewLevel;
  var pageNumber = req.query.page;
  var pageSize = sysConfig.pageSize;
  if(pageNumber === undefined){
    pageNumber = 1;
  }
  var parameter = pageNumber + '/' + pageSize + '/' + itemID + '/' + reviewLevel;
  var service = new commonService.commonInvoke('itemReview');
  service.get(parameter, function (result) {
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

router.get('/collection', function(req, res, next) {
  let customerID = req.query.customerID;
  let itemID = req.query.itemID;
  let status = 'I';
  let parameter = customerID + '/' + itemID + '/' + status;
  let service = new commonService.commonInvoke('collection4Item');

  service.get(parameter, function (result) {
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

router.post('/collection', function (req, res, next) {
  var service = new commonService.commonInvoke('collection');
  var data = {
    itemID: req.body.itemID,
    customerID: req.body.customerID,
    status: req.body.status,
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

router.delete('/collection', function (req, res, next) {
  var service = new commonService.commonInvoke('collection');

  service.delete(req.query.itemID, function (result) {
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

router.post('/shoppingCart', function (req, res, next) {
  var service = new commonService.commonInvoke('shoppingCart');
  var data = {
    itemID: req.body.itemID,
    customerID: req.body.customerID,
    shoppingCount: req.body.shoppingCount,
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

module.exports = router;
