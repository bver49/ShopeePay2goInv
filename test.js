var qs = require('querystring');
var request = require('request');
var hashKey = 'AACjA9xGbtzGA25zOgSRNmiqCSBxHWsM';
var hashIV = 'ronpsXUU8SVkHcRY';
var MCrypt = require('mcrypt').MCrypt;
var rijEcb = new MCrypt('rijndael-128','cbc');
rijEcb.open(hashKey,hashIV);

var data = {
	RespondType: "JSON",
	Version: "1.4",
	TimeStamp: Math.floor(Date.now() / 1000),
	MerchantOrderNo: Math.floor(Date.now() / 1000),
	Status: 1,
	Category: "B2C",
	BuyerName: "Derek",
	BuyerEmail: "s@gmail.com",
	PrintFlag: "Y",
	TaxType: "1",
	TaxRate: "5",
	Amt: "1000",
	TaxAmt: "50",
	TotalAmt: "1050",
	ItemName: "衣物",
	ItemCount: "2",
	ItemUnit: "件",
	ItemPrice: "500"
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
    url:'https://cinv.pay2go.com/API/invoice_issue',
    formData:{
        MerchantID_:'PG100000003009',
        PostData_:postdata(data)
    }
},function(e,r,b){
    console.log(b);
});
