$(document).ready(function() {
	var Page = [];
	var shopList = {};
	var orderSn = [];

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

	function getNextPage(page) {
		$.ajax({
			url: '/api/orders?status=2',
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
						Page.push(response.list[i]);
						orderSn.push(response.list[i].ordersn);
					}
				}
				if (response.more === true) {
					getNextPage(page + 1);
				} else {
					if ($("#carrier").val() == "否" && $("#orderamount").val() == "否" && $("#itemscount").val() == "否") {
						refreshTable(0);
						showPageSelect();
					} else {
						if (Page.length > 0) {
							getOrdersDetail(orderSn, 0);
						} else {
							refreshTable(0);
							showPageSelect();
						}
					}
				}
			}
		});
	}

	function showPageSelect() {
		console.log(shopList);
		stop();
		var pageAmt = Math.floor(Page.length / 50) + 1;
		for (var i = 1; i <= pageAmt; i++) {
			$("#pageTop").append(`<option>${i}</option>`);
			$("#pageBot").append(`<option>${i}</option>`);
		}
	}

	function start() {
		console.time("count");
		$("#pageTop").hide();
		$("#pageBot").hide();
		$("#search").hide();
		$("#itemsdetail").hide();
		$("#orderlist").empty();
		$(".hint").show();
	}

	function stop() {
		if ($("#itemscount").val() == "是") $("#itemsdetail").show();
		$(".hint").hide();
		$("#pageTop").empty();
		$("#pageBot").empty();
		$("#pageTop").show();
		$("#pageBot").show();
		$("#search").show();
	}

	function refreshTable(page) {
		$("#orderlist").empty();
		if (Page.length < 1) {
			var row = `<tr>
									<td colspan="5" class="text-center">查無資料</td>
								</tr>`
			$("#orderlist").append(row);
		} else {
			for (var i = page * 50; i < (page + 1) * 50 && i < Page.length; i++) {
				if (Page[i].order_status == 'READY_TO_SHIP') {
					var update = new Date(Page[i].update_time * 1000);
					var updatestring = update.getFullYear() + "/" + (update.getMonth() + 1) + "/" + update.getDate() + " " + ((update.getHours() < 10) ? ("0" + update.getHours()) : (update.getHours())) + ":" + ((update.getMinutes() < 10) ? ("0" + update.getMinutes()) : (update.getMinutes()));
					var row = `<tr><td>${i+1}</td><td>${Page[i].ordersn}</td>
						<td>${updatestring}</td>
						<td>準備出貨</td><td>
            <a href="https://seller.shopee.tw/portal/sale?search=${Page[i].ordersn}" target="_blank" class="btn btn-primary">出貨</a>
            <div class="btn btn-primary detail" data-id="${Page[i].ordersn}">詳細資料</div></td></tr>`;
					$("#orderlist").append(row);
				}
			}
			$(".detail").on("click", function() {
				getOrder($(this).data("id"));
			});
			console.timeEnd("count");
		}
	}

	function getOrder(ordersn) {
		$.ajax({
			url: '/api/order/detail',
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
				console.log(response);
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
		refreshTable(page);
	});

	$("#search").on('click', function() {
		if ($("#tt").val() != "" && $("#tf").val() != "") {
			if ((Math.floor(new Date($("#tt").val()).getTime() / 1000) - Math.floor(new Date($("#tf").val()).getTime() / 1000)) <= 15 * 24 * 3600) {
				start();
				$.ajax({
					url: '/api/orders?status=2',
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
						if (response.list) {
							for (var i in response.list) {
								Page.push(response.list[i]);
								orderSn.push(response.list[i].ordersn);
							}
							if (response.more === true) {
								getNextPage(0)
							} else {
								if ($("#carrier").val() == "否" && $("#orderamount").val() == "否" && $("#itemscount").val() == "否") {
									refreshTable(0);
									showPageSelect();
								} else {
									if (Page.length > 0) {
										getOrdersDetail(orderSn, 0);
									} else {
										refreshTable(0);
										showPageSelect();
									}
								}
							}
						} else {
							stop();
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

	$("#itemsdetail").on("click", function() {
		$("#itemlist").empty();
		var result = "";
		var title = 0;
		var count = 1;
		for (var i in shopList) {
			var typeamt = Object.keys(shopList[i].type).length;
			result += `<tr><td rowspan="${typeamt}">${count}</td><td rowspan="${typeamt}">${shopList[i].name}</td>`
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

	function sortPage() {
		if ($("#carrier").val() != "否") {
			for (var i in Page) {
				if (Page[i].detail.shipping_carrier != $("#carrier").val()) {
					Page.splice(i, 1);
				}
			}
		}
		if ($("#orderamount").val() != "否") {
			Page.sort(function(a, b) {
				return b.detail.total_amount - a.detail.total_amount;
			});
		}
	}

	function getOrdersDetail(ordersns, page) {
		var data = ordersns.slice(page * 50, (page + 1) * 50);
		var index = page * 50;
		$.ajax({
			url: '/api/orders/detail',
			type: 'POST',
			data: {
				ordersn: data,
				shopeesecret: $("#shopeesecret").val(),
				shopeeshopid: $("#shopeeshopid").val(),
				shopeepartnerid: $("#shopeepartnerid").val(),
				paytwogoid: $("#paytwogoid").val(),
				paytwogohashkey: $("#paytwogohashkey").val(),
				paytwogohashiv: $("#paytwogohashiv").val()
			},
			success: function(response) {
				for (var x in response) {
					if (parseInt(x) + (page * 50) >= Page.length) break;
					Page[parseInt(x) + (page * 50)].detail = response[x];
					index++;
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
								type: {}
							}
							shopList[item.item_id].type[item.variation_id] = {
								amount: item.variation_quantity_purchased,
								typename: item.variation_name,
                price: item.variation_original_price
							}
						}
					}
				}
				if (index >= ordersns.length - 1) {
					sortPage();
					refreshTable(0);
					showPageSelect();
				} else {
					getOrdersDetail(orderSn, page + 1);
				}
			}
		});
	}
});
