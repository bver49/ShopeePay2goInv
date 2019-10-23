$(document).ready(function () {

    var Page = {};
    var shopList = {};
    var orderSn = [];
    var threeDay = 3 * 24 * 60 * 60;
    var noteList = {};
    var nowPage = 0;
    var searchArrive = 0;

    window.onerror = function (msg) {
        console.log(msg);
        stop();
        $("#pageTop").hide();
        $("#pageBot").hide();
    };

    if (localStorage) {
        $("#shopeesecret").val(localStorage.getItem("shopeesecret"));
        $("#shopeeshopid").val(localStorage.getItem("shopeeshopid"));
        $("#shopeepartnerid").val(localStorage.getItem("shopeepartnerid"));
    }

    toastr.options = {
        "closeButton": true,
        "positionClass": "toast-top-right",
        "showDuration": "0",
        "hideDuration": "1000",
        "timeOut": "2000",
        "extendedTimeOut": "1000"
    }


    function start() {
        console.time("count");
        Page = {};
        orderSn = [];
        shopList = {};
        noteList = {};
        nowPage = 0;
        $("#pageTop").hide();
        $("#pageBot").hide();
        $("#search").hide();
        $("#itemsdetail").hide();
        $("#exportitemsdetail").hide();
        $("#orderlist").empty();
        $(".hint").show();
    }

    function stop() {
        if ($("#itemscount").val() == "是") {
            $("#itemsdetail").show();
            $("#exportitemsdetail").show();
        }
        $(".hint").hide();
        $("#pageTop").empty();
        $("#pageBot").empty();
        $("#pageTop").show();
        $("#pageBot").show();
        $("#search").show();
    }

    //顯示頁數選擇
    function showPageSelect() {
        console.log(shopList);
        window.pg = Page;
        stop();
        var pageAmt = Math.floor(Page.length / 50) + 1;
        for (var i = 1; i <= pageAmt; i++) {
            $("#pageTop").append(`<option>${i}</option>`);
            $("#pageBot").append(`<option>${i}</option>`);
        }
    }

    //撈出下一頁的資料
    function getNextPage(page) {
        var status = (searchArrive) ? 2 : 1;
        $.ajax({
            url: '/orders?status=' + status,
            type: 'POST',
            data: {
                tt: $("#tt").val(),
                tf: $("#tf").val(),
                page: page,
                shopeesecret: $("#shopeesecret").val(),
                shopeeshopid: $("#shopeeshopid").val(),
                shopeepartnerid: $("#shopeepartnerid").val()
            },
            success: function (response) {
                for (var i in response.list) {
                    if (!Page[response.list[i].ordersn]) {
                        Page[response.list[i].ordersn] = response.list[i];
                        orderSn.push(response.list[i].ordersn);
                    }
                }
                if (response.more === true) {
                    getNextPage(page + 1);
                } else {
                    if (searchArrive) {
                        showArrive(orderSn);
                    } else {
                        showShip(orderSn);
                    }
                }
            }
        });
    }

    //更新table資料
    function refreshTable(page) {
        $("#orderlist").empty();
        if (Page.length < 1) {
            var row = `<tr>
									<td colspan="8" class="text-center">查無資料</td>
								</tr>`
            $("#orderlist").append(row);
        } else {
            for (var i = page * 50; i < (page + 1) * 50 && i < Page.length; i++) {
                var update = new Date(Page[i].update_time * 1000);
                var updatestr = update.getFullYear() + "/" + (update.getMonth() + 1) + "/" + update.getDate() + " " + ((update.getHours() < 10) ? ("0" + update.getHours()) : (update.getHours())) + ":" + ((update.getMinutes() < 10) ? ("0" + update.getMinutes()) : (update.getMinutes()));
                var shipdate = (Page[i].detail) ? (new Date(Page[i].update_time * 1000 + (Page[i].detail.days_to_ship * 86400 * 1000))) : new Date(Page[i].update_time * 1000 + (7 * 86400 * 1000));
                var shipdatestr = shipdate.getFullYear() + "/" + (shipdate.getMonth() + 1) + "/" + shipdate.getDate();
                var shipstatus = (Page[i].order_status == 'READY_TO_SHIP') ? '準備出貨' : '已到貨';
                if (Math.floor((shipdate.getTime() - Date.now()) / 1000) <= threeDay) {
                    shipdatestr = '<span style="color:red;">' + shipdatestr + '</span>';
                }
                if (!searchArrive) {
                    var row = `<tr><td>${i+1}</td><td>${Page[i].ordersn}</td>
    						<td>${updatestr}</td>
    						<td>${shipdatestr}</td>
    						<td>${shipstatus}</td>
    						<td>${Page[i].detail.message_to_seller}</td>`;
                    if (noteList[Page[i].ordersn]) {
                        row += `<td>
    							<a href="https://seller.shopee.tw/portal/sale?search=${Page[i].ordersn}" target="_blank" class="btn btn-primary">出貨</a>
    							<div class="btn btn-primary detail" data-id="${Page[i].ordersn}">詳細資料</div>
    							<div class="btn btn-primary updateNote" data-id="${Page[i].ordersn}">修改備註</div>
    							<div class="btn btn-primary delNote" data-id="${Page[i].ordersn}">刪除備註</div>
    						</td>
    						<td>
    							${noteList[Page[i].ordersn]}
    						</td></tr>`
                    } else {
                        row += `<td>
    							<a href="https://seller.shopee.tw/portal/sale?search=${Page[i].ordersn}" target="_blank" class="btn btn-primary">出貨</a>
    							<div class="btn btn-primary detail" data-id="${Page[i].ordersn}">詳細資料</div>
    							<div class="btn btn-primary addNote" data-id="${Page[i].ordersn}" data-ts="${Page[i].detail.create_time}">新增備註</div>
    						</td><td></td></tr>`
                    }
                } else {
                    var row = `<tr><td style="text-align:center;">${i+1}</td>
                  <td style="text-align:center;">${Page[i].ordersn}</td>
      						<td style="text-align:center;">${updatestr}</td>
      						<td style="text-align:center;">${shipdatestr}</td>
      						<td style="text-align:center;">${shipstatus}</td>
                  <td>
                    <a href="https://seller.shopee.tw/portal/sale?search=${Page[i].ordersn}" target="_blank" class="btn btn-primary">通知買家</a>
          					<div class="btn btn-primary detail" data-id="${Page[i].ordersn}">詳細資料</div>`;
                    if (noteList[Page[i].ordersn]) {
                        row += `
                <div class="btn btn-primary updateNote" data-id="${Page[i].ordersn}">修改備註</div>
                <div class="btn btn-primary delNote" data-id="${Page[i].ordersn}">刪除備註</div>
              </td>
              <td>
                ${noteList[Page[i].ordersn]}
              </td></tr>`
                    } else {
                        row += `
              <div class="btn btn-primary addNote" data-id="${Page[i].ordersn}" data-ts="${Page[i].update_time}">新增備註</div>
            </td><td></td></tr>`
                    }
                }
                $("#orderlist").append(row);
            }
            $(".detail").on("click", function () {
                getOrder($(this).data("id"));
            });
            $(".addNote").on("click", function () {
                addNote($(this).data("id"), $(this).data("ts"));
            });
            $(".delNote").on("click", function () {
                delNote($(this).data("id"));
            });
            $(".updateNote").on("click", function () {
                updateNote($(this).data("id"));
            });
            console.timeEnd("count");
        }
    }

    function showShip(orderSn) {
        var chunkPage = chunk(orderSn, 50);
        var getAllDetail = Promise.all(chunkPage.map(getOrdersDetail));
        getAllDetail.then(function (result) {
            shopList.tt = $("#tt").val();
            shopList.tf = $("#tf").val();
            shopList.carrier = $("#carrier").val();
            sortPage();
            refreshTable(0);
            showPageSelect();
        });
    }

    function showArrive(orderSn) {
        var shipOrder = orderSn.filter(function (sn) {
            return Page[sn].order_status == 'SHIPPED';
        });
        var getAllLogistic = Promise.all(shipOrder.map(getOrderLogistic));
        getAllLogistic.then(function (result) {
            var tmpPage = {}
            for (var i in result) {
                if (result[i].ordersn) {
                    tmpPage[result[i].ordersn] = Page[result[i].ordersn];
                }
            }
            Page = Object.keys(tmpPage).map(function (key) {
                return Page[key];
            });;
            window.re = result;
            shopList.tt = $("#tt").val();
            shopList.tf = $("#tf").val();
            shopList.carrier = $("#carrier").val();
            refreshTable(0);
            showPageSelect();
        });
    }

    //查找單筆訂單詳細資料
    function getOrder(ordersn) {
        $.ajax({
            url: '/orders/' + ordersn + '/detail',
            type: 'POST',
            data: {
                shopeesecret: $("#shopeesecret").val(),
                shopeeshopid: $("#shopeeshopid").val(),
                shopeepartnerid: $("#shopeepartnerid").val()
            },
            success: function (response) {
                console.log(response);
                $("#orderDetail .modal-body").empty();
                if (response != 'notFound') {
                    var create = new Date(response.create_time * 1000);
                    var create_time = create.getFullYear() + "/" + (create.getMonth() + 1) + "/" + create.getDate() + " " + ((create.getHours() < 10) ? ("0" + create.getHours()) : (create.getHours())) + ":" + ((create.getMinutes() < 10) ? ("0" + create.getMinutes()) : (create.getMinutes()));
                    var detail = `
        <p>成立時間 : ${create_time}</p><br>
				<p>訂購人 : ${response.recipient_address.name}</p><br>
				<p>手機 : ${response.recipient_address.phone}</p><br>
        <p>訂單編號 : ${response.ordersn}</p><br>
				<p>銷售額(未稅) : ${Math.round(response.total_amount / 1.05)}</p><br>
				<p>發票稅額 : ${Math.round(response.total_amount - (response.total_amount / 1.05))}</p><br>
				<p>發票總金額(商品價格+運費) : ${response.total_amount}</p><br>
				<p>運費：${response.estimated_shipping_fee}</p><br>
        <p>物流：${response.shipping_carrier}</p>
				<hr>
				`;
                    for (var i in response.items) {
                        detail += `
					<p>商品名稱：${response.items[i].item_name.split(" ")[0]+" "+response.items[i].item_name.split(" ")[1]}</p>
					<p>商品單價(折扣後)：${response.items[i].variation_discounted_price}</p>
					<p>商品銷售數量：${response.items[i].variation_quantity_purchased}</p><br>
					`;
                    }
                    $("#orderDetail .modal-body").append(detail);
                } else {
                    $("#orderDetail .modal-body").append(`<h1 class="h2" style="text-align:center;">查無訂單<br><br>${ordersn}</h1>`);
                }
                $("#orderDetail").modal('show');
            }
        });
    }

    //查找多筆訂單詳細資料
    function getOrdersDetail(ordersns) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: '/orders/detail',
                type: 'POST',
                data: {
                    ordersn: ordersns,
                    shopeesecret: $("#shopeesecret").val(),
                    shopeeshopid: $("#shopeeshopid").val(),
                    shopeepartnerid: $("#shopeepartnerid").val()
                },
                success: function (response) {
                    for (var x in response) {
                        Page[response[x].ordersn].detail = response[x];
                        for (var y in response[x].items) {
                            var item = response[x].items[y];
                            if (shopList[item.item_id]) {
                                if (shopList[item.item_id].type[item.variation_id]) {
                                    shopList[item.item_id].type[item.variation_id].amount += item.variation_quantity_purchased;
                                } else {
                                    shopList[item.item_id].type[item.variation_id] = {
                                        amount: item.variation_quantity_purchased,
                                        typename: item.variation_name,
                                        price: item.variation_original_price
                                    }
                                }
                            } else {
                                shopList[item.item_id] = {
                                    name: item.item_name,
                                    type: {},
                                    sku: item.item_sku
                                }
                                shopList[item.item_id].type[item.variation_id] = {
                                    amount: item.variation_quantity_purchased,
                                    typename: item.variation_name,
                                    price: item.variation_original_price
                                }
                            }
                        }
                    }
                    resolve();
                }
            });
        });
    }

    function getOrderLogistic(ordersn) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: '/orders/' + ordersn + '/logistic',
                type: 'POST',
                data: {
                    shopeesecret: $("#shopeesecret").val(),
                    shopeeshopid: $("#shopeeshopid").val(),
                    shopeepartnerid: $("#shopeepartnerid").val()
                },
                success: function (response) {
                    if (response.tracking_info && response.tracking_info.length > 0 && response.tracking_info[0].description.indexOf('包裹配達') != -1) {
                        resolve(response);
                    } else {
                        resolve('');
                    }
                }
            });
        });
    }

    //訂單排序
    function sortPage() {
        Page = Object.keys(Page).map(function (key) {
            return Page[key];
        });
        if ($("#carrier").val() != "否") {
            console.time("filter");
            Page = Page.filter(function (ele) {
                if (ele.detail) {
                    return ele.detail.shipping_carrier == $("#carrier").val();
                } else {
                    return false;
                }
            });
            console.timeEnd("filter");
        }
        if ($("#orderamount").val() != "否") {
            console.time("sort");
            Page.sort(function (a, b) {
                return b.detail.total_amount - a.detail.total_amount;
            });
            console.timeEnd("sort");
        }
    }

    $('#datetimepickertf').datetimepicker({
        format: "YYYY/MM/DD"
    });

    $('#datetimepickertt').datetimepicker({
        format: "YYYY/MM/DD",
        useCurrent: false
    });

    $("#datetimepickertf").on("dp.change", function (e) {
        $('#datetimepickertt').data("DateTimePicker").minDate(e.date);
    });

    $("#datetimepickertt").on("dp.change", function (e) {
        $('#datetimepickertf').data("DateTimePicker").maxDate(e.date);
    });

    $("#pageTop,#pageBot").on("change", function () {
        var page = $(this).val() - 1;
        nowPage = page;
        $("#pageTop,#pageBot").val($(this).val());
        refreshTable(page);
    });

    $("#search").on('click', function () {
        if ($('#ordersn').val() == '') {
            if ($('#arrive').val() == '是') {
                var status = 2;
                searchArrive = 1;
                $('#limittime').text('最晚取貨時間');
                $('#buyernote').hide();
            } else {
                var status = 1;
                searchArrive = 0;
                $('#limittime').text('最晚出貨時間');
                $('#buyernote').show();
            }
            if ($("#tt").val() != "" && $("#tf").val() != "") {
                if (((Math.floor(new Date($("#tt").val()).getTime() / 1000) + (24 * 60 * 60) - 1) - Math.floor(new Date($("#tf").val()).getTime() / 1000)) <= 15 * 86400) {
                    start();
                    getNote(Math.floor(new Date($("#tf").val()).getTime() / 1000), Math.floor(new Date($("#tt").val()).getTime() / 1000), function () {
                        $.ajax({
                            url: '/orders?status=' + status,
                            type: 'POST',
                            data: {
                                tt: $("#tt").val(),
                                tf: $("#tf").val(),
                                page: 0,
                                shopeesecret: $("#shopeesecret").val(),
                                shopeeshopid: $("#shopeeshopid").val(),
                                shopeepartnerid: $("#shopeepartnerid").val()
                            },
                            success: function (response) {
                                if (response.list) {
                                    for (var i in response.list) {
                                        if (!Page[response.list[i].ordersn]) {
                                            Page[response.list[i].ordersn] = response.list[i];
                                            orderSn.push(response.list[i].ordersn);
                                        }
                                    }
                                    if (response.more === true) {
                                        getNextPage(1);
                                    } else {
                                        if ($('#arrive').val() == '是') {
                                            showArrive(orderSn);
                                        } else {
                                            showShip(orderSn);
                                        }
                                    }
                                } else {
                                    stop();
                                    toastr.warning("請檢查蝦皮金鑰是否出錯");
                                }
                            }
                        });
                    });
                } else {
                    alert("日期間隔請設定在15天內");
                }
            }
        } else {
            getOrder($('#ordersn').val());
        }
    });

    $("#setting").on("click", function () {
        $("#settingForm").modal("show");
    });

    $("#save").on("click", function () {
        localStorage.setItem("shopeesecret", $("#shopeesecret").val());
        localStorage.setItem("shopeeshopid", $("#shopeeshopid").val());
        localStorage.setItem("shopeepartnerid", $("#shopeepartnerid").val());
    });

    $("#itemsdetail").on("click", function () {
        $("#itemlist").empty();
        var result = "";
        var title = 0;
        var count = 1;
        for (var i in shopList) {
            if (i == 'tt' || i == 'tf' || i == 'carrier') continue;
            var typeamt = Object.keys(shopList[i].type).length;
            result += `<tr><td rowspan="${typeamt}">${count}</td><td rowspan="${typeamt}">${shopList[i].name}</td><td rowspan="${typeamt}">${shopList[i].sku}</td>`
            for (var j in shopList[i].type) {
                if (title == 0) {
                    title = 1;
                    result += `<td>${shopList[i].type[j].price}</td><td>${shopList[i].type[j].typename}</td><td>${shopList[i].type[j].amount}</td></tr>`;
                } else {
                    result += `<tr><td>${shopList[i].type[j].price}</td><td>${shopList[i].type[j].typename}</td><td>${shopList[i].type[j].amount}</td></tr>`;
                }
            }
            count += 1;
            title = 0;
        }
        result += '</tr>';
        $("#itemlist").append(result);
        $("#items").modal('show');
    });

    $("#exportitemsdetail").on('click', function () {
        $.ajax({
            headers: {
                "Content-Type": "application/json"
            },
            url: '/orders/genexcel',
            type: 'POST',
            data: JSON.stringify(shopList),
            success: function (response) {
                if (response != 'err') {
                    window.open('/orders/downloadexcel', '_blank');
                } else {
                    console.log("err");
                }
            }
        });
    });

    function addNote(sn, ts) {
        var content = prompt("請輸入內容");
        if (content != null && content != "") {
            $.ajax({
                url: '/notes',
                type: 'POST',
                data: {
                    sn: sn,
                    content: content,
                    order_time: ts
                },
                success: function (response) {
                    if (response == "ok") {
                        noteList[sn] = content;
                        refreshTable(nowPage);
                    }
                }
            });
        }
    }

    function updateNote(sn) {
        var content = prompt("請輸入內容");
        if (content != null && content != "") {
            $.ajax({
                url: '/notes/' + sn,
                type: 'PUT',
                data: {
                    content: content
                },
                success: function (response) {
                    if (response == "ok") {
                        noteList[sn] = content;
                        refreshTable(nowPage);
                    }
                }
            });
        }
    }

    function delNote(sn) {
        $.ajax({
            url: '/notes/' + sn,
            type: 'DELETE',
            success: function (response) {
                if (response == "ok") {
                    delete noteList[sn];
                    refreshTable(nowPage);
                }
            }
        });
    }

    function getNote(tf, tt, cb) {
        tf = parseInt(tf);
        tt = parseInt(tt) + 86400;
        $.ajax({
            url: '/notes?tf=' + tf + '&tt=' + tt,
            type: 'GET',
            success: function (response) {
                noteList = response;
                cb();
            }
        });
    }

    function chunk(arr, size) {
        return Array.from({
            length: Math.ceil(arr.length / size)
        }, function (v, i) {
            return arr.slice(i * size, i * size + size);
        });
    }
});