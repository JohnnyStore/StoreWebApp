$(document).ready(function () {
  let _reviewScore = 0;
  let _reviewLevel = '';
  let lan = localStorage.getItem('siteLanguage');
  var loginCustomer = getLoginCustomer();

  function initPage() {
    setPageLanguage();
  }

  $('.review-star i').click(function () {
    _reviewScore = $(this).attr('data-score');
    $('.review-star i').removeClass('star-red');
    $('.review-star i').each(function (index, obj) {
      if(parseInt($(obj).attr('data-score')) <= parseInt(_reviewScore)){
        $(obj).addClass('star-red');
      }
    });
  });

  $('.review-level i').click(function () {
    $('.review-level i').removeClass('review-level-selected');
    let preSelectedObj = $('.review-level i.fa-dot-circle-o');
    preSelectedObj.removeClass('fa-dot-circle-o');
    preSelectedObj.removeClass('review-level-selected');
    preSelectedObj.addClass('fa-circle-o');

    $(this).removeClass('fa-circle-o');
    $(this).addClass('fa-dot-circle-o');
    $(this).addClass('review-level-selected');
    _reviewLevel = $(this).attr('data-level');
  });

  $('.btn-review-submit').click(function () {
    let itemID = $('#hidden-itemID').val();
    let reviewContent = $.trim($('.review-text').val());
    if(itemID.length === 0){
      layer.msg(lan === 'cn'? '没有对应的商品' : 'Can not find any item');
      return false;
    }
    if(reviewContent.length === 0){
      layer.msg(lan === 'cn'? '请填写评论信息' : 'Please write review content');
      return false;
    }

    $.ajax({
      url: '/itemReview',
      type: 'post',
      dataType: 'json',
      data:{
        customerID: loginCustomer.customerID,
        itemID: itemID,
        starNum: _reviewScore,
        reviewLevel: _reviewLevel,
        reviewText: reviewContent,
        reviewStatus: 'P',
        loginUser: loginCustomer.account
      },
      success: function(res){
        if(res.err){
          alertResponseError(res.code, res.msg);
          return false;
        }
        location.href = '/myOrder';
      },
      error: function(XMLHttpRequest, textStatus){
        layer.msg('无法连接网络，请检查网络设置。');
      }
    });

  });
  initPage();
});