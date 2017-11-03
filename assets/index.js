$(document).ready(function() {
	var Page = [];
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
				Page.push(response.list);
				if (response.more === true) {
					getAllpage(page + 1);
				} else {
					$(".hint").hide();
					$("#allDateGenInv").show();
					showPageSelect();
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
		$("#orderlist").empty();
		if (data.length < 1) {
			var row = `<tr>
									<td colspan="4" class="text-center">查無資料</td>
								</tr>`
			$("#orderlist").append(row);
		} else {
			for (var i in data) {
				var date = new Date(data[i].update_time * 1000);
				var datestring = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate() + " " + ((date.getHours() < 10) ? ("0" + date.getHours()) : (date.getHours())) + ":" + ((date.getMinutes() < 10) ? ("0" + date.getMinutes()) : (date.getMinutes()));
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
				var row = `<tr>`;
				if (List.indexOf(data[i].ordersn) == -1) { row += `<td><input class="orderCheck" type="checkbox" data-id="${data[i].ordersn}" value="${data[i].ordersn}"></td>` } else { row += '<td></td>' }
				row += `<td>${data[i].ordersn}</td>
								<td>${datestring}</td>
								<td>${data[i].order_status}</td><td>`;
				if (List.indexOf(data[i].ordersn) == -1) row += `<div class="btn btn-primary genInv" data-id="${data[i].ordersn}">開立發票</div> `;
				row += `<div class="btn btn-primary detail" data-id="${data[i].ordersn}">詳細資料</div></td></tr>`;
				$("#orderlist").append(row);
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

	function genInv(ordersn) {
		$.ajax({
			url: '/api/geninv',
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
				if (response == "發票開立成功" || response == "已開過發票") {
					List.push(ordersn);
					$(`.genInv[data-id=${ordersn}]`).remove();
					$(`.orderCheck[data-id=${ordersn}]`).remove();
					toastr.success(`訂單編號 ${ordersn} ${response}`)
				} else if(response=="解密錯誤") {
					toastr.warning("請檢查智付寶金鑰");
				}
				else if(response=="取得商店申請資格失敗"){
					toastr.warning("請確認商店已開通電子發票功能");
				}
				else{
					toastr.warning(`訂單編號 ${ordersn} ${response}`)
				}
				console.log(ordersn + "-" + response);
			}
		});
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
				$("#orderDetail .modal-body").empty();
				var detail = `
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

	$.ajax({
		url: '/api/invlist',
		type: 'get',
		success: function(response) {
			List = response;
		}
	});

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
						if(response.list){
							refreshTable(response.list);
							if (response.more === true) {
								$(".hint").show();
								getAllpage(0)
							}
						}else{
							toastr.warning("請檢查蝦皮金鑰是否出錯");
						}
					}
				});
			} else {
				alert("日期間隔請設定在15天內");
			}
		}
	});

	$("#allcheck").change(function() {
		var checks = $(".orderCheck");
		if (this.checked) {
			for (var i in checks) {
				checks[i].checked = true;
				CheckAmt += 1;
				$("#allSelectGenInv").show();
			}
		} else {
			for (var i in checks) {
				checks[i].checked = false;
				CheckAmt -= 1;
				$("#allSelectGenInv").hide();
			}
		}
	});

	$("#allSelectGenInv").on("click", function() {
		var checks = $(".orderCheck");
		var genInvList = [];
		for (var i in checks) {
			if (checks[i].checked) genInv(checks[i].value);
		}
	});

	$("#allDateGenInv").on("click", function() {
		for (var i in Page) {
			for (var j in Page[i]) {
				genInv(Page[i][j].ordersn);
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
});
