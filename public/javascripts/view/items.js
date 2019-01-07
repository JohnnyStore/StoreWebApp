$(document).ready(function () {
  let n=0;
  let pageNumber = 1;
  let lan = localStorage.getItem('siteLanguage');

  // let refreshBox=new PullToRefresh({
  //   container:"#app",
  //   pull:{
  //     callback:function(){
  //       // setTimeout(function(){
  //       //   n=0;
  //       //   addhtml("html");
  //       //   refreshBox.endPullRefresh(true)
  //       // },1000)
  //     }
  //   },
  //   up:{
  //     //上滑
  //     callback:function(){
  //       let brandID = $('#hidden-brandID').val();
  //       let categoryID = $('#hidden-categoryID').val();
  //       let subCategoryID = $('#hidden-subCategoryID').val();
  //       let itemDes = $('#hidden-itemDes').val();
  //
  //       //getItemList(brandID, categoryID, subCategoryID, itemDes, pageNumber++);
  //
  //       // setTimeout(function(){
  //       //   if(n<5){
  //       //     n++;
  //       //     addhtml("append");
  //       //     refreshBox.endUpLoading(true)
  //       //   }else{
  //       //     //没有数据
  //       //     //refreshBox.endUpLoading(false)
  //       //   }
  //       // },1000)
  //     }
  //   }
  // });

  function initPage() {
    let brandID = $('#hidden-brandID').val();
    let categoryID = $('#hidden-categoryID').val();
    let subCategoryID = $('#hidden-subCategoryID').val();
    let itemDes = $('#hidden-itemDes').val();

    getItemList(brandID, categoryID, subCategoryID, itemDes, pageNumber);
  }

  function getItemListByFuzzy(itemDes) {
    $('.goods_list_items ul').empty();
    getItemList('', '', '', itemDes, 1);
  }

  function getItemList(brandID, categoryID, subCategoryID, itemDes, pageNumber) {
    $.ajax({
      url: '/items/list?brandID=' + brandID + '&categoryID=' + categoryID + '&subCategoryID=' + subCategoryID + '&itemDes=' + itemDes + '&pageNumber=' + pageNumber,
      type: 'GET',
      success: function(res){
        if(res.err){
          alertResponseError(res.code, res.msg);
        }else{
          if(res.itemList.length === 0){
            let msg = lan === 'cn'? '没有查询到满足条件的商品。' : 'There is no item.';
            layer.msg(msg);
            return false;
          }
          let currentItemHtml = '';
          $.each(res.itemList, function(index, item){
            if(lan === 'cn'){
              if(item.hasDiscount){
                currentItemHtml ='' +
                    '<li>\n' +
                    '  <a href="/item?itemID=' + item.itemID + '">\n' +
                    '    <div class="goodslist_img">\n' +
                    '      <img src="' + item.itemImageUrl + '" width="100%" height="100%" alt="" />\n' +
                    '    </div>\n' +
                    '    <div class="goods_text">\n' +
                    '      <p>' + item.brandCN + item.itemShortDescriptionCN + item.colorCN + item.sizeCN + '</p>\n' +
                    '      <h6>￥' + item.salesPrice4RMB + '<span>' + item.unitPrice4RMB + '</span></h6>\n' +
                    '      <div class="addshoping"><i class="iconfont icon-gouwuche1"></i></div>\n' +
                    '    </div>\n' +
                    '  </a>\n' +
                    '</li>';
              }else{
                currentItemHtml ='' +
                    '<li>\n' +
                    '  <a href="/item?itemID=' + item.itemID + '">\n' +
                    '    <div class="goodslist_img">\n' +
                    '      <img src="' + item.itemImageUrl + '" width="100%" height="100%" alt="" />\n' +
                    '    </div>\n' +
                    '    <div class="goods_text">\n' +
                    '      <p>' + item.brandCN + item.itemShortDescriptionCN + item.colorCN + item.sizeCN + '</p>\n' +
                    '      <h6>￥' + item.salesPrice4RMB + '</h6>\n' +
                    '      <div class="addshoping"><i class="iconfont icon-gouwuche1"></i></div>\n' +
                    '    </div>\n' +
                    '  </a>\n' +
                    '</li>';
              }

            }else{
              if(item.hasDiscount){
                currentItemHtml =
                    '<li>\n' +
                    '  <a href="/item?itemID=' + item.itemID + '">\n' +
                    '    <div class="goodslist_img">\n' +
                    '      <img src="' + item.itemImageUrl + '" width="100%" height="100%" alt="" />\n' +
                    '    </div>\n' +
                    '    <div class="goods_text">\n' +
                    '      <p>' + item.brandEN + item.itemShortDescriptionEN + item.colorEN + item.sizeEN + '</p>\n' +
                    '      <h6>$' + item.salesPrice4USD + '<span>' + item.unitPrice4USD + '</span></h6>\n' +
                    '      <div class="addshoping"><i class="iconfont icon-gouwuche1"></i></div>\n' +
                    '    </div>\n' +
                    '  </a>\n' +
                    '</li>';
              }else{
                currentItemHtml =
                    '<li>\n' +
                    '  <a href="/item?itemID=' + item.itemID + '">\n' +
                    '    <div class="goodslist_img">\n' +
                    '      <img src="' + item.itemImageUrl + '" width="100%" height="100%" alt="" />\n' +
                    '    </div>\n' +
                    '    <div class="goods_text">\n' +
                    '      <p>' + item.brandEN + item.itemShortDescriptionEN + item.colorEN + item.sizeEN + '</p>\n' +
                    '      <h6>$' + item.salesPrice4USD + '</h6>\n' +
                    '      <div class="addshoping"><i class="iconfont icon-gouwuche1"></i></div>\n' +
                    '    </div>\n' +
                    '  </a>\n' +
                    '</li>';
              }

            }
            $('.goods_list_items ul').append(currentItemHtml);
          });
        }
      },
      error: function(XMLHttpRequest, textStatus){
        alertRequestError('/items/list?brandID=' + brandID + '&categoryID=' + categoryID + '&subCategoryID=' + subCategoryID + '&itemDes' + itemDes + '&pageNumber=' + pageNumber);
      }
    });
  }

  $('.btn-search').click(function () {
    let content = $.trim($('.search-content').val());
    if(content.length === 0){
      return false;
    }
    getItemListByFuzzy(content);
  });


  initPage();
});