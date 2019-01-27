$(document).ready(function () {
  let nav_w = $(".find_nav_list li").first().width();
  // var fl_w = $(".find_nav_list").width();
  // var flb_w = $(".find_nav_left").width();
  let lan = localStorage.getItem('siteLanguage');
  let loginCustomer = getLoginCustomer();
  let orderStatus = $('#hidden-orderStatus').val();
  let pageNumber = parseInt($('#hidden-pageNumber').val());
  let pageSize = parseInt($('#hidden-pageSize').val());

  function initPage(){
    let login = $('#hidden-login').val();
    let error = $('#hidden-error').val();
    if(login === 'true'){
      location.href = '/login?targetUrl=/myOrder';
      return false;
    }
    if(error === 'true'){
      layer.msg(lan === 'cn'? '系统异常，请稍后再试。' : 'System error, please try again later.');
      return false;
    }
    setPageLanguage();
    setCurrentTab();
    setPaging();
  }
  
  function setCurrentTab(){
    let orderStatus = $('#hidden-orderStatus').val();
    switch (orderStatus){
      case 'N':
        $('.find_nav_list ul li').removeClass('find_nav_cur');
        $('.find_nav_list ul li a').removeClass('active');
        $('.find_nav_list ul li').eq(0).addClass('find_nav_cur');
        $('.find_nav_list ul li').eq(0).find('a').addClass('active');
        $('li.sideline').css({"left":"0px","width":"94px"});
        break;
      case 'O':
        $('.find_nav_list ul li').removeClass('find_nav_cur');
        $('.find_nav_list ul li a').removeClass('active');
        $('.find_nav_list ul li').eq(1).addClass('find_nav_cur');
        $('.find_nav_list ul li').eq(1).find('a').addClass('active');
        $('li.sideline').css({"left":"94px","width":"94px"});
        break;
      case 'S':
        $('.find_nav_list ul li').removeClass('find_nav_cur');
        $('.find_nav_list ul li a').removeClass('active');
        $('.find_nav_list ul li').eq(2).addClass('find_nav_cur');
        $('.find_nav_list ul li').eq(2).find('a').addClass('active');
        $('li.sideline').css({"left":"188px","width":"94px"});
        break;
      case 'F':
        $('.find_nav_list ul li').removeClass('find_nav_cur');
        $('.find_nav_list ul li a').removeClass('active');
        $('.find_nav_list ul li').eq(3).addClass('find_nav_cur');
        $('.find_nav_list ul li').eq(3).find('a').addClass('active');
        $('li.sideline').css({"left":"282px","width":"94px"});
        break;
    }
  }

  function setPagingEnable(orderTypeCount) {
    if(orderTypeCount <= 0){
      return false;
    }
    //上一页是否可用
    if(pageNumber > 1){
      //上一页可用
      $('a.previous').removeClass('disable');
      $('a.previous').addClass('active');
    }else{
      //上一页不可用
      $('a.previous').removeClass('active');
      $('a.previous').addClass('disable');
    }

    //下一页是否可用
    if(pageNumber * pageSize < orderTypeCount){
      //下一页可用
      $('a.next').removeClass('disable');
      $('a.next').addClass('active');
    }else{
      //下一页不可用
      $('a.next').removeClass('active');
      $('a.next').addClass('disable');
    }
  }

  function setPaging() {
    switch (orderStatus) {
      case 'N':
        setPagingEnable(parseInt($('#hidden-totalCount').val()));
        break;
      case 'O':
        setPagingEnable(parseInt($('#hidden-toPayOrderCount').val()));
        break;
      case 'S':
        setPagingEnable(parseInt($('#hidden-toReceiveOrderCount').val()));
        break;
      case 'F':
        setPagingEnable(parseInt($('#hidden-toReviewOrderCount').val()));
        break;
    }
  }
  
  function changeOrderStatus(orderID, orderStatus){
    $.ajax({
      url: '/myOrder/changeOrderStatus',
      type: 'put',
      dataType: 'json',
      data:{
        orderID: orderID,
        orderStatus: orderStatus,
        loginUser: loginCustomer.account
      },
      success: function(res){
        if(res.err){
          alertResponseError(res.code, res.msg);
          return false;
        }
        location.reload();
      },
      error: function(XMLHttpRequest, textStatus){
        layer.msg('无法连接网络，请检查网络设置。');
      }
    });
  }

  $('a.previous').click(function () {
    let isActive = $(this).hasClass('active');
    if(!isActive){
      return false;
    }
    location.href = '/myOrder?orderStatus=' + orderStatus + '&pageNumber=' + (pageNumber - 1);
  });

  $('a.next').click(function () {
    let isActive = $(this).hasClass('active');
    if(!isActive){
      return false;
    }
    location.href = '/myOrder?orderStatus=' + orderStatus + '&pageNumber=' + (pageNumber + 1);
  });
  
  $(".find_nav_list").css("left", 0);

  $(".find_nav_list li").each(function() {
    $(".sideline").css({
      left: 0
    });
    $(".find_nav_list li").eq(0).addClass("find_nav_cur").siblings().removeClass("find_nav_cur");
  });

  $(".sideline").width(nav_w);

  $('.order-cancel').click(function () {
    changeOrderStatus($(this).attr('data-order-id'), 'C');
  });

  $('.order-receive').click(function () {
    changeOrderStatus($(this).attr('data-order-id'), 'F');
  });

  $('.order-review').click(function () {
    location.href = '/itemReview?itemID=' + $(this).attr('data-item-id');
  });
  // $(".find_nav_list li").on('click', function() {
  //   nav_w = $(this).width();
  //   $(".sideline").stop(true);
  //   $(".sideline").animate({
  //     left: $(this).position().left
  //   }, 300);
  //   $(".sideline").animate({
  //     width: nav_w
  //   });
  //   $(this).addClass("find_nav_cur").siblings().removeClass("find_nav_cur");
  //   var fn_w = ($(".find_nav").width() - nav_w) / 2;
  //   var fnl_l;
  //   var fnl_x = parseInt($(this).position().left);
  //   if(fnl_x <= fn_w) {
  //     fnl_l = 0;
  //   } else if(fn_w - fnl_x <= flb_w - fl_w) {
  //     fnl_l = flb_w - fl_w;
  //   } else {
  //     fnl_l = fn_w - fnl_x;
  //   }
  //   $(".find_nav_list").animate({
  //     "left": fnl_l
  //   }, 300);
  // });

  // $(".find_nav_list").on('touchstart', function(e) {
  //   var touch1 = e.originalEvent.targetTouches[0];
  //   x1 = touch1.pageX;
  //   y1 = touch1.pageY;
  //   ty_left = parseInt($(this).css("left"));
  // });

  // $(".find_nav_list").on('touchmove', function(e) {
  //   var touch2 = e.originalEvent.targetTouches[0];
  //   var x2 = touch2.pageX;
  //   var y2 = touch2.pageY;
  //   if(ty_left + x2 - x1 >= 0) {
  //     $(this).css("left", 0);
  //   } else if(ty_left + x2 - x1 <= flb_w - fl_w) {
  //     $(this).css("left", flb_w - fl_w);
  //   } else {
  //     $(this).css("left", ty_left + x2 - x1);
  //   }
  //   if(Math.abs(y2 - y1) > 0) {
  //     e.preventDefault();
  //   }
  // });

  // for(let n = 1; n < 9; n++) {
  //   var page = 'pagenavi' + n;
  //   var mslide = 'slider' + n;
  //   var mtitle = 'emtitle' + n;
  //   arrdiv = 'arrdiv' + n;
  //   if(document.getElementById(page) === null){
  //     return false;
  //   }
  //   var as = document.getElementById(page).getElementsByTagName('a');
  //   var tt = new TouchSlider({
  //     id: mslide,
  //     'auto': '-1',
  //     fx: 'ease-out',
  //     direction: 'left',
  //     speed: 600,
  //     timeout: 5000,
  //     'before': function(index) {
  //       var as = document.getElementById(this.page).getElementsByTagName('a');
  //       as[this.p].className = '';
  //       this.p = index;
  //
  //       fnl_x = parseInt($(".find_nav_list li").eq(this.p).position().left);
  //
  //       nav_w = $(".find_nav_list li").eq(this.p).width();
  //       $(".sideline").stop(true);
  //       $(".sideline").animate({
  //         left: $(".find_nav_list li").eq(this.p).position().left
  //       }, 300);
  //       $(".sideline").animate({
  //         width: nav_w
  //       }, 100);
  //       $(".find_nav_list li").eq(this.p).addClass("find_nav_cur").siblings().removeClass("find_nav_cur");
  //       var fn_w = ($(".find_nav").width() - nav_w) / 2;
  //       var fnl_l;
  //       if(fnl_x <= fn_w) {
  //         fnl_l = 0;
  //       } else if(fn_w - fnl_x <= flb_w - fl_w) {
  //         fnl_l = flb_w - fl_w;
  //       } else {
  //         fnl_l = fn_w - fnl_x;
  //       }
  //       $(".find_nav_list").animate({
  //         "left": fnl_l
  //       }, 300);
  //     }
  //   });
  //   tt.page = page;
  //   tt.p = 0;
  //   //console.dir(tt); console.dir(tt.__proto__);
  //
  //   for(var i = 0; i < as.length; i++) {
  //     (function() {
  //       var j = i;
  //       as[j].tt = tt;
  //       as[j].onclick = function() {
  //         this.tt.slide(j);
  //         return false;
  //       }
  //     })();
  //   }
  // }

  initPage();
});