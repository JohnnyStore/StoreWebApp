$(document).ready(function () {
  let nav_w = $(".find_nav_list li").first().width();
  let fl_w = $(".find_nav_list").width();
  let flb_w = $(".find_nav_left").width();
  let loginCustomer = getLoginCustomer();
  let lan = localStorage.getItem('siteLanguage');
  let buyCount = 1;
  let currentBrandId = '';
  let currentCategoryId = '';
  let currentSubCategoryId = '';
  let currentItemGroupId = '';
  let selectedSeriesId = '';
  let selectedColorId = '';
  let selectedSizeId = '';

  function initPage() {
    setCurrentItemParameter();
    setPageLanguage();
    loadItemImages();
    loadItemSeriseList();
    loadItemColorList();
    loadItemSizeList();
    loadItemChooseMemo();
    loadItemReviewList();
    loadShippingAddress();
    setCollection();
  }

  function searchItemReview(level, pageNumber) {
    $.ajax({
      url: '/item/reviewList?itemID=' + $('#hidden-itemID').val() + '&page=' + pageNumber + '&reviewLevel=' + level,
      type: 'GET',
      success: function(resAll){
        if(resAll.err){
          alertResponseError(resAll.code, resAll.msg);
        }else{
          var starHtml = '';

          $.each(resAll.data, function (index, review) {
            starHtml = '';
            for(var i = 1; i <= review.starNum; i++){
              starHtml += '<i class="iconfont icon-xing"></i>\n';
            }

            var reviewer = '';
            if(review.customerName !== null){
              reviewer = review.customerName;
            }else{
              if(review.account === null || review.account === ''){
                review.account = review.cellphone;
              }
              if(review.account.length > 6){
                reviewer = review.account.substr(0, 3) + '***' + review.account.substr(review.account.length-2, 2);
              }else{
                reviewer = review.account.substr(0, 1) + '***';
              }
            }

            $('.product-eval-relative ul').append(
                '<li>\n' +
                '  <div class="eval_head"><img src="images/head.png" width="100%" height="100%" alt="" /></div>\n' +
                '  <div class="eval_text">\n' +
                '    <p>\n' +
                '      <span>' + reviewer + '</span>\n' +
                '      <span>' + review.inDate + '</span>\n' +
                '    </p>\n' +
                '    <p>\n' +
                starHtml +
                '    </p>\n' +
                '    <div class="eval_cont">\n' +
                review.reviewText + '\n' +
                '    </div>\n' +
                '  </div>\n' +
                '</li>');
          });
        }
      },
      error: function(XMLHttpRequest, textStatus){
        alertRequestError('/item/reviewList');
      }
    });
  }

  function loadShippingAddress() {
    let shippingID = $('#hidden-shippingID').val();
    if(shippingID.length > 0){
      $.ajax({
        url: '/addShippingAddress/detail?shippingID=' + shippingID,
        type: 'get',
        success: function (res) {
          if(res.err){
            alertResponseError(res.code, res.msg);
            return false;
          }
          if(res.data === null){
            return false;
          }
          let shippingAddressInfo = '';
          if(lan === 'cn'){
            shippingAddressInfo = res.data.provinceVO.provinceNameCN +
                res.data.cityVO.cityNameCN +
                res.data.shippingStreet +
                res.data.consignee;
          }else{
            shippingAddressInfo = res.data.countryVO.countryNameEN +
                res.data.provinceVO.provinceNameEN +
                res.data.cityVO.cityNameEN +
                res.data.shippingStreet +
                res.data.consignee;
          }
          $('.shipping-address').text(shippingAddressInfo);
        },
        error: function(XMLHttpRequest, textStatus){
          layer.msg(lan === 'cn'? 'Service异常，请稍后再试。' : 'Service error, please try again later.');
        }
      });
    }else{
      $.ajax({
        url: '/common/shippingAddress?customerID=' + loginCustomer.customerID,
        type: 'get',
        success: function (res) {
          if(res.err){
            alertResponseError(res.code, res.msg);
            return false;
          }
          if(res.shippingAddressList.length === 0){

            return false;
          }

          var countryName = '';
          var provinceName = '';
          var cityName = '';
          var address = '';

          $.each(res.shippingAddressList, function (index, shippingAddress) {
            if(shippingAddress.defaultAddress){
              countryName = lan === 'cn'? shippingAddress.countryVO.countryNameCN : shippingAddress.countryVO.countryNameEN;
              provinceName = lan === 'cn'? shippingAddress.provinceVO.provinceNameCN : shippingAddress.provinceVO.provinceNameEN;
              cityName = lan === 'cn'? shippingAddress.cityVO.cityNameCN : shippingAddress.cityVO.cityNameEN;
              address = countryName + provinceName + cityName + shippingAddress.shippingStreet;
              let shippingAddressInfo = '';
              if(lan === 'cn'){
                shippingAddressInfo = shippingAddress.provinceVO.provinceNameCN +
                    shippingAddress.cityVO.cityNameCN +
                    shippingAddress.shippingStreet +
                    shippingAddress.consignee;
              }else{
                shippingAddressInfo = shippingAddress.countryVO.countryNameEN +
                    shippingAddress.provinceVO.provinceNameEN +
                    shippingAddress.cityVO.cityNameEN +
                    shippingAddress.shippingStreet +
                    shippingAddress.consignee;
              }
              $('.shipping-address').text(shippingAddressInfo);
            }
          });
        },
        error: function(XMLHttpRequest, textStatus){
          layer.msg(lan === 'cn'? '网络连接异常，请检查网络设置。' : 'Network connection exception, please check network settings.');
        }
      });
    }
  }

  function loadItemReviewList() {
    $.ajax({
      url: '/item/reviewList?itemID=' + $('#hidden-itemID').val() + '&reviewLevel=A',
      type: 'GET',
      success: function(resAll){
        if(resAll.err){
          alertResponseError(resAll.code, resAll.msg);
        }else{
          var reviewCount = resAll.data.length;
          var goodReviewCount = 0;
          var middleReviewCount = 0;
          var negativeReviewCount = 0;
          var goodPercent = 0;
          var starHtml = '';
          $.each(resAll.data, function (index, review) {
            starHtml = '';
            for(var i = 1; i <= review.starNum; i++){
              starHtml += '<i class="iconfont icon-xing"></i>\n';
            }

            var reviewer = '';
            if(review.customerName !== null){
              reviewer = review.customerName;
            }else{
              if(review.account === null || review.account === ''){
                review.account = review.cellphone;
              }
              if(review.account.length > 6){
                reviewer = review.account.substr(0, 3) + '***' + review.account.substr(review.account.length-2, 2);
              }else{
                reviewer = review.account.substr(0, 1) + '***';
              }
            }

            $('.product-eval-relative ul').append(
                '<li>\n' +
                '  <div class="eval_head"><img src="images/head.png" width="100%" height="100%" alt="" /></div>\n' +
                '  <div class="eval_text">\n' +
                '    <p>\n' +
                '      <span>' + reviewer + '</span>\n' +
                '      <span>' + review.inDate + '</span>\n' +
                '    </p>\n' +
                '    <p>\n' +
                starHtml +
                '    </p>\n' +
                '    <div class="eval_cont">\n' +
                review.reviewText + '\n' +
                '    </div>\n' +
                '  </div>\n' +
                '</li>');

            //好评
            if(review.reviewLevel === 'G'){
              $('.item-review-list-all ul').append(
                  '<li>\n' +
                  '  <div class="eval_head"><img src="images/head.png" width="100%" height="100%" alt="" /></div>\n' +
                  '  <div class="eval_text">\n' +
                  '    <p>\n' +
                  '      <span>' + reviewer + '</span>\n' +
                  '      <span>' + review.inDate + '</span>\n' +
                  '    </p>\n' +
                  '    <p>\n' +
                  starHtml +
                  '    </p>\n' +
                  '    <div class="eval_cont">\n' +
                  review.reviewText + '\n' +
                  '    </div>\n' +
                  '  </div>\n' +
                  '</li>');
              goodReviewCount++;
            }
            //中评
            if(review.reviewLevel === 'N'){
              middleReviewCount++;
            }
            //差评
            if(review.reviewLevel === 'B'){
              negativeReviewCount++;
            }
          });

          if(reviewCount > 0){
            goodPercent = Math.ceil((goodReviewCount / reviewCount) * 100);
          }

          $('.item-review-good-percent').text(goodPercent);

          $('.item-review-count').text('(' + reviewCount + ')');
          $('#goodReviewCount').text('(' + goodReviewCount + ')');
          $('#middleReviewCount').text('(' + middleReviewCount + ')');
          $('#negativeReviewCount').text('(' + negativeReviewCount + ')');
        }
      },
      error: function(XMLHttpRequest, textStatus){
        alertRequestError('/item/reviewList');
      }
    });
  }

  function loadItemChooseMemo() {
    let selectedColor = '';
    let selectedSize = '';
    let selectedNum = $('#cool').val();
    if(lan === 'cn'){
      selectedColor = $('.item-color-list a.selected').find('span.lan-cn').text();
      selectedSize = $('.item-size-list a.selected').find('span.lan-cn').text();
    }else{
      selectedColor = $('.item-color-list a.selected').find('span.lan-en').text();
      selectedSize = $('.item-size-list a.selected').find('span.lan-en').text();
    }
    $('.choose-memo').text(selectedColor + ' ' + selectedSize);
    $('.base-txt .memo').text(selectedColor + ' ' + selectedSize);

    $('.amount').text(selectedNum);
  }

  function setCurrentItemParameter() {
    currentBrandId = $('#hidden-brandID').val();
    currentCategoryId = $('#hidden-categoryID').val();
    currentSubCategoryId = $('#hidden-subCategoryID').val();
    currentItemGroupId = $('#hidden-itemGroupID').val();
    selectedSeriesId = $('#hidden-seriesID').val();
    selectedColorId = $('#hidden-colorID').val();
    selectedSizeId = $('#hidden-sizeID').val();
  }

  function loadItemImages() {
    $.ajax({
      url: '/item/imageList?itemID='+ $('#hidden-itemID').val(),
      type: 'GET',
      success: function(res){
        if(res.err){
          alertResponseError(res.code, res.msg);
        }else{
          //过滤该商品图片的图片组
          $.each(res.data, function(index, image){
            if(image.imageType === 'N' && image.imageSrc.length > 0){
              $('.swiper-wrapper').append(
                  '<div class="swiper-slide">\n' +
                  '  <img src="' + image.imageSrc + '" style="width: 345px;" alt="" />\n' +
                  '</div>');
            }
            if(image.imageType === 'B' && image.imageSrc.length > 0){
              $('.image-detail').append('<img src="' + image.imageSrc + '" alt="" width="100%" height="100%" />');
            }
            if(image.imageType === 'T' && image.imageSrc.length > 0 && $('#spec_image').attr('src').length === 0){
              $('#spec_image').attr('src', image.imageSrc);
            }
          });
          var mySwiper = new Swiper('.swiper-container', {
            pagination: '.pagination',
            loop: true,
            grabCursor: true,
            paginationClickable: true
          });

          $('.arrow-left').on('click', function(e) {
            e.preventDefault();
            mySwiper.swipePrev();
          });

          $('.arrow-right').on('click', function(e) {
            e.preventDefault();
            mySwiper.swipeNext();
          });
        }
      },
      error: function(XMLHttpRequest, textStatus){
        alertRequestError('/item/imageList');
      }
    });
  }

  function loadItemSeriseList() {
    $.ajax({
      url: '/item/seriseList?itemID='+ $('#hidden-itemID').val(),
      type: 'GET',
      success: function(res){
        if(res.err){
          alertResponseError(res.code, res.msg);
        }else{
          //加载当前商品所有的系列
          if(res.data.length === 0){
            $('.item-serise').addClass('hidden');
            return false;
          }
          $.each(res.data, function(index, current){
            $('.item-serise-list').append(
                '<a data-id = "' + current.seriesID + '">\n' +
                '  <span class="lan-cn">' + current.itemSeriesCN + '</span>\n' +
                '  <span class="lan-en hidden">' + current.itemSeriesEN + '</span>\n' +
                '</a>');
          });

          //给当前商品的系列追加事件，使其具有选中效果
          $(".item-serise-list").on("click", "a", function() {
            $('.item-serise-list a').removeClass('selected');
            $(this).addClass('selected');
            selectedSeriesId = $(this).attr('data-id');

            //根据当前选中系列，加载对应的颜色列表
            loadItemColorList();
            selectedColorId = $('.item-color-list a').eq(0).attr('data-id');

            loadItemSizeList();
            selectedSizeId = $('.item-size-list a').eq(0).attr('data-id');

            reloadItemInfo();
          });

          //在所有的系列中，选中当前商品的系列
          $('.item-serise-list a').each(function (index, obj) {
            if($(obj).attr('data-id') === $('#hidden-seriesID').val()){
              $(obj).addClass('selected');
            }
          })
        }
      },
      error: function(XMLHttpRequest, textStatus){
        alertRequestError('/item/seriseList');
      }
    });
  }

  function loadItemColorList() {
    $.ajax({
      url: '/item/colorList?itemID='+ $('#hidden-itemID').val() + '&seriesID=' + selectedSeriesId,
      type: 'GET',
      async:false,
      success: function(res){
        if(res.err){
          alertResponseError(res.code, res.msg);
        }else{
          //加载当前商品所有的颜色
          $('.item-color-list').empty();
          $.each(res.data, function(index, current){
            $('.item-color-list').append(
                '<a data-id = "' + current.colorID + '">\n' +
                '  <span class="lan-cn">' + current.colorCN + '</span>\n' +
                '  <span class="lan-en hidden">' + current.colorEN + '</span>\n' +
                '</a>');
          });
          //给当前商品的颜色追加事件，使其具有选中效果
          $(".item-color-list").on("click", "a", function() {
            $('.item-color-list a').removeClass('selected');
            $(this).addClass('selected');
            selectedColorId = $(this).attr('data-id');

            loadItemSizeList();
            selectedSizeId = $('.item-size-list a').eq(0).attr('data-id');

            reloadItemInfo();
          });

          //在所有的颜色中，选中当前商品的颜色
          $('.item-color-list a').each(function (index, obj) {
            if($(obj).attr('data-id') === $('#hidden-colorID').val()){
              $(obj).addClass('selected');
            }
          })
        }
      },
      error: function(XMLHttpRequest, textStatus){
        alertRequestError('/item/colorList');
      }
    });
  }

  function loadItemSizeList() {
    $.ajax({
      url: '/item/sizeList?itemID='+ $('#hidden-itemID').val() + '&seriesID=' + selectedSeriesId + '&colorID=' + selectedColorId,
      type: 'GET',
      async:false,
      success: function(res){
        if(res.err){
          alertResponseError(res.code, res.msg);
        }else{
          //加载当前商品所有的尺码
          $('.item-size-list').empty();
          $.each(res.data, function(index, current){
            $('.item-size-list').append(
                '<a data-id = "' + current.sizeID + '">\n' +
                '  <span class="lan-cn">' + current.sizeCN + '</span>\n' +
                '  <span class="lan-en hidden">' + current.sizeEN + '</span>\n' +
                '</a>');
          });

          //给当前商品的尺码追加事件，使其具有选中效果
          $(".item-size-list").on("click", "a", function() {
            $('.item-size-list a').removeClass('selected');
            $(this).addClass('selected');
            selectedSizeId = $(this).attr('data-id');

            reloadItemInfo();
          });

          //在所有的尺码中，选中当前商品的尺码
          $('.item-size-list a').each(function (index, obj) {
            if($(obj).attr('data-id') === $('#hidden-sizeID').val()){
              $(obj).addClass('selected');
            }
          })
        }
      },
      error: function(XMLHttpRequest, textStatus){
        alertRequestError('/item/sizeList');
      }
    });
  }

  function reloadItemInfo() {
    location.href = '/item?brandID=' + currentBrandId +
        '&categoryID=' + currentCategoryId +
        '&subCategoryID=' + currentSubCategoryId +
        '&itemGroupID=' + currentItemGroupId +
        '&seriesID=' + selectedSeriesId +
        '&colorID=' + selectedColorId +
        '&sizeID=' + selectedSizeId;
  }

  function setCollection() {
    let itemID = $('#hidden-itemID').val();
    if(loginCustomer === null || loginCustomer.length === 0){
      return false;
    }
    $.ajax({
      url: '/item/collection?customerID=' + loginCustomer.customerID + '&itemID=' + itemID,
      type: 'get',
      success: function(res){
        if(res.err){
          alertResponseError(res.code, res.msg);
        }else{
          if(res.data !== null && res.data.length > 0){
            $('#btn-Collection').addClass('collected');
          }
        }
      },
      error: function(XMLHttpRequest, textStatus){
        alertRequestError('/item/collection');
      }
    });
  }

  function addCollection(){
    let itemID = $('#hidden-itemID').val();
    let loginCustomer = getLoginCustomer();
    if(loginCustomer === null || loginCustomer.length === 0){
      let msg = lan === 'cn' ? '请先登陆。' : 'Please login first.';
      layer.msg(msg);
      return false;
    }

    $.ajax({
      url: '/item/collection',
      type: 'post',
      dataType: 'json',
      data:{
        itemID: itemID,
        customerID: loginCustomer.customerID,
        loginUser: loginCustomer.cellphone
      },
      success: function(res){
        if(res.err){
          alertResponseError(res.code, res.msg);
        }else{
          $('#btn-Collection').addClass('collected');
          layer.msg('已收藏');
        }
      },
      error: function(XMLHttpRequest, textStatus){
        alertRequestError('/item/collection');
      }
    });
  }

  function delCollection(){
    let itemID = $('#hidden-itemID').val();
    let loginCustomer = getLoginCustomer();
    if(loginCustomer === null || loginCustomer.length === 0){
      let msg = lan === 'cn' ? '请先登陆。' : 'Please login first.';
      layer.msg(msg);
      return false;
    }

    $.ajax({
      url: '/item/collection?itemID=' + itemID,
      type: 'delete',
      success: function(res){
        if(res.err){
          alertResponseError(res.code, res.msg);
        }else{
          $('#btn-Collection').removeClass('collected');
          layer.msg('已取消收藏');
        }
      },
      error: function(XMLHttpRequest, textStatus){
        alertRequestError('/item/collection');
      }
    });
  }

  $('.choose-shipping-address a').click(function () {
    let itemBackUrl = location.pathname + location.search;
    localStorage.setItem("itemBackUrl", itemBackUrl);
    location.href = '/shippingAddress';
  });

  $('#btn-review-all').click(function () {
    if($(this).hasClass('selected')){
      return false;
    }
    $('.product-eval-relative ul').empty();
    searchItemReview('A', 1);
  });

  $('#btn-review-good').click(function () {
    if($(this).hasClass('selected')){
      return false;
    }
    $('.product-eval-relative ul').empty();
    searchItemReview('G', 1);
  });

  $('#btn-review-middle').click(function () {
    if($(this).hasClass('selected')){
      return false;
    }
    $('.product-eval-relative ul').empty();
    searchItemReview('N', 1);
  });

  $('#btn-addToCart').click(function () {
    var itemID = $('#hidden-itemID').val();
    var shoppingCount = buyCount;

    if(loginCustomer === null){
      layer.msg(lan === 'cn'? '请先登陆' : 'Please login first.');
      return false;
    }

    $.ajax({
      url: '/item/shoppingCart',
      type: 'post',
      dataType: 'json',
      data:{
        itemID: itemID,
        customerID: loginCustomer.customerID,
        shoppingCount: shoppingCount,
        loginUser: loginCustomer.account
      },
      success: function(res){
        if(res.err){
          alertResponseError(res.code, res.msg);
        }else{
          location.href = '/shoppingCart';
        }
      },
      error: function(XMLHttpRequest, textStatus){
        alertRequestError('/item/shoppingCart');
      }
    });
  });
  
  $('#btn-review-negative').click(function () {
    if($(this).hasClass('selected')){
      return false;
    }
    $('.product-eval-relative ul').empty();
    searchItemReview('B', 1);
  });

  $('#btn-Collection').click(function () {
    if($(this).hasClass('collected')){
      delCollection();
    }else{
      addCollection();
    }
  });

  $(".sideline").width(nav_w);

  $(".find_nav_list").css("left", 0);

  $(".find_nav_list li").each(function() {
    $(".sideline").css({
      left: 0
    });
    $(".find_nav_list li").eq(0).addClass("find_nav_cur").siblings().removeClass("find_nav_cur");
  });

  $(".find_nav_list li").on('click', function() {
    nav_w = $(this).width();
    $(".sideline").stop(true);
    $(".sideline").animate({
      left: $(this).position().left
    }, 300);
    $(".sideline").animate({
      width: nav_w
    });
    $(this).addClass("find_nav_cur").siblings().removeClass("find_nav_cur");
    var fn_w = ($(".find_nav").width() - nav_w) / 2;
    var fnl_l;
    var fnl_x = parseInt($(this).position().left);
    if(fnl_x <= fn_w) {
      fnl_l = 0;
    } else if(fn_w - fnl_x <= flb_w - fl_w) {
      fnl_l = flb_w - fl_w;
    } else {
      fnl_l = fn_w - fnl_x;
    }
    $(".find_nav_list").animate({
      "left": fnl_l
    }, 300);

  });

  $(".find_nav_list").on('touchstart', function(e) {
    var touch1 = e.originalEvent.targetTouches[0];
    x1 = touch1.pageX;
    y1 = touch1.pageY;
    ty_left = parseInt($(this).css("left"));
  });

  $(".find_nav_list").on('touchmove', function(e) {
    var touch2 = e.originalEvent.targetTouches[0];
    var x2 = touch2.pageX;
    var y2 = touch2.pageY;
    if(ty_left + x2 - x1 >= 0) {
      $(this).css("left", 0);
    } else if(ty_left + x2 - x1 <= flb_w - fl_w) {
      $(this).css("left", flb_w - fl_w);
    } else {
      $(this).css("left", ty_left + x2 - x1);
    }
    if(Math.abs(y2 - y1) > 0) {
      e.preventDefault();
    }
  });

  for(let n = 1; n < 9; n++) {
    var page = 'pagenavi' + n;
    var mslide = 'slider' + n;
    var mtitle = 'emtitle' + n;
    arrdiv = 'arrdiv' + n;
    var as = $('#' + page).find('a');
    var tt = new TouchSlider({
      id: mslide,
      'auto': '-1',
      fx: 'ease-out',
      direction: 'left',
      speed: 600,
      timeout: 5000,
      'before': function(index) {
        var as = document.getElementById(this.page).getElementsByTagName('a');
        as[this.p].className = '';
        this.p = index;

        fnl_x = parseInt($(".find_nav_list li").eq(this.p).position().left);

        nav_w = $(".find_nav_list li").eq(this.p).width();
        $(".sideline").stop(true);
        $(".sideline").animate({
          left: $(".find_nav_list li").eq(this.p).position().left
        }, 300);
        $(".sideline").animate({
          width: nav_w
        }, 100);
        $(".find_nav_list li").eq(this.p).addClass("find_nav_cur").siblings().removeClass("find_nav_cur");
        var fn_w = ($(".find_nav").width() - nav_w) / 2;
        var fnl_l;
        if(fnl_x <= fn_w) {
          fnl_l = 0;
        } else if(fn_w - fnl_x <= flb_w - fl_w) {
          fnl_l = flb_w - fl_w;
        } else {
          fnl_l = fn_w - fnl_x;
        }
        $(".find_nav_list").animate({
          "left": fnl_l
        }, 300);
      }
    });
    tt.page = page;
    tt.p = 0;


    for(var i = 0; i < as.length; i++) {
      (function() {
        var j = i;
        as[j].tt = tt;
        as[j].onclick = function() {
          this.tt.slide(j);
          return false;
        }
      })();
    }
  }

  //加号
  $(".jia").click(function() {

    var $parent = $(this).parent(".num");
    var $num = window.Number($(".inputBorder", $parent).val());
    $(".inputBorder", $parent).val($num + 1);
    buyCount = $num + 1;
    $('.amount').html($num + 1)

  });

  //减号
  $(".jian").click(function() {
    var $parent = $(this).parent(".num");
    var $num = window.Number($(".inputBorder", $parent).val());
    if($num >= 2) {
      $(".inputBorder", $parent).val($num - 1);
      $('.amount').html($num - 1);
      buyCount = $num - 1;
    } else {
      $(".inputBorder", $parent).val(1);
      $('.amount').html($num);
      buyCount = $num;
    }
  });

  $(".clickwn").click(function() {
    $(".flick-menu-mask").show();
    $(".spec-menu").show();
  });

  $(".tclck").click(function() {
    $(".flick-menu-mask").hide();
    $(".spec-menu").hide();
  });

  $('#cool').bind('input propertychange', function() {
    $('.amount').html(this.value)

  }).bind('input input', function() {

  });

  $('#evalution a').click(function() {
    var cook = $(this).index();
    $('#evalution a').eq(cook).addClass('selected').siblings().removeClass('selected');
  });

  initPage();
});