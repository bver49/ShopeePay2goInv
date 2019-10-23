var request = require('request');
var qs = require('querystring');
var rijndael = require('rijndael-js');
var emailReg = new RegExp(/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/i);

function countOrigin(amount) {
    return Math.round(amount / 1.05);
}

function countTax(amount) {
    return Math.round(amount - (amount / 1.05));
}

function arrobjToStr(arr, title, invitemname) {
    var str = "";
    for (var i in arr) {
        if (typeof title === "string") {
            if (title == "item_name") {
                arr[i][title] = (invitemname == '') ? (arr[i][title].split(" ")[0]) : (invitemname);
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
    var cipher = new rijndael(key, 'cbc');
    return Buffer.from(cipher.encrypt(padding(qs.stringify(data)), 128, iv)).toString('hex').trim();
}

//開發票
module.exports.genInvoice = function (shopeeData, key, cb) {
    var data = {
        RespondType: "JSON",
        Version: "1.4",
        TimeStamp: Math.floor(new Date().getTime() / 1000),
        MerchantOrderNo: shopeeData.ordersn,
        Status: "1",
        Category: "B2C",
        BuyerName: shopeeData.recipient_address.name,
        BuyerEmail: shopeeData.message_to_seller.match(emailReg) ? shopeeData.message_to_seller.match(emailReg)[0] : key.invemail,
        PrintFlag: "Y",
        TaxType: "1",
        TaxRate: "5",
        Amt: countOrigin(shopeeData.total_amount), //銷售額(未稅)
        TaxAmt: countTax(shopeeData.total_amount), //發票稅額
        TotalAmt: shopeeData.total_amount, //發票總金額(含稅) 商品價格+運費
        ItemName: (shopeeData.invitemname == '') ? '服飾' : shopeeData.invitemname, //商品名稱以 | 分隔
        ItemCount: '1', //商品數量以 |分隔
        ItemUnit: '件', //單位以 | 分隔
        ItemPrice: shopeeData.total_amount.toString(), //單價以 | 分隔
        ItemAmt: shopeeData.total_amount.toString() //含稅金額以 | 分隔
    }
    if (shopeeData.order_status == "COMPLETED") {
        try {
            request({
                method: 'post',
                url: key.invurl,
                formData: {
                    MerchantID_: key.paytwogoid,
                    PostData_: postdata(data, key.paytwogohashkey, key.paytwogohashiv)
                }
            }, function (err, response, body) {
                body = JSON.parse(body);
                if (body.Message.indexOf("重覆") !== -1 || body.Message.indexOf("重複") !== -1) {
                    console.log("已開過發票");
                    cb({
                        "msg":"已開過發票",
                        "detail": body
                    });
                } else if (body.Message.indexOf("成功") !== -1) {
                    console.log("發票開立成功");
                    cb({
                        "msg":"發票開立成功",
                        "detail": body
                    });
                } else {
                    console.log(body.Message);
                    cb({"msg":body.Message});
                }
            });
        } catch (err) {
            cb({"msg":"解密錯誤"});
        }
    } else {
        cb({"msg":"訂單尚未完成"});
    }
}