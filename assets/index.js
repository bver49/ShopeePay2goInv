$(document).ready(function() {
	var Page = [];
  var List;

	function getAllpage(page, cb) {
		$.ajax({
			url: '/api/orders',
			type: 'POST',
			data: {
				tt: $("#tt").val(),
				tf: $("#tf").val(),
				page: page
			},
			success: function(response) {
				Page.push(response.list);
				if (response.more === true) {
					getAllpage(page + 1);
				} else {
					$(".hint").hide();
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
				var row = `<tr>
									<td>${data[i].ordersn}</td>
									<td>${datestring}</td>
									<td>${data[i].order_status}</td>
									<td>`;
				if(List.indexOf(data[i].ordersn)==-1) row+=`<div class="btn btn-primary genInv" data-id="${data[i].ordersn}">開立發票</div> `;
				row += `<div class="btn btn-primary detail" data-id="${data[i].ordersn}">詳細資料</div></td></tr>`;
				$("#orderlist").append(row);
			}
			$(".genInv").on("click", function() {
				genInv($(this).data("id"));
			});
			$(".detail").on("click", function() {
				getOrder($(this).data("id"));
			});
		}
	}

	function genInv(ordersn) {
		$.ajax({
			url: '/api/geninv',
			type: 'POST',
			data: {
				ordersn:ordersn
			},
			success: function(response) {
				if(response=="發票開立成功"){
					$(`.genInv[data-id=${ordersn}]`).remove();
				}
				alert(response);
				console.log(response);
			}
		});
	}

	function getOrder(ordersn) {
		$.ajax({
			url: '/api/order',
			type: 'POST',
			data: {
				ordersn: ordersn
			},
			success: function(response) {
				$("#orderDetail .modal-body").empty();
				var detail =`
				<p>訂購人 : ${response.recipient_address.name}</p><br>
				<p>手機 : ${response.recipient_address.phone}</p><br>
        <p>訂單編號 : ${response.ordersn}</p><br>
				<p>銷售額(未稅) : ${Math.round(response.total_amount / 1.05)}</p><br>
				<p>發票稅額 : ${Math.round(response.total_amount - (response.total_amount / 1.05))}</p><br>
				<p>發票總金額(商品價格+運費) : ${response.total_amount}</p><br>
				<p>運費：${response.estimated_shipping_fee}</p>
				<hr>
				`;
				for(var i in response.items){
        	detail+=`
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
						page: 0
					},
					success: function(response) {
						refreshTable(response.list);
						if (response.more === true) {
							$(".hint").show();
							getAllpage(0)
						}
					}
				});
			} else {
				alert("日期間隔請設定在15天內");
			}
		}
	});
});
