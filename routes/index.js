let express = require('express');
let commonService = require('../service/commonService');
let sysConfig = require('../config/sysConfig');
let router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', {title: '主页'});
});

router.get('/dailySale', function(req, res, next) {
  let service = new commonService.commonInvoke('dailySnapUp');
  service.get('', function (result) {
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
        dailySale: result.content.responseData.dailySnapUpOfToday
      });
    }
  });
});

router.get('/hotBrands', function(req, res, next) {
  let service = new commonService.commonInvoke('brand');
  service.getPageData('1', function (result) {
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
        brandList: result.content.responseData
      });
    }
  });
});

router.get('/fuzzySearch', function(req, res, next) {
  let service = new commonService.commonInvoke('fuzzySearch');
  let itemDes = req.query.itemDes;
  let pageNumber = req.query.pageNumber;
  let pageSize = sysConfig.pageSize;
  if(pageNumber === undefined){
    pageNumber = 1;
  }

  let parameter = pageNumber + '/' + pageSize + '/' + itemDes;

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

router.get('/hotItem', function(req, res, next) {
  let service = new commonService.commonInvoke('itemHot');

  service.get('', function (result) {
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
        hotSale: result.content.responseData
      });
    }
  });
});

router.get('/itemPromotion', function(req, res, next) {
  let service = new commonService.commonInvoke('itemPromotion');
  let categoryID = req.query.category;
  service.get(categoryID, function (result) {
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

module.exports = router;
