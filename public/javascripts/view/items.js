$(document).ready(function () {
  let pageNumber = 1;
  let brandID = $('#hidden-brandID').val();
  let categoryID = $('#hidden-categoryID').val();
  let subCategoryID = $('#hidden-subCategoryID').val();
  let itemDes = $('#hidden-itemDes').val();
  let lan = localStorage.getItem('siteLanguage');

  function initPage() {
    getItemList(brandID, categoryID, subCategoryID, itemDes, pageNumber);
  }

  function getItemListByFuzzy(itemDes) {
    $('.goods_list_items ul').empty();
    getItemList('', '', '', itemDes, 1);
  }

  function getItemList(brandID, categoryID, subCategoryID, itemDes, pageNumber) {
    if($('.goods_list_items ul li').length === 0){
      $('.goods_list_items ul').append(
          '<li class="loading">\n' +
          '  <a href="javascript:;">\n' +
          '    <span class="lan-cn">加载中...</span>\n' +
          '    <span class="lan-en hidden">loading...</span>\n' +
          '  </a>\n' +
          '</li>');
    }
    $.ajax({
      url: '/items/list?brandID=' + brandID + '&categoryID=' + categoryID + '&subCategoryID=' + subCategoryID + '&itemDes=' + itemDes + '&pageNumber=' + pageNumber,
      type: 'GET',
      success: function(res){
        if(res.err){
          alertResponseError(res.code, res.msg);
        }else{
          if(res.itemList === null || res.itemList.length === 0){
            $('.goods_list_items ul li.loading').remove();
            $('.load-more a').addClass('disabled');
            let msg = lan === 'cn'? '没有找到更多满足条件的商品。' : 'There is no item.';
            $('.load-more a').removeClass('disabled');
            $('.load-more a').find('span.lan-cn').text('加载更多' );
            $('.load-more a').find('span.lan-en').text('load more');
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

          $('.goods_list_items ul li.loading').remove();

          $('.goods_list_items ul li.load-more').remove();

          $('.goods_list_items ul').append(
              '<li class="load-more">\n' +
              '  <a href="javascript:;">\n' +
              '    <span class="lan-cn">加载更多</span>\n' +
              '    <span class="lan-en hidden">load more</span>\n' +
              '  </a>\n' +
              '</li>');

          $('.goods_list_items ul li.load-more a').on('click', function() {
            if($(this).hasClass('disabled')){
              return false;
            }
            $(this).addClass('disabled');
            $(this).find('span.lan-cn').text('加载中...' );
            $(this).find('span.lan-en').text('loading...');
            getItemList(brandID, categoryID, subCategoryID, itemDes, ++pageNumber);
          });

          $('.load-more a').removeClass('disabled');
          $('.load-more a').find('span.lan-cn').text('加载更多' );
          $('.load-more a').find('span.lan-en').text('load more');
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