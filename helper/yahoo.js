var request = require('request');
var crypto = require('crypto');
var emojiRegex = require('emoji-regex');
var emojiReg = emojiRegex();
var config = require('../config');
var enums = require('../enum');
var imageField = "ImageFile";
var yahooAPIkey = config.yahoo.apikey;
var yahooAPISecret = config.yahoo.apisecret;

function cutShort(str, limit){
    limit = Math.floor(limit/3);
    str = str.replace(emojiReg, "");
    var len = str.length;
    if (len > limit) {
        str = str.split(" ");
        for (var i = 0 ; len > limit ; i++){
            str.splice(str.length - 1, 1);
            len = str.join(" ").length;
        }
        return str.join(" ");
    } else {
        return str;
    }
}

function callAPI(url, data){
    return new Promise(function(resolve, reject){
        var hasImg = false;
        var formData = {};
        var QueryString = "";
        if (typeof data !== "undefined" && Object.keys(data).length > 0) {
            for (var i in data){
                if ( i != "ImageFile") {
                    if (Array.isArray(data[i])) {
                        for (var j in data[i]) {
                            QueryString += `&${i}=${data[i][j]}`;
                        }
                    } else {
                        QueryString += `&${i}=${data[i]}`;
                    }
                } else {
                    hasImg = true;
                }
            }
        }
        if (hasImg) {
            for (var i in data[imageField]) {
                var index = parseInt(i)+1;
                formData[imageField + index] = request.get(data[imageField][i]);
            }
        }
        var ts = Math.floor(new Date().getTime() / 1000);
        var RequestContent = `ApiKey=${yahooAPIkey}&TimeStamp=${ts}&Format=json${QueryString}`;
        var Signature = crypto.createHmac('sha1', yahooAPISecret).update(RequestContent).digest('hex');
        RequestContent = encodeURI(RequestContent)
                        .replace(/\#/g, "%23")
                        .replace(/\\/g, "%5C")
                        .replace(/\?/g, "%3F")
                        .replace(/\+/g, "%2B")
                        .replace(/\:/g, "%3A")
                        .replace(/\n/g, "%0A");
        url = url + "?" + RequestContent + "&Signature=" + Signature;
        request({
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            formData: formData,
            url: url
        }, function (e, r, b) {
            var res = JSON.parse(b).Response;
            if (res['@Status'] != 'fail') {
                resolve(res);
            } else {
                reject(res);
            }
        });
    });
}

function submitVerifyMain(data){
    return new Promise(function(resolve,reject){
        var url = "https://tw.ews.mall.yahooapis.com/stauth/v2/Product/SubmitVerifyMain";
        callAPI(url, data).then(function (res) {
            resolve(res);
        }).catch(function(err){
            err["FailAt"] = "submitVerifyMain";
            reject(err);
        });
    });
}

function submitMain(data) {
    return new Promise(function (resolve, reject) {
        var url = "https://tw.ews.mall.yahooapis.com/stauth/v2/Product/SubmitMain";
        callAPI(url, data).then(function (res) {
            resolve(res);
        }).catch(function (err) {
            err["FailAt"] = "submitMain";
            reject(err);
        });
    });
}

function uploadImage(data) {
    return new Promise(function (resolve, reject) {
        var url = "https://tw.ews.mall.yahooapis.com/stauth/v1/Product/UploadImage";
        callAPI(url, data).then(function (res) {
            resolve(res);
        }).catch(function (err) {
            err["FailAt"] = "uploadImage";
            reject(err);
        });
    });
}

function addItem(data) {
    var shopeeData = data;
    var itemId = shopeeData.item_id;
    var productId = "";
    return new Promise(function (resolve, reject) {
        var data = {
            "SaleType": "Normal",
            "ProductName": cutShort(shopeeData.name,130),
            "SalePrice": shopeeData.price,
            "MallCategoryId": [
                enums.category.mancloth
            ],
            "ShortDescription": cutShort(shopeeData.name,50),
            "LongDescription": cutShort(shopeeData.description,5000),
            "PayTypeId": enums.paytype.atm,
            "ShippingId": enums.shiptype.mail
        }
        if (shopeeData.has_variation == true) {
            data["SpecTypeDimension"] = "1";
            for (var i in shopeeData.variations) {
                data["SpecDimension1"] = "尺寸";
                data["SpecDimension1Description"] = "商品尺寸";
            }
        }
        submitVerifyMain(data).then(function(res) {
            return submitMain(data);
        }).then(function (res) {
            productId = res.ProductId;
            var image = {
                "ImageFile": shopeeData.images,
                "ProductId": productId,
                "MainImage": "ImageFile1",
                "Purge": true
            }
            return uploadImage(image);
        }).then(function (res) {
            resolve({
                '@Status': 'Success',
                'shopeeItemId' : itemId,
                'productId': productId
            });
        }).catch(function (err) {
            err["shopeeItemId"] = itemId;
            err["productId"] = productId;
            if (err.ErrorList) {
                err.ErrorList = err.ErrorList.Error.map(function(ele){
                    return ele.Parameter + " -> " + ele.Message;
                });
            }
            reject(err);
        });
    });
}

module.exports = {
    "callAPI": callAPI,
    "addItem": addItem
}