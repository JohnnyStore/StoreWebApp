let express = require('express');
let sysConfig = require('../config/sysConfig');
let commonService = require('../service/commonService');
let router = express.Router();

router.get('/', function(req, res, next) {
  res.render('items', {
    title: '商品列表',
    brandID: req.query.brandID,
    categoryID: req.query.categoryID,
    subCategoryID: req.query.subCategoryID,
    itemDes: req.query.itemDes,
  });
});

router.get('/list', function(req, res, next) {
  let pageNumber = req.query.pageNumber;
  let brandID = req.query.brandID;
  let categoryID = req.query.categoryID;
  let subCategoryID = req.query.subCategoryID;
  let itemDes = req.query.itemDes;
  let service = null;
  let parameter = '';

  if(pageNumber === undefined){
    pageNumber = 1;
  }
  if(brandID === undefined || brandID === '' || brandID === 'all'){
    brandID = 0;
  }
  if(categoryID === undefined || categoryID === '' || categoryID === 'all'){
    categoryID = 0;
  }
  if(subCategoryID === undefined || subCategoryID === '' || subCategoryID === 'all'){
    subCategoryID = 0;
  }

  if(itemDes !== undefined && itemDes !== ''){
    service = new commonService.commonInvoke('fuzzySearch');
    parameter = pageNumber + '/' + sysConfig.pageSize + '/' + itemDes;
  }else{
    service = new commonService.commonInvoke('salesItem');
    parameter = pageNumber + '/' + sysConfig.pageSize + '/' + brandID + '/' + categoryID + '/' + subCategoryID;
  }

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
        msg: result.content.responseMessage,
        itemList: result.content.responseData
      });
    }
  });
});

module.exports = router;
