$(document).ready(function() {
  var Page = [];
  var temppage = [];
  var List;
  var CheckAmt = 0;

  if (localStorage) {
    $("#shopeesecret").val(localStorage.getItem("shopeesecret"));
    $("#shopeeshopid").val(localStorage.getItem("shopeeshopid"));
    $("#shopeepartnerid").val(localStorage.getItem("shopeepartnerid"));
    $("#paytwogoid").val(localStorage.getItem("paytwogoid"));
    $("#paytwogohashkey").val(localStorage.getItem("paytwogohashkey"));
    $("#paytwogohashiv").val(localStorage.getItem("paytwogohashiv"));
  }

  toastr.options = {
    "closeButton": true,
    "positionClass": "toast-top-right",
    "showDuration": "0",
    "hideDuration": "1000",
    "timeOut": "2000",
    "extendedTimeOut": "1000"
  }

  function getAllpage(page, cb) {
    $.ajax({
      url: '/api/orders',
      type: 'POST',
      data: {
        tt: $("#tt").val(),
        tf: $("#tf").val(),
        page: page,
        shopeesecret: $("#shopeesecret").val(),
        shopeeshopid: $("#shopeeshopid").val(),
        shopeepartnerid: $("#shopeepartnerid").val(),
        paytwogoid: $("#paytwogoid").val(),
        paytwogohashkey: $("#paytwogohashkey").val(),
        paytwogohashiv: $("#paytwogohashiv").val()
      },
      success: function(response) {
        for (var i in response.list) {
          if (response.list[i].order_status == 'READY_TO_SHIP') {
            temppage.push(response.list[i]);
          }
        }
        if (response.more === true) {
          getAllpage(page + 1);
        } else {
          getData(temppage,0);
          /*
          slicePage();
          refreshTable(Page[0]);
          $(".hint").hide();
          showPageSelect();*/
        }
      }
    });
  }

  function showPageSelect() {
    var pageAmt = Page.length;
    $("#pageTop").empty();
    $("#pageBot").empty();
    $("#pageTop").show();
    $("#pageBot").show();
    for (var i = 1; i <= pageAmt; i++) {
      $("#pageTop").append(`<option>${i}</option>`);
      $("#pageBot").append(`<option>${i}</option>`);
    }
  }

  function refreshTable(data) {
    data = data || []
    $("#orderlist").empty();
    if (data.length < 1) {
      var row = `<tr>
									<td colspan="4" class="text-center">查無資料</td>
								</tr>`
      $("#orderlist").append(row);
    } else {
      for (var i in data) {
        if (data[i].order_status == 'READY_TO_SHIP' || data[i].order_status == '準備出貨') {
          var update = new Date(data[i].update_time * 1000);
          var updatestring = update.getFullYear() + "/" + (update.getMonth() + 1) + "/" + update.getDate() + " " + ((update.getHours() < 10) ? ("0" + update.getHours()) : (update.getHours())) + ":" + ((update.getMinutes() < 10) ? ("0" + update.getMinutes()) : (update.getMinutes()));
          switch (data[i].order_status) {
            case 'READY_TO_SHIP':
              data[i].order_status = "準備出貨"
              break;
            case 'SHIPPED':
              data[i].order_status = "運送中"
              break;
            case 'TO_CONFIRM_RECEIVE':
              data[i].order_status = "等待買家確認"
              break;
            case 'CANCELLED':
              data[i].order_status = "取消"
              break;
            case 'COMPLETED':
              data[i].order_status = "完成"
              break;
            case 'IN_CANCEL':
              data[i].order_status = "等待取消"
              break;
          }
          var row = `<tr><td>${data[i].ordersn}</td>
						<td>${updatestring}</td>
						<td>${data[i].order_status}</td><td>
            <a href="https://seller.shopee.tw/portal/sale?search=${data[i].ordersn}" target="_blank" class="btn btn-primary">出貨</a>
            <div class="btn btn-primary detail" data-id="${data[i].ordersn}">詳細資料</div></td></tr>`;
          $("#orderlist").append(row);
        }
      }
      $(".genInv").on("click", function() {
        genInv($(this).data("id"));
      });
      $(".detail").on("click", function() {
        getOrder($(this).data("id"));
      });
      $(".orderCheck").change(function() {
        if (this.checked) {
          CheckAmt += 1;
        } else {
          CheckAmt -= 1;
        }
        if (CheckAmt > 1) {
          $("#allSelectGenInv").show();
        } else {
          $("#allSelectGenInv").hide();
        }
      });
      $("#allcheck").prop("checked", false);
      CheckAmt = 0;
      $("#allSelectGenInv").hide();
    }
  }

  function getOrder(ordersn) {
    $.ajax({
      url: '/api/order',
      type: 'POST',
      data: {
        ordersn: ordersn,
        shopeesecret: $("#shopeesecret").val(),
        shopeeshopid: $("#shopeeshopid").val(),
        shopeepartnerid: $("#shopeepartnerid").val(),
        paytwogoid: $("#paytwogoid").val(),
        paytwogohashkey: $("#paytwogohashkey").val(),
        paytwogohashiv: $("#paytwogohashiv").val()
      },
      success: function(response) {
        var create = new Date(response.create_time * 1000);
        var create_time = create.getFullYear() + "/" + (create.getMonth() + 1) + "/" + create.getDate() + " " + ((create.getHours() < 10) ? ("0" + create.getHours()) : (create.getHours())) + ":" + ((create.getMinutes() < 10) ? ("0" + create.getMinutes()) : (create.getMinutes()));
        $("#orderDetail .modal-body").empty();
        var detail = `
        <p>成立時間 : ${create_time}</p><br>
				<p>訂購人 : ${response.recipient_address.name}</p><br>
				<p>手機 : ${response.recipient_address.phone}</p><br>
        <p>訂單編號 : ${response.ordersn}</p><br>
				<p>銷售額(未稅) : ${Math.round(response.total_amount / 1.05)}</p><br>
				<p>發票稅額 : ${Math.round(response.total_amount - (response.total_amount / 1.05))}</p><br>
				<p>發票總金額(商品價格+運費) : ${response.total_amount}</p><br>
				<p>運費：${response.estimated_shipping_fee}</p>
				<hr>
				`;
        for (var i in response.items) {
          detail += `
					<p>商品名稱：${response.items[i].item_name.split(" ")[0]}</p>
					<p>商品單價(折扣後)：${response.items[i].variation_discounted_price}</p>
					<p>商品銷售數量：${response.items[i].variation_quantity_purchased}</p><br>
					`;
        }
        $("#orderDetail .modal-body").append(detail);
        $("#orderDetail").modal('show');
      }
    });
  }

  $('#datetimepickertf').datetimepicker({
    format: "YYYY/MM/DD"
  });

  $('#datetimepickertt').datetimepicker({
    format: "YYYY/MM/DD",
    useCurrent: false
  });

  $("#datetimepickertf").on("dp.change", function(e) {
    $('#datetimepickertt').data("DateTimePicker").minDate(e.date);
  });

  $("#datetimepickertt").on("dp.change", function(e) {
    $('#datetimepickertf').data("DateTimePicker").maxDate(e.date);
  });

  $("#pageTop,#pageBot").on("change", function() {
    var page = $(this).val() - 1;
    $("#pageTop,#pageBot").val($(this).val());
    refreshTable(Page[page]);
  });

  $("#search").on('click', function() {
    if ($("#tt").val() != "" && $("#tf").val() != "") {
      if ((Math.floor(new Date($("#tt").val()).getTime() / 1000) - Math.floor(new Date($("#tf").val()).getTime() / 1000)) <= 15 * 24 * 3600) {
        $("#pageTop").hide();
        $("#pageBot").hide();
        $("#orderlist").empty();
        $.ajax({
          url: '/api/orders',
          type: 'POST',
          data: {
            tt: $("#tt").val(),
            tf: $("#tf").val(),
            page: 0,
            shopeesecret: $("#shopeesecret").val(),
            shopeeshopid: $("#shopeeshopid").val(),
            shopeepartnerid: $("#shopeepartnerid").val(),
            paytwogoid: $("#paytwogoid").val(),
            paytwogohashkey: $("#paytwogohashkey").val(),
            paytwogohashiv: $("#paytwogohashiv").val()
          },
          success: function(response) {
            Page = [];
            temppage = [];
            if (response.list) {
              for (var i in response.list) {
                if (response.list[i].order_status == 'READY_TO_SHIP') {
                  response.list[i].detail = getData(response.list[i].ordersn);
                  temppage.push(response.list[i]);
                }
              }
              if (response.more === true) {
                $(".hint").show();
                getAllpage(0)
              } else {
                getData(temppage,0);
              }
            } else {
              toastr.warning("請檢查蝦皮金鑰是否出錯");
            }
          }
        });
      } else {
        alert("日期間隔請設定在15天內");
      }
    }
  });

  $("#setting").on("click", function() {
    $("#settingForm").modal("show");
  });

  $("#save").on("click", function() {
    localStorage.setItem("shopeesecret", $("#shopeesecret").val());
    localStorage.setItem("shopeeshopid", $("#shopeeshopid").val());
    localStorage.setItem("shopeepartnerid", $("#shopeepartnerid").val());
    localStorage.setItem("paytwogoid", $("#paytwogoid").val());
    localStorage.setItem("paytwogohashkey", $("#paytwogohashkey").val());
    localStorage.setItem("paytwogohashiv", $("#paytwogohashiv").val());
  });

  function slicePage() {
    temppage.sort(function(a, b) {
      return b.details.total_amount - a.details.total_amount;
    });
    var subpage = [];
    for (var i in temppage) {
      if (subpage.length == 50) {
        Page.push(subpage);
        subpage = [];
      }
      subpage.push(temppage[i]);
    }
    if (subpage.length > 0)
      Page.push(subpage);
  }

  function getData(arr, index,stop) {
    $.ajax({
      url: '/api/order',
      type: 'POST',
      data: {
        ordersn: arr[index].ordersn,
        shopeesecret: $("#shopeesecret").val(),
        shopeeshopid: $("#shopeeshopid").val(),
        shopeepartnerid: $("#shopeepartnerid").val(),
        paytwogoid: $("#paytwogoid").val(),
        paytwogohashkey: $("#paytwogohashkey").val(),
        paytwogohashiv: $("#paytwogohashiv").val()
      },
      success: function(response) {
        temppage[index].details = response;
        if(!stop){
          if(index!=arr.length-1){
            getData(arr, index + 1,1);
            if (index != arr.length - 2){
              getData(arr, index + 2,1);
              if (index != arr.length - 3)
                getData(arr, index + 3);
            }
          }
        }
        if(index==arr.length-1){
          console.log(temppage);
          slicePage();
          refreshTable(Page[0]);
          $(".hint").hide();
          showPageSelect();
        }
      }
    });
  }
});
