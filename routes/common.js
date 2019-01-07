var express = require('express');
var commonService = require('../service/commonService');
var router = express.Router();

router.get('/isAdmin', function(req, res, next) {
  var service = new commonService.commonInvoke('administratorCellphone');
  var cellphone = req.query.cellphone;
  service.get(cellphone, function (result) {
    if(result.err || !result.content.result){
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
        isAdmin: result.content.responseData
      });
    }
  });
});

router.get('/brand', function(req, res, next) {
  var service = new commonService.commonInvoke('brand');
  service.getAll(function (result) {
    if(result.err || !result.content.result){
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
        brandList: result.content.responseData
      });
    }
  });
});

router.get('/category', function(req, res, next) {
  var service = new commonService.commonInvoke('category');
  service.getAll(function (result) {
    if(result.err || !result.content.result){
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
        categoryList: result.content.responseData
      });
    }
  });
});

router.get('/subCategory', function(req, res, next) {
  var categoryID = req.query.categoryID;
  var service = new commonService.commonInvoke('subCategoryDistinct');
  service.get(categoryID, function (result) {
    if(result.err || !result.content.result){
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
        subCategoryList: result.content.responseData
      });
    }
  });
});

router.get('/country', function(req, res, next) {
  var service = new commonService.commonInvoke('country');
  service.get('', function (result) {
    if(result.err || !result.content.result){
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
        countryList: result.content.responseData
      });
    }
  });
});

router.get('/province', function(req, res, next) {
  var countryID = req.query.countryID;
  var service = new commonService.commonInvoke('provinceForCountry');
  service.get(countryID, function (result) {
    if(result.err || !result.content.result){
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
        provinceList: result.content.responseData
      });
    }
  });
});

router.get('/city', function(req, res, next) {
  var countryID = req.query.countryID;
  var provinceID = req.query.provinceID;
  var parameter = countryID + '/' + provinceID;
  var service = new commonService.commonInvoke('city4Province');
  service.get(parameter, function (result) {
    if(result.err || !result.content.result){
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
        cityList: result.content.responseData
      });
    }
  });
});
router.get('/shippingAddress', function(req, res, next) {
  var customerID = req.query.customerID;
  var service = new commonService.commonInvoke('shippingAddress4Customer');
  service.get(customerID, function (result) {
    if(result.err || !result.content.result){
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
        shippingAddressList: result.content.responseData
      });
    }
  });
});

module.exports = router;