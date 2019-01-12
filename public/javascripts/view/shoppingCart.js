$(function() {

  //定义全局变量
  var i = 0;

  //金额总和
  var money = 0;

  //计算合计价格
  var cart_money = new Object();

  //全部商品ID
  var cart_id = new Object();
  //备份商品ID，用于全选后去掉全选又再次全选
  var cart_id_copy = new Object();
  var noX = 0; /* 没选中时点击加减计算数量  */
  var allThis = $(".commodity_box .select em"); /*底部全选*/
  var totalH;
  let loginCustomer = getLoginCustomer();
  let lan = localStorage.getItem('siteLanguage');

  function initPage() {
    setPageLanguage();
  }

  /* 减  */
  function reduceMod(e, totalH, mod, noX) {

    var tn = lan === 'cn'? e.siblings().find(".lan-cn .qu_su").text()
        : e.siblings().find(".lan-en .qu_su").text(); /* 当前选中商品  */

    var tn1 = e.siblings().find(".zi").text(); /* 商品数量  */
    if(mod != 2) {
      var Total = parseFloat(totalH) - (tn * tn1); /* 总价格减该商品总数价格  */
      $("#total_price b").text(Total.toFixed(2));
    } else {
      /* 合计加单价-1 */
      var Total = parseFloat(totalH) - parseFloat(tn); /* 总价格减该商品总数价格  */
      $("#total_price b").text(Total.toFixed(2));
    }
  }

  /* 加  */
  function plusMod(e, totalH, mod) {
    var tn = lan === 'cn'? e.siblings().find(".lan-cn .qu_su").text()
        : e.siblings().find(".lan-en .qu_su").text(); /* 当前选中商品  */

    var tn1 = e.siblings().find(".zi").text(); /* 商品数量  */
    if(mod != 2) {
      var Total = parseFloat(totalH) + (tn * tn1); /* 总价格加上该商品总数价格  */
      $("#total_price b").text(Total.toFixed(2));
    } else {
      /* 合计加单价+1 */
      var Total = parseFloat(totalH) + (parseFloat(tn) + (noX - 1)); /* 总价格加上该商品总数价格  */
      $("#total_price b").text(Total.toFixed(2));
    }
  }

  /*全选该店商品价格 加*/
  function commodityPlusMod(e, totalH) {
    var qu = lan === 'cn' ? e.parents(".commodity_list").find(".pitch_on").parent().find(".lan-cn .qu_su")
                            : e.parents(".commodity_list").find(".pitch_on").parent().find(".lan-en .qu_su");
    var quj = e.parents(".commodity_list").find(".pitch_on").parent().find(".zi");
    var Total = 0;
    var erTotal = true;
    /* 该商品全部金额  */
    for(var i = 0; i < qu.length; i++) {
      var n = qu.eq(i).text();
      var n1 = quj.eq(i).text();
      /*合计价格*/
      if(erTotal) {
        Total = parseFloat(totalH) + (parseFloat(n) * parseFloat(n1));
        if(Total < 0)
          Total = 0;
        erTotal = false;
      } else {
        Total = parseFloat(Total) + (parseFloat(n) * parseFloat(n1));

      }
    }
    $("#total_price b").text(Total.toFixed(2)); /* 合计金额  */
  }

  var plus;
  /*全选该店商品价格 减*/
  function commodityReduceMod(e, totalH) {
    var qu = lan === 'cn' ? e.parents(".commodity_list").find(".pitch_on").parent().find(".lan-cn .qu_su")
        : e.parents(".commodity_list").find(".pitch_on").parent().find(".lan-en .qu_su");
    var quj = e.parents(".commodity_list").find(".pitch_on").parent().find(".zi");
    var Total = 0;
    plus = totalH;

    var erTotal = true;
    /* 该商品全部金额  */
    for(var i = 0; i < qu.length; i++) {
      var n = qu.eq(i).text();
      var n1 = quj.eq(i).text();
      /*合计价格*/
      if(erTotal) {
        Total = parseFloat(totalH) - (parseFloat(n) * parseFloat(n1));
        plus = Total;
        if(Total < 0)
          Total = 0;
        erTotal = false;
      } else {
        Total = parseFloat(Total) - (parseFloat(n) * parseFloat(n1));
        plus = Total;

      }

      $("#total_price b").text(Total.toFixed(2)); /* 合计金额  */
      plus;
    }
  }

  /*全部商品价格*/
  function commodityWhole() {
    /* 合计金额  */
    var je = lan === 'cn' ? $(".commodity_box .select .lan-cn .qu_su")
        : $(".commodity_box .select .lan-en .qu_su"); /* 全部商品单价  */
    var je1 = $(".commodity_box .select .zi"); /* 全部商品数量  */
    var TotalJe = 0;
    for(var i = 0; i < je.length; i++) {
      var n = je.eq(i).text();
      var n1 = je1.eq(i).text();
      TotalJe = TotalJe + (parseFloat(n) * parseFloat(n1));

    }
    $("#total_price b").text(TotalJe.toFixed(2)); /* 合计金额  */
  }

  //选择结算商品
  $(".select em").click(function() {
    var su = $(this).attr("aem");
    var carts_id = $(this).attr("data-shoppingCart-id");
    totalH = $("#total_price b").text(); /* 合计金额  */
    if(su === '0') {
      /* 单选商品  */
      if($(this).hasClass("pitch_on")) {
        /*去该店全选*/
        $(this).parents("ul").siblings(".select").find("em").removeClass("pitch_on");
        /*去底部全选*/
        $("#all_pitch_on").removeClass("pitch_on");
        $(this).removeClass("pitch_on");
        reduceMod($(this), totalH);
        cart_id[carts_id] = "";
        delete cart_id[carts_id];
      } else {
        $(this).addClass("pitch_on");
        var n = $(this).parents("ul").children().find(".pitch_on");
        var n1 = $(this).parents("ul").children();
        plusMod($(this), totalH, 0, noX);
        cart_id[carts_id] = "";
        /*该店商品全选中时*/
        if(n.length == n1.length) {
          $(this).parents("ul").siblings(".select").find("em").addClass("pitch_on");
        }
        /*商品全部选中时*/
        var fot = $(".commodity_list_box .tite_tim .pitch_on");
        var fot1 = $(".commodity_list_box .tite_tim em");
        if(fot.length == fot1.length)
          $("#all_pitch_on").addClass("pitch_on");
      }
    } else {
      /* 全选该店铺  */
      if($(this).hasClass("pitch_on")) {
        /*去底部全选*/
        $("#all_pitch_on").removeClass("pitch_on");
        $(this).removeClass("pitch_on");

        commodityReduceMod($(this), totalH);
        $(this).parent().siblings("ul").find("em").removeClass("pitch_on");
        delete cart_id[carts_id];
      } else {
        commodityReduceMod($(this), totalH);

        $(this).addClass("pitch_on");

        $(this).parent().siblings("ul").find("em").addClass("pitch_on");

        /*if(plus != NaN && plus != undefined && plus > 0){
          totalH = parseFloat(totalH)-parseFloat(plus);
          if(totalH < 0)
            totalH = 0;
        }*/
        if(plus == undefined || plus == NaN) {
          plus = 0
        }

        commodityPlusMod($(this), plus);
        cart_id[carts_id] = "";
        /*商品全部选中时*/
        var fot = $(".commodity_list_box .tite_tim .pitch_on");
        var fot1 = $(".commodity_list_box .tite_tim em");
        if(fot.length == fot1.length) {
          $("#all_pitch_on").addClass("pitch_on");
        }

      }
    }

  });

  /* 底部全选  */
  var bot = 0;
  $("#all_pitch_on").click(function() {
    if(bot == 0) {
      $(this).addClass("pitch_on");
      allThis.removeClass("pitch_on");
      allThis.addClass("pitch_on");
      /*总价格*/
      commodityWhole();
      bot = 1;
      //重新加入属性对象
      for(var key in cart_id_copy) {
        cart_id[key] = "";
      }
    } else {
      $(this).removeClass("pitch_on");
      allThis.removeClass("pitch_on");
      $("#total_price b").text("0");
      bot = 0;
      //移除全部对象
      for(var key in cart_id) {
        delete cart_id[key];
      }
    }
    //计算选择数值
    //number();
  });

  function deleteShoppingCart() {
    let confirmMsg = lan === 'cn'? '确认将所选的商品从购物车删除吗？' : 'Do you want delete the items selected from shopping cart ?';
    let okMsg = lan === 'cn'? '删除？' : 'Delete';
    let cancelMsg = lan === 'cn'? '取消' : 'Cancel';
    layer.confirm(confirmMsg, {
      btn: [okMsg,cancelMsg]
    }, function(index){
      $.each($(".commodity_list_term .pitch_on"), function (index, obj) {
        let shoppingCartID = $(obj).attr('data-shoppingCart-id');
        $.ajax({
          url: '/shoppingCart?shoppingCarID=' + shoppingCartID,
          type: 'delete',
          async:false,
          dataType: 'json',
          success: function(res){
            if(!res.err){
              $('.commodity_list_term .pitch_on[data-shoppingcart-id="' + shoppingCartID + '"]').parent().remove();
              $('.commodity_list .tite_tim > em.pitch_on[data-shoppingcart-id="' + shoppingCartID + '"]').parents('.commodity_box').remove();
            }
          },
          error: function(XMLHttpRequest){
            layer.msg(lan === 'cn' ? '删除失败。' : 'Delete failed.');
          }
        });
      });
      layer.close(index);
    }, function(){

    });
  }

  /* 编辑商品  */
  var topb = 0;
  $("#rem_s").click(function() {
    if(topb == 0) {
      $(this).text("完成");
      $(".total_amount").hide(); /* 合计  */
      $("#confirm_cart").hide(); /* 结算  */
      $("#confirm_cart1").show(); /* 删除 */
      $("#confirm_cart2").show(); /*移入收藏夹 */
      topb = 1;
    } else {
      topb = 0;
      $(this).text("编辑");
      $(".total_amount").show(); /* 合计  */
      $("#confirm_cart").show(); /* 结算  */
      $("#confirm_cart1").hide(); /* 删除 */
      $("#confirm_cart2").hide(); /* 移入收藏夹 */
      allThis.removeClass("pitch_on"); /* 取消所有选择  */
      $("#all_pitch_on").removeClass("pitch_on"); /* 取消所有选择  */
      $("#total_price b").text("0"); /*合计价格清零*/

    }

  });
  /* 加减  */
  $(".reducew").click(function(){
    var totalH = $("#total_price b").text(); /* 合计金额  */
    var ise = $(this).siblings("span").text();
    var gc_id = $(this).siblings("input").val();
    if(noX <= 0) {
      noX = 0;
    } else {
      noX--;
    };

    if(parseInt(ise) <= 1) {
      $(this).siblings("span").text("1");
    } else {
      var n = parseInt(ise) - 1;
      $(this).siblings("span").text(n);
      if($(this).parent().parent().children("em").hasClass("pitch_on")) {
        var mo = $(this).parent().parent().children("em");
        reduceMod(mo, totalH, 2, noX);
        noX = 0;
      }

    }

  });

  $(".plusw").click(function(){
    var totalH = $("#total_price b").text(); /* 合计金额  */
    var ise = $(this).siblings("span").text();
    var gc_id = $(this).siblings("input").val();
    var n = parseInt(ise) + 1;
    noX++;
    $(this).siblings("span").text(n);
    if($(this).parent().parent().children("em").hasClass("pitch_on")) {
      var mo = $(this).parent().parent().children("em");
      plusMod(mo, totalH, 2, noX);
      noX = 0;
    }


  });

  $('#confirm_cart1,#confirm_cart2').click(function() {
    deleteShoppingCart();
  });

  $('#confirm_cart').click(function () {
    let errorCount = 0;
    $.each($(".commodity_list_term .pitch_on"), function (index, obj) {
      let shoppingCartID = $(obj).attr('data-shoppingCart-id');
      let itemID = $(obj).attr('data-item-id');
      let shoppingCount = $(obj).parent().find('span.zi').text();
      $.ajax({
        url: '/shoppingCart',
        type: 'put',
        dataType: 'json',
        async:false,
        data:{
          shoppingCartID: shoppingCartID,
          itemID: itemID,
          customerID: loginCustomer.customerID,
          shoppingCount: shoppingCount,
          status: 'I',
          loginUser: loginCustomer.account
        },
        success: function (res) {
          if(res.err){
            errorCount++;
          }
        },
        error: function (XMLHttpRequest, textStatus) {
          errorCount++;
        }
      });
    });
    if(errorCount > 0){
      layer.msg(lan === 'cn'? '数据保存失败，请稍后再试。' : 'Save failed, please try again later.');
    }else{
      location.href = '/order';
    }
  });

  initPage();
});
