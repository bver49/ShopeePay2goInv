var crypto = require('crypto');
var request = require('request');
var qs = require('querystring');
var MCrypt = require('mcrypt').MCrypt;
var taxRate = 0.05;
var rijEcb = new MCrypt('rijndael-128', 'cbc');
var emailReg = new RegExp(/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/i);

//shopee util
function dateToTs(date) {
	if (date == "now") {
		return Math.floor(new Date().getTime() / 1000);
	} else {
		return Math.floor((new Date(date).getTime() - (60 * 8 * 60000)) / 1000);
	}
}

function encode(url, data, secret) {
	var basestring = url.concat('|', JSON.stringify(data));
	return crypto.createHmac('sha256', secret).update(basestring).digest('hex');
}
//shopee util

//pay2go util
function countOrigin(amount) {
	return Math.round(amount / 1.05);
}

function countTax(amount) {
	return Math.round(amount - (amount / 1.05));
}

function arrobjToStr(arr, title) {
	var str = "";
	for (var i in arr) {
		if (typeof title === "string") {
			if (title == "item_name") {
				arr[i][title] = arr[i][title].split(" ")[0];
			}
			if (title == "item_sku") {
				arr[i][title] = "件"
			}
			str += arr[i][title];
		} else {
			str += (arr[i].variation_quantity_purchased * arr[i].variation_discounted_price);
		}
		if (i != arr.length - 1) str += "|"
	}
	return str;
}

function padding(str) {
	var len = str.length
	var pad = 32 - (len % 32)
	str += String.fromCharCode(pad).repeat(pad)
	return str
}

function postdata(data, key, iv) {
	rijEcb.open(key, iv);
	return rijEcb.encrypt(padding(qs.stringify(data))).toString('hex').trim();
}
//pay2go util

//依照訂單更新時間查找
module.exports.getOrderList = function(tf, tt, page, key, cb) {
	var data = {
		"shopid": parseInt(key.shopeeshopid),
		"partner_id": parseInt(key.shopeepartnerid),
		"timestamp": Math.floor(new Date().getTime() / 1000),
		"update_time_to": dateToTs(tt),
		"update_time_from": dateToTs(tf),
		"pagination_entries_per_page": 100, //一頁呈現的訂單數目
		"pagination_offset": parseInt(page) * 100 //第幾頁
	}
	var url = 'https://partner.shopeemobile.com/api/v1/orders/basics';
	request({
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': encode(url, data, key.shopeesecret)
		},
		url: url,
		json: data
	}, function(e, r, b) {
		if (!b.orders || b.error) {
			console.log(b.error);
			console.log(data);
			cb([], false);
		} else {
			cb(b.orders, b.more);
		}
	});
}

//依照訂單狀態查找
module.exports.getOrderListByStatus = function(tf, tt, page, status, key, cb) {
	tt = dateToTs(tt);
	tf = dateToTs(tf);
	if (tt == tf) tt = tf + (24 * 3600);
	var data = {
		"shopid": parseInt(key.shopeeshopid),
		"partner_id": parseInt(key.shopeepartnerid),
		"timestamp": Math.floor(new Date().getTime() / 1000),
		"create_time_to": tt,
		"create_time_from": tf,
		"pagination_entries_per_page": 100, //一頁呈現的訂單數目
		"pagination_offset": parseInt(page) * 100, //第幾頁
		"order_status": status
	}
	var url = 'https://partner.shopeemobile.com/api/v1/orders/get';
	request({
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': encode(url, data, key.shopeesecret)
		},
		url: url,
		json: data
	}, function(e, r, b) {
		if (!b.orders || b.error) {
			console.log(b.error);
			console.log(data);
			cb([], false);
		} else {
			cb(b.orders, b.more);
		}
	});
}

//多筆訂單查找詳細資料
module.exports.getOrdersDetail = function(orders, key, cb) {
	var data = {
		"shopid": parseInt(key.shopeeshopid),
		"partner_id": parseInt(key.shopeepartnerid),
		"timestamp": Math.floor(new Date().getTime() / 1000),
		"ordersn_list": orders
	}
	var url = 'https://partner.shopeemobile.com/api/v1/orders/detail';
	request({
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': encode(url, data, key.shopeesecret)
		},
		url: url,
		json: data
	}, function(e, r, b) {
		if (!b.orders || b.error) {
			console.log(b.error);
			console.log(data);
			cb([]);
		} else {
			if (b.orders.length > 0) {
				cb(b.orders);
			} else {
				cb([]);
			}
		}
	});
}

//單筆訂單查找詳細資料
module.exports.getOrderDetail = function(ordersn, key, cb) {
	var data = {
		"shopid": parseInt(key.shopeeshopid),
		"partner_id": parseInt(key.shopeepartnerid),
		"timestamp": Math.floor(new Date().getTime() / 1000),
		"ordersn_list": [ordersn]
	}
	var url = 'https://partner.shopeemobile.com/api/v1/orders/detail';
	request({
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': encode(url, data, key.shopeesecret)
		},
		url: url,
		json: data
	}, function(e, r, b) {
		if (!b.orders || b.error) {
			console.log(b.error);
			console.log(data);
			cb([]);
		} else {
			if (b.orders.length > 0) {
				cb(b.orders[0]);
			} else {
				cb([]);
			}
		}
	});
}

//開發票
module.exports.genInvoice = function(shopeeData, key, cb) {
	var data = {
		RespondType: "JSON",
		Version: "1.4",
		TimeStamp: Math.floor(new Date().getTime() / 1000),
		MerchantOrderNo: shopeeData.ordersn,
		Status: "1",
		Category: "B2C",
		BuyerName: shopeeData.recipient_address.name,
		BuyerEmail: shopeeData.message_to_seller.match(emailReg) ? shopeeData.message_to_seller.match(emailReg)[0] : "c.p.max.tw@gmail.com",
		PrintFlag: "Y",
		TaxType: "1",
		TaxRate: "5",
		Amt: countOrigin(shopeeData.total_amount), //銷售額(未稅)
		TaxAmt: countTax(shopeeData.total_amount), //發票稅額
		TotalAmt: shopeeData.total_amount, //發票總金額(含稅) 商品價格+運費
		ItemName: arrobjToStr(shopeeData.items, 'item_name'), //商品名稱以 | 分隔
		ItemCount: arrobjToStr(shopeeData.items, 'variation_quantity_purchased'), //商品數量以 |分隔
		ItemUnit: arrobjToStr(shopeeData.items, 'item_sku'), //單位以 | 分隔
		ItemPrice: arrobjToStr(shopeeData.items, 'variation_discounted_price'), //單價以 | 分隔
		ItemAmt: arrobjToStr(shopeeData.items) //含稅金額以 | 分隔
	}
	if (shopeeData.order_status == "COMPLETED") {
		try {
			request({
				method: 'post',
				url: 'https://inv.pay2go.com/api/invoice_issue',
				formData: {
					MerchantID_: key.paytwogoid,
					PostData_: postdata(data, key.paytwogohashkey, key.paytwogohashiv)
				}
			}, function(e, r, b) {
				b = JSON.parse(b);
				if (b.Message.indexOf("重覆") !== -1 || b.Message.indexOf("重複") !== -1) {
					console.log("已開過發票");
					cb("已開過發票");
				} else if (b.Message.indexOf("成功") !== -1) {
					console.log("發票開立成功");
					cb("發票開立成功");
				} else {
					console.log(b.Message);
					cb(b.Message);
				}
			});
		} catch (err) {
			cb("解密錯誤")
		}
	} else {
		cb("訂單尚未完成");
	}
}
