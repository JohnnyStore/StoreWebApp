let express = require('express');
let categoryData = require('../service/commonData');
let router = express.Router();

router.get('/', function(req, res, next) {
  categoryData.getCommonData(req, res, function(commonResult){
    if(commonResult.err){
      res.render('error', {
        title: '网站出错啦',
        errorCode: commonResult.code,
        errorMsg: commonResult.msg
      });
    }else{
      res.render('itemCategory', {
        title: '商品分类',
        brandList: commonResult.navigate.brandList,
        categoryList: commonResult.navigate.navigateCategoryList
      });
    }
  });
});


module.exports = router;
