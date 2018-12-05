$(document).ready(function () {
  let lan = localStorage.getItem('siteLanguage');

  function initPage() {
    setPageLanguage();
    loadDailySale();
    loadHotBrands();
    loadHotItem();
    loadDogPromotionItem();
    loadCatPromotionItem();
  }

  function loadDailySale() {
    $.ajax({
      url: '/index/dailySale',
      type: 'GET',
      success: function(res){
        if(res.err){
          alertResponseError(res.code, res.msg);
        }else{
          let lan = localStorage.getItem('siteLanguage');
          let dailySaleHtml = '';
          let dailySaleParentHtml = '<div class="swiper-slide">\n  <ul>\n{%}</ul>\n</div>\n';
          let dailySaleItemHtml = '';
          let currentDailySaleHtml = '';
          $.each(res.dailySale, function(index, item){
            if(lan === 'cn'){
              currentDailySaleHtml =
                  '  <li>\n' +
                  '    <a href="item?itemID=' + item.itemID + '">\n' +
                  '      <div class="Goodsimg">\n' +
                  '        <img src="' + item.itemImageUrl + '" alt="" width="100%" height="100%" />\n' +
                  '      </div>\n' +
                  '      <p class="lan-cn">' + item.itemShortDescriptionCN + '</p>\n' +
                  '      <div class="price">\n' +
                  '        <span class="lan-cn">￥' + item.snapUpPrice4RMB + '</span>\n' +
                  '        <span class="lan-cn original">￥' + item.unitPrice4RMB + '</span>\n' +
                  '      </div>\n' +
                  '    </a>\n' +
                  '  </li>\n';
            }else{
              currentDailySaleHtml =
                  '  <li>\n' +
                  '    <a href="item?itemID=' + item.itemID + '">\n' +
                  '      <div class="Goodsimg">\n' +
                  '        <img src="' + item.itemImageUrl + '" alt="" width="100%" height="100%" />\n' +
                  '      </div>\n' +
                  '      <p class="lan-en">' + item.itemShortDescriptionEN + '</p>\n' +
                  '      <div class="price">\n' +
                  '        <span class="lan-en">$' + item.snapUpPrice4USD + '</span>\n' +
                  '        <span class="lan-en original">$' + item.unitPrice4USD + '</span>\n' +
                  '      </div>\n' +
                  '    </a>\n' +
                  '  </li>\n';
            }

            if(index === res.dailySale.length - 1){
              dailySaleItemHtml += currentDailySaleHtml;
              dailySaleHtml += dailySaleParentHtml.replace('{%}', dailySaleItemHtml);
              return false;
            }
            if(index % 3 === 0){
              if(dailySaleItemHtml.length > 0){
                dailySaleHtml += dailySaleParentHtml.replace('{%}', dailySaleItemHtml);
              }
              dailySaleItemHtml = currentDailySaleHtml;
            }else{
              dailySaleItemHtml += currentDailySaleHtml;
            }
          });

          $('.daily-sale').append(dailySaleHtml);

          let mySwiper1 = new Swiper('.swiper-container', {
            pagination: '.pagination',
            loop: true,
            grabCursor: true,
            paginationClickable: true
          });

          $('.swiper-button-next').on('click', function(e) {
            e.preventDefault();
            mySwiper1.swipePrev()
          });

          $('.swiper-button-prev').on('click', function(e) {
            e.preventDefault();
            mySwiper1.swipeNext();
          });
        }
      },
      error: function(XMLHttpRequest, textStatus){
        alertRequestError('/index/hotBrands');
      }
    });
  }

  function loadHotBrands() {
    $.ajax({
      url: '/index/hotBrands',
      type: 'GET',
      success: function(res){
        if(res.err){
          alertResponseError(res.code, res.msg);
        }else{
          $.each(res.brandList, function(index, brand){
            if(brand.brandID === 1){
              $('.brandlist ul').append('<li><a href="/itemList?brandID=' + brand.brandID + '"><img src="' + brand.imageSrc + '" width="100%" height="100%" alt="" /></a></li>');
            }
          });
          $.each(res.brandList, function(index, brand){
            if(brand.brandID === 3){
              $('.brandlist ul').append('<li><a href="/itemList?brandID=' + brand.brandID + '"><img src="' + brand.imageSrc + '" width="100%" height="100%" alt="" /></a></li>');
            }
          });
          $.each(res.brandList, function(index, brand){
            if(brand.brandID === 2){
              $('.brandlist ul').append('<li><a href="/itemList?brandID=' + brand.brandID + '"><img src="' + brand.imageSrc + '" width="100%" height="100%" alt="" /></a></li>');
            }
          });

        }
      },
      error: function(XMLHttpRequest, textStatus){
        alertRequestError('/index/hotBrands');
      }
    });
  }

  function loadHotItem() {
    $.ajax({
      url: '/index/hotItem',
      type: 'GET',
      success: function(res){
        if(res.err){
          alertResponseError(res.code, res.msg);
        }else{
          let hotSaleHtml = '';
          let hotSaleParentHtml = '<div class="swiper-slide">\n  <ul>\n{%}</ul>\n</div>\n';
          let hotSaleItemHtml = '';
          let currentHotSaleHtml = '';
          $.each(res.hotSale, function(index, item){
            if(lan === 'cn'){
              currentHotSaleHtml =
                  '  <li>\n' +
                  '    <a href="item?itemID=' + item.itemID + '">\n' +
                  '      <div class="Goodsimg">\n' +
                  '        <img src="' + item.itemImageUrl + '" alt="" width="100%" height="100%" />\n' +
                  '      </div>\n' +
                  '      <p class="lan-cn">' + item.itemShortDescriptionCN + '</p>\n' +
                  '      <div class="price">\n' +
                  '        <span class="lan-cn">￥' + item.unitPrice4RMB + '</span>\n' +
                  '      </div>\n' +
                  '    </a>\n' +
                  '  </li>\n';
            }else{
              currentHotSaleHtml =
                  '  <li>\n' +
                  '    <a href="item?itemID=' + item.itemID + '">\n' +
                  '      <div class="Goodsimg">\n' +
                  '        <img src="' + item.itemImageUrl + '" alt="" width="100%" height="100%" />\n' +
                  '      </div>\n' +
                  '      <p class="lan-en">' + item.itemShortDescriptionEN + '</p>\n' +
                  '      <div class="price">\n' +
                  '        <span class="lan-en">$' + item.unitPrice4USD + '</span>\n' +
                  '      </div>\n' +
                  '    </a>\n' +
                  '  </li>\n';
            }

            if(index === res.hotSale.length - 1){
              hotSaleItemHtml += currentHotSaleHtml;
              hotSaleHtml += hotSaleParentHtml.replace('{%}', hotSaleItemHtml);
              return false;
            }
            if(index % 3 === 0){
              if(hotSaleItemHtml.length > 0){
                hotSaleHtml += hotSaleParentHtml.replace('{%}', hotSaleItemHtml);
              }
              hotSaleItemHtml = currentHotSaleHtml;
            }else{
              hotSaleItemHtml += currentHotSaleHtml;
            }
          });

          $('.hot-sale').append(hotSaleHtml);

          let mySwiper = new Swiper('.swiper-container2', {
            pagination: '.pagination',
            loop: true,
            grabCursor: true,
            paginationClickable: true
          });

          $('.next').on('click', function(e) {
            e.preventDefault();
            mySwiper.swipePrev();
          });

          $('.prev').on('click', function(e) {
            e.preventDefault();
            mySwiper.swipeNext();
          });
        }
      },
      error: function(XMLHttpRequest, textStatus){
        alertRequestError('/index/hotItem');
      }
    });
  }

  function loadDogPromotionItem() {
    $.ajax({
      url: '/index/itemPromotion?category=1',
      type: 'GET',
      success: function(res){
        if(res.err){
          alertResponseError(res.code, res.msg);
        }else{
          let currentPromotionSaleHtml = '';
          $.each(res.data, function(index, item){
            if(lan === 'cn'){
              currentPromotionSaleHtml =
                  '<li>\n' +
                  '  <a href="/item?itemID=' + item.itemID + '">\n' +
                  '    <div class="Goodsimg"><img src="'+ item.itemImageUrl + '" alt="" /></div>\n' +
                  '    <p>' + item.brandCN + item.itemShortDescriptionCN + '</p>\n' +
                  '    <div class="dogs_price">\n' +
                  '      <span class="lan-cn">￥' + item.promotionPrice4RMB + '</span>\n' +
                  '      <span class="lan-cn original">￥' + item.unitPrice4RMB + '</span>\n' +
                  '    </div>\n' +
                  '  </a>\n' +
                  '</li>';
            }else{
              currentPromotionSaleHtml =
                  '<li>\n' +
                  '  <a href="/item?itemID=' + item.itemID + '">\n' +
                  '    <div class="Goodsimg"><img src="'+ item.itemImageUrl + '" alt="" /></div>\n' +
                  '    <p>' + item.brandEN + item.itemShortDescriptionEN + '</p>\n' +
                  '    <div class="dogs_price">\n' +
                  '      <span class="lan-en">$' + item.promotionPrice4USD + '</span>\n' +
                  '      <span class="lan-en original">$' + item.unitPrice4USD + '</span>\n' +
                  '    </div>\n' +
                  '  </a>\n' +
                  '</li>';
            }
            $('.dog-promotion ul').append(currentPromotionSaleHtml);
          });
        }
      },
      error: function(XMLHttpRequest, textStatus){
        alertRequestError('/index/itemPromotion?category=1');
      }
    });
  }

  function loadCatPromotionItem() {
    $.ajax({
      url: '/index/itemPromotion?category=2',
      type: 'GET',
      success: function(res){
        if(res.err){
          alertResponseError(res.code, res.msg);
        }else{
          let currentPromotionSaleHtml = '';
          $.each(res.data, function(index, item){
            if(lan === 'cn'){
              currentPromotionSaleHtml =
                  '<li>\n' +
                  '  <a href="/item?itemID=' + item.itemID + '">\n' +
                  '    <div class="Goodsimg"><img src="'+ item.itemImageUrl + '" alt="" /></div>\n' +
                  '    <p>' + item.brandCN + item.itemShortDescriptionCN + '</p>\n' +
                  '    <div class="dogs_price">\n' +
                  '      <span class="lan-cn">￥' + item.promotionPrice4RMB + '</span>\n' +
                  '      <span class="lan-cn original">￥' + item.unitPrice4RMB + '</span>\n' +
                  '    </div>\n' +
                  '  </a>\n' +
                  '</li>';
            }else{
              currentPromotionSaleHtml =
                  '<li>\n' +
                  '  <a href="/item?itemID=' + item.itemID + '">\n' +
                  '    <div class="Goodsimg"><img src="'+ item.itemImageUrl + '" alt="" /></div>\n' +
                  '    <p>' + item.brandEN + item.itemShortDescriptionEN + '</p>\n' +
                  '    <div class="dogs_price">\n' +
                  '      <span class="lan-en">$' + item.promotionPrice4USD + '</span>\n' +
                  '      <span class="lan-en original">$' + item.unitPrice4USD + '</span>\n' +
                  '    </div>\n' +
                  '  </a>\n' +
                  '</li>';
            }
            $('.cat-promotion ul').append(currentPromotionSaleHtml);
          });
        }
      },
      error: function(XMLHttpRequest, textStatus){
        alertRequestError('/index/itemPromotion?category=2');
      }
    });
  }

  $('.search-content').keydown(function (e) {

    let content = $.trim($('.search-content').val());
    if(e.keyCode === 13 && content !== 0){
      location.href = '/items?itemDes=' + content;
    }
  });
  initPage();
});