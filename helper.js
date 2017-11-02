var crypto = require('crypto');
var request = require('request');
var qs = require('querystring');
var MCrypt = require('mcrypt').MCrypt;
var secret = require('./config').secret;;
var hashKey = require('./config').hashKey;
var hashIV = require('./config').hashIV;
var merchantID = require('./config').merchantID;

var taxRate = 0.05;
var rijEcb = new MCrypt('rijndael-128', 'cbc');
rijEcb.open(hashKey, hashIV);
var emailReg = new RegExp(/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/i);

function dateToTs(date){
	if (date == "now") {
		return Math.floor(new Date().getTime() / 1000);
	} else {
		return Math.floor((new Date(date).getTime() + (480 * 60 * 1000)) / 1000);
	}
}

function encode(url, data) {
	var basestring = url.concat('|', JSON.stringify(data));
	return crypto.createHmac('sha256', secret).update(basestring).digest('hex');
}

module.exports.getOrderList = function(tf, tt, page, cb) {
	var data = {
		"shopid": require('./config').shopid,
		"partner_id": require('./config').partner_id,
		"timestamp": Math.floor(new Date().getTime() / 1000),
		"order_status":"COMPLETED",
		"create_time_to": dateToTs(tt),
		"create_time_from": dateToTs(tf),
		"pagination_entries_per_page":50, //一頁呈現的訂單數目
		"pagination_offset": parseInt(page)*50 //第幾頁
	}
	var url = 'https://partner.shopeemobile.com/api/v1/orders/get';
	request({
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': encode(url, data)
		},
		url: url,
		json: data
	}, function(e, r, b) {
		if (b.error) console.log(b.error);
		cb(b.orders, b.more);
	});
}

module.exports.getOrderDetail = function(orders, cb) {
	if (typeof orders == "string") {
		orders = [orders];
	}
	var data = {
		"shopid": require('./config').shopid,
		"partner_id": require('./config').partner_id,
		"timestamp": Math.floor(new Date().getTime() / 1000),
		"ordersn_list": orders
	}
	var url = 'https://partner.shopeemobile.com/api/v1/orders/detail';
	request({
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': encode(url, data)
		},
		url: url,
		json: data
	}, function(e, r, b) {
		if (b.error) console.log(b.error);
		if (b.orders.length > 1) {
			b.orders
			cb(b.orders)
		} else {
			cb(b.orders[0]);
		}
	});
}

//pay2go
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
			if(title == "item_sku") {
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

function postdata(data) {
	return rijEcb.encrypt(padding(qs.stringify(data))).toString('hex').trim();
}

module.exports.genInvoice =function(shopeeData,cb) {
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
		request({
			method: 'post',
			url: 'https://cinv.pay2go.com/api/invoice_issue',
			formData: {
				MerchantID_: merchantID,
				PostData_: postdata(data)
			}
		}, function(e, r, b) {
			b = JSON.parse(b);
			if(b.Message.indexOf("重覆")!==-1 || b.Message.indexOf("重複")!==-1){
				console.log("已開過發票");
				cb("已開過發票");
			}else if(b.Message.indexOf("成功")!==-1){
				console.log("發票開立成功");
				cb("發票開立成功");
			}
			else{
				console.log(b.Message);
				cb(b.Message);
			}
		});
	} else {
		cb("訂單尚未完成");
	}
}
