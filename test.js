var qs = require('querystring');
var request = require('request');
var hashKey = '5KiA4TVFBS0xMG2kAUwvbAlFFW8VRIq9';
var hashIV = 'N3eQ2vLZrXxCNgzx';
var taxRate = 0.05;
var MCrypt = require('mcrypt').MCrypt;
var rijEcb = new MCrypt('rijndael-128','cbc');
rijEcb.open(hashKey,hashIV);
var shopeeData = {
	ordersn : Math.floor(Date.now() / 1000),
	recipient_address:{
		name:"Derek"
	},
	items:[{
		item_name:"衣物",
		item_sku:"件",
		variation_discounted_price:"500",
		variation_quantity_purchased:"2"
	}],
	total_amount:"1050"
}

var data = {
	RespondType: "JSON",
	Version: "1.4",
	TimeStamp: Math.floor(Date.now() / 1000),
	MerchantOrderNo: shopeeData.ordersn,
	Status:"1",
	Category: "B2C",
	BuyerName: shopeeData.recipient_address.name,
	BuyerEmail: "test@gmail.com",
	PrintFlag: "Y",
	TaxType: "1",
	TaxRate: "5",
	Amt: "1000",
	TaxAmt: "50",
	TotalAmt: shopeeData.total_amount,
	ItemName: shopeeData.items[0].item_name,
	ItemCount: shopeeData.items[0].variation_quantity_purchased,
	ItemUnit: shopeeData.items[0].item_sku,
	ItemPrice: shopeeData.items[0].variation_discounted_price,
	ItemAmt:shopeeData.items[0].variation_quantity_purchased*shopeeData.items[0].variation_discounted_price
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

request({
    method:'post',
    url:'https://cinv.pay2go.com/api/invoice_issue',
    formData:{
        MerchantID_:'3709908',
        PostData_:postdata(data)
    }
},function(e,r,b){
    console.log(b);
});
