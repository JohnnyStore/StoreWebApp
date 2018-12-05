$(document).ready(function () {
  let startX = '';
  let disX = '';

  function initPage(){
    setPageLanguage();
    setCategoryDefaultActive();
  }

  function setCategoryDefaultActive(){
    $('.goodsListClass ul li:eq(0)').addClass('active');
  }

  $('.bottom_content')[0].style.left = "0%";

  $('.top_menu').on('click', '.common', function() {
    let index = $(this).index();
    $('.bottom_content').css('left', '-' + index * 100 + '%');
    $('.top_menu .common').eq(index).addClass('liactive').siblings().removeClass('liactive')
  });

  $('.bottom_content').on('touchstart', '.body_1', function(e) {
    startX = e.originalEvent.changedTouches[0].clientX;
  });

  $('.bottom_content').on('touchmove', '.body_1', function(e) {
    e.stopPropagation()
  });

  $('.bottom_content').on('touchend', '.body_1', function(e) {
    disX = e.originalEvent.changedTouches[0].clientX - startX;
    let leftNum = parseInt($('.bottom_content')[0].style.left);
    if(disX > 0 && disX > 100) {
      if(leftNum <= -100) {
        $('.bottom_content')[0].style.left = leftNum + 100 + "%";
        var order = -parseInt($('.bottom_content')[0].style.left) / 100;
        $('.top_menu .common').eq(order).addClass('liactive').siblings().removeClass('liactive')
      }
    } else if(disX < 0 && disX < -100) {
      if(leftNum >= -200) {
        $('.bottom_content')[0].style.left = leftNum - 100 + "%";
        let order = (-parseInt($('.bottom_content')[0].style.left)) / 100;
        $('.top_menu .common').eq(order).addClass('liactive').siblings().removeClass('liactive')
      }
    }
  });

  $(".goodsListClass li").click(function () {
    if(!$(this).hasClass('active')) {
      $(this).addClass('active').siblings().removeClass("active");
    } else {
      $(this).removeClass("active");
    }
  });

  $('.btn-search').click(function () {
    let content = $.trim($('.search-content').val());
    if(content.length === 0){
      return false;
    }
    location.href = '/items?itemDes=' + content;
  });

  initPage();

});