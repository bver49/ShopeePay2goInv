var Promise = require("bluebird");
var request = require('request');
var crypto = require('crypto');
var emojiRegex = require('emoji-regex');
var emojiReg = emojiRegex();
// var emojiReg = /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/gu;
var config = require('../config');
var enums = require('../enum');
var imageField = "ImageFile";
var yahooAPIkey = config.yahoo.apikey;
var yahooAPISecret = config.yahoo.apisecret;

function callAPI(key, url, data){
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
                if (index > 9) break;
                formData[imageField + index] = request.get(data[imageField][i]);
            }
        }
        var ts = Math.floor(new Date().getTime() / 1000);
        var RequestContent = `ApiKey=${ key.yahooapikey }&TimeStamp=${ ts }&Format=json${ QueryString }`;
        var Signature = crypto.createHmac('sha1', key.yahooapisecret).update(RequestContent).digest('hex');
        RequestContent = encodeURI(RequestContent)
                        .replace(/\#/g, "%23")
                        .replace(/\\/g, "%5C")
                        .replace(/\//g, "%2F")
                        .replace(/\?/g, "%3F")
                        .replace(/\+/g, "%2B")
                        .replace(/\:/g, "%3A")
                        .replace(/\@/g, "%40")
                        .replace(/\$/g, "%24")
                        .replace(/\;/g, "%3B")
                        .replace(/\,/g, "%2C");
        url = url + "?" + RequestContent + "&Signature=" + Signature;
        request({
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            formData: formData,
            url: url
        }, function (e, r, b) {
            try {
                var res = JSON.parse(b).Response;
                if (res['@Status'] != 'fail') {
                    resolve(res);
                } else {
                    reject(res);
                }
            } catch (err) {
                reject(err);
            }
        });
    });
}

function getCategory(name) {
    var categoryIds = [];
    for (var i in enums.keyword) {
        for (var j in enums.keyword[i]) {
            if (name.indexOf(enums.keyword[i][j]) != -1) {
                categoryIds.push(enums.category[i]);
                break;
            }
        }
    }
    if (categoryIds.length == 0) categoryIds.push(enums.category.otherManCloth);
    return categoryIds;
}

function cutShort(str, limit) {
    limit = Math.floor(limit / 3);
    str = str.replace(emojiReg, "");
    var len = str.length;
    if (len > limit) {
        str = str.split(" ");
        for (var i = 0; len > limit; i++) {
            str.splice(str.length - 1, 1);
            len = str.join(" ").length;
        }
        return str.join(" ");
    } else {
        return str;
    }
}

function shopeeDataToYahooData(shopeeData, shipType, payType){
    var data = {
        "SaleType": "Normal",
        "ProductName": cutShort(shopeeData.name, 120),
        "MarketPrice": Math.floor((shopeeData.price * shopeeData.priceRate) / shopeeData.marketPriceRate),
        "SalePrice": Math.floor(shopeeData.price * shopeeData.priceRate),
        "CostPrice": Math.floor(shopeeData.price * shopeeData.priceRate),
        "CustomizedMainProductId": shopeeData.item_sku,
        "MallCategoryId": getCategory(shopeeData.name),
        "ShortDescription": cutShort(shopeeData.name, 45),
        "LongDescription": cutShort(shopeeData.description, 1200),
        "PayTypeId": payType,
        "ShippingId": shipType
    }
    if (shopeeData.attributes.length > 0) {
        var index = 1;
        for (var i in shopeeData.attributes) {
            data[`Attribute${index}Name`] = shopeeData.attributes[i].attribute_name.replace(/\(/g, "").replace(/\)/g, "");
            data[`Attribute${index}Value`] = shopeeData.attributes[i].attribute_value.replace(/\(/g, "").replace(/\)/g, "").replace(/\./g, "");
        }
    }
    if (shopeeData.has_variation == true) {
        data["SpecTypeDimension"] = 1;
        data[`SpecDimension1`] = "尺寸";
        data[`SpecDimension1Description`] = shopeeData.variations.map(function(ele){
            return ele.name;
        });
    } else {
        data["SpecTypeDimension"] = 0;
        data["Stock"] = parseInt(shopeeData.stock);
        data["SaftyStock"] = 10;
    }

    return data;
}

function getPayTypeAndShipType(key) {
    return new Promise(function (resolve, reject) {
        var result = {
            'payType':[],
            'shipType':[]
        }
        var url = "https://tw.ews.mall.yahooapis.com/stauth/v1/StorePayment/Get";
        callAPI(key, url, {}).then(function (res) {
            result['payType'] = res.PayTypeList.PayType;
            var url = "https://tw.ews.mall.yahooapis.com/stauth/v1/StoreShipping/Get";
            callAPI(key, url, {}).then(function (res) {
                result['shipType'] = res.ShippingTypeList.ShippingType;
                resolve(result);
            }).catch(function (err) {
                reject({
                    '@Status': 'Fail',
                    'Action': 'getPayTypeAndShipType'
                });
            });
        }).catch(function (err) {
            reject({
                '@Status': 'Fail',
                'Action': 'getPayTypeAndShipType'
            });
        });
    });
}

function submitVerifyMain(key, data){
    return new Promise(function(resolve,reject){
        var url = "https://tw.ews.mall.yahooapis.com/stauth/v2/Product/SubmitVerifyMain";
        callAPI(key, url, data).then(function (res) {
            resolve(res);
        }).catch(function(err){
            err["Action"] = "submitVerifyMain";
            reject(err);
        });
    });
}

function submitMain(key, data) {
    return new Promise(function (resolve, reject) {
        var url = "https://tw.ews.mall.yahooapis.com/stauth/v2/Product/SubmitMain";
        callAPI(key, url, data).then(function (res) {
            resolve(res);
        }).catch(function (err) {
            err["Action"] = "submitMain";
            reject(err);
        });
    });
}

function uploadImage(key, productId, images) {
    return new Promise(function (resolve, reject) {
        var data = {
            "ImageFile": images,
            "ProductId": productId,
            "MainImage": "ImageFile1",
            "Purge": true
        }
        var url = "https://tw.ews.mall.yahooapis.com/stauth/v1/Product/UploadImage";
        callAPI(key, url, data).then(function (res) {
            resolve(res);
        }).catch(function (err) {
            err["Action"] = "uploadImage";
            err["ImageData"] = data;
            reject(err);
        });
    });
}

function updateStock(key, productId, variastionIndex, stock, action){
    return new Promise(function (resolve, reject) {
        var data = {
            "ProductId": productId,
            "Spec.1.Id": variastionIndex,
            "Spec.1.Stock": (parseInt(stock) > 0) ? parseInt(stock) : 1,
            "Spec.1.Action": action
        }
        var url = "https://tw.ews.mall.yahooapis.com/stauth/v1/Product/UpdateStock";
        callAPI(key, url, data).then(function (res) {
            resolve(res);
        }).catch(function (err) {
            err["Action"] = "updateStock-"+action;
            reject(err);
        });
    });
}

function productOnline(key, data){
    return new Promise(function (resolve, reject) {
        var product = {
            "ProductId": data.productId
        }
        var url = "http://tw.ews.mall.yahooapis.com/stauth/v1/Product/Online";
        callAPI(key, url, product).then(function (res) {
            if (res.SuccessList && res.SuccessList.Product && res.SuccessList.Product.length > 0) {
                resolve({
                    '@Status': 'Success',
                    'Action': 'productOnline',
                    'shopeeItemId': data.shopeeItemId,
                    'productId': data.productId
                });
            } else {
                resolve({
                    '@Status': 'Fail',
                    'Action': 'productOnline',
                    'shopeeItemId': data.shopeeItemId,
                    'productId': data.productId
                });
            }
        }).catch(function (err) {
            resolve({
                '@Status': 'Fail',
                'Action': 'productOnline',
                'shopeeItemId': data.shopeeItemId,
                'productId': data.productId
            });
        });
    });
}

function productOffline(key, data) {
    return new Promise(function (resolve, reject) {
        var product = {
            "ProductId": data.productId
        }
        var url = "http://tw.ews.mall.yahooapis.com/stauth/v1/Product/Offline";
        callAPI(key, url, product).then(function (res) {
            resolve({
                '@Status': 'Success',
                'Action': 'productOffline',
                'shopeeItemId': data.shopeeItemId,
                'productId': data.productId
            });
        }).catch(function (err) {
            resolve({
                '@Status': 'Fail',
                'Action': 'productOffline',
                'shopeeItemId': data.shopeeItemId,
                'productId': data.productId
            });
        });
    });
}

function delItem(key, data) {
    return new Promise(function (resolve, reject) {
        var product = {
            "ProductId": data.productId
        }
        var url = "http://tw.ews.mall.yahooapis.com/stauth/v1/Product/Delete";
        callAPI(key, url, product).then(function (res) {
            resolve({
                '@Status': 'Success',
                'Action': 'delItem',
                'shopeeItemId': data.shopeeItemId,
                'productId': data.productId
            });
        }).catch(function (err) {
            resolve({
                '@Status': 'Fail',
                'Action': 'delItem',
                'shopeeItemId': data.shopeeItemId,
                'productId': data.productId
            });
        });
    });
}

function addItemTest(data, shipType, payType) {
    var shopeeData = data;
    var itemId = shopeeData.item_id;
    return new Promise(function (resolve, reject) {
        var data = shopeeDataToYahooData(shopeeData, shipType, payType);
        submitVerifyMain(data).then(function (res) {
            console.log("Upload Item Test Done");
            console.log("Item: " + data["ProductName"] + "\n");
            resolve({
                '@Status': 'Success',
                'Action': 'addItemTest',
                'shopeeItemId': itemId,
                'productName': data["ProductName"],
                'sku': data["CustomizedMainProductId"]
            });
        }).catch(function (err) {
            console.log("Upload Item Test Fail");
            console.log("Item: " + data["ProductName"] + "\n");
            err["@Status"] = "Fail";
            err["shopeeItemId"] = itemId;
            err["submitData"] = shopeeData;
            err["productName"] = data["ProductName"];
            err["sku"] = data["CustomizedMainProductId"];
            if (err.ErrorList) {
                err.ErrorList = err.ErrorList.Error.map(function(ele){
                    return ele.Parameter + " -> " + ele.Message;
                });
            }
            resolve(err);
        });
    });
}

function addItem(key, data, shipType, payType) {
    var shopeeData = data;
    var itemId = shopeeData.item_id;
    var productId = "";
    return new Promise(function (resolve, reject) {
        var data = shopeeDataToYahooData(shopeeData, shipType, payType);
        submitMain(key, data).then(function (res) {
            productId = res.ProductId;
            return uploadImage(key, productId, shopeeData.images);
        }).then(function (res) {
            if (shopeeData.has_variation == true) {
                var updateItemStock = Promise.all(shopeeData.variations.map(function(ele, index){
                    return updateStock(key, productId, index + 1, ele.stock, "add");
                }));
                return updateItemStock;
            } else {
                console.log("Upload Item Done");
                console.log("Item: " + data["ProductName"] + "\n");
                resolve({
                    '@Status': 'Success',
                    'Action': 'addItem',
                    'shopeeItemId' : itemId,
                    'productId': productId,
                    'productName': data["ProductName"],
                    'sku': data["CustomizedMainProductId"]
                });
            }
        }).then(function (res) {
            console.log("Upload Item Done");
            console.log("Item: " + data["ProductName"] + "\n");
            resolve({
                '@Status': 'Success',
                'Action': 'addItem',
                'shopeeItemId': itemId,
                'productId': productId,
                'productName': data["ProductName"],
                'sku': data["CustomizedMainProductId"]
            });
        }).catch(function (err) {
            if (err["Action"] == "uploadImage") {
                console.log("Upload Image Fail");
            } else {
                console.log("Upload Item Fail");
            }
            console.log("Item: " + data["ProductName"] + "\n");
            err["@Status"] = "Fail";
            err["shopeeItemId"] = itemId;
            err["productId"] = productId;
            err["submitData"] = shopeeData;
            err["productName"] = data["ProductName"];
            err["sku"] = data["CustomizedMainProductId"];
            if (err.ErrorList) {
                err.ErrorList = err.ErrorList.Error.map(function(ele){
                    return ele.Parameter + " -> " + ele.Message;
                });
            }
            resolve(err);
        });
    });
}

module.exports = {
    "callAPI": callAPI,
    "addItemTest": addItemTest,
    "addItem": addItem,
    "delItem": delItem,
    "productOnline": productOnline,
    "productOffline": productOffline,
    "updateStock": updateStock,
    "getPayTypeAndShipType":getPayTypeAndShipType
}