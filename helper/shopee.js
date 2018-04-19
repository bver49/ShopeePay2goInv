var crypto = require('crypto');
var request = require('request');
var xl = require('excel4node');
var emojiRegex = require('emoji-regex');
var emojiReg = emojiRegex();

function dateToTs(date) {
    return Math.floor((new Date(date).getTime() - (8 * 60 * 60 * 1000)) / 1000);
}

function encode(url, data, secret) {
    var basestring = url.concat('|', JSON.stringify(data));
    return crypto.createHmac('sha256', secret).update(basestring).digest('hex');
}

function callAPI(key, url, data) {
    return new Promise(function(resolve, reject){
        request({
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': encode(url, data, key.shopeesecret)
            },
            url: url,
            json: data
        }, function (e, r, b) {
            resolve(b);
        });
    });
}

//依照訂單更新時間查找
module.exports.getOrderList = function (tf, tt, page, key, cb) {
    tt = dateToTs(tt);
    tf = dateToTs(tf);
    tt += (24 * 3600);
    var data = {
        "shopid": parseInt(key.shopeeshopid),
        "partner_id": parseInt(key.shopeepartnerid),
        "timestamp": Math.floor(new Date().getTime() / 1000),
        "update_time_to": tt,
        "update_time_from": tf,
        "pagination_entries_per_page": 100, //一頁呈現的訂單數目
        "pagination_offset": parseInt(page) * 100 //第幾頁
    }
    var url = 'https://partner.shopeemobile.com/api/v1/orders/basics';
    callAPI(key, url, data).then(function(body){
        try {
            body.orders = (body.orders == undefined) ? [] : body.orders;
            body.more = (body.more == undefined) ? false : body.more;
            cb(body.orders, body.more);
        } catch (err) {
            console.log(body);
            console.log(err);
            console.log(data);
            cb([], false);
        }
    });
}

//依照訂單狀態查找
module.exports.getOrderListByStatus = function (tf, tt, page, status, key, cb) {
    tt = dateToTs(tt);
    tf = dateToTs(tf);
    tt += (24 * 3600) - 1;
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
    callAPI(key, url, data).then(function (body) {
        try {
            body.orders = (body.orders == undefined) ? [] : body.orders;
            body.more = (body.more == undefined) ? false : body.more;
            cb(body.orders, body.more);
        } catch (err) {
            console.log(body);
            console.log(err);
            console.log(data);
            cb([], false);
        }
    });
}

//多筆訂單查找詳細資料
module.exports.getOrdersDetail = function (orders, key, cb) {
    var data = {
        "shopid": parseInt(key.shopeeshopid),
        "partner_id": parseInt(key.shopeepartnerid),
        "timestamp": Math.floor(new Date().getTime() / 1000),
        "ordersn_list": orders
    }
    var url = 'https://partner.shopeemobile.com/api/v1/orders/detail';
    callAPI(key, url, data).then(function (body) {
        try {
            cb(body.orders);
        } catch (err) {
            console.log(body);
            console.log(err);
            console.log(data);
            cb([]);
        }
    });
}

//單筆訂單查找詳細資料
module.exports.getOrderDetail = function (ordersn, key, cb) {
    var data = {
        "shopid": parseInt(key.shopeeshopid),
        "partner_id": parseInt(key.shopeepartnerid),
        "timestamp": Math.floor(new Date().getTime() / 1000),
        "ordersn_list": [ordersn]
    }
    var url = 'https://partner.shopeemobile.com/api/v1/orders/detail';
    callAPI(key, url, data).then(function (body) {
        try {
            if (body.orders.length > 0) {
                cb(body.orders[0]);
            } else {
                cb(false);
            }
        } catch (err) {
            console.log(body);
            console.log(err);
            console.log(data);
            cb(false);
        }
    });
}

module.exports.getOrderIncome = function (ordersn, key, cb) {
    var data = {
        "shopid": parseInt(key.shopeeshopid),
        "partner_id": parseInt(key.shopeepartnerid),
        "timestamp": Math.floor(new Date().getTime() / 1000),
        "ordersn": ordersn
    }
    var url = 'https://partner.shopeemobile.com/api/v1/orders/my_income';
    callAPI(key, url, data).then(function (body) {
        cb(body);
    });
}

module.exports.getOrderLogistic = function (ordersn, key, cb) {
    var data = {
        "shopid": parseInt(key.shopeeshopid),
        "partner_id": parseInt(key.shopeepartnerid),
        "timestamp": Math.floor(new Date().getTime() / 1000),
        "ordersn": ordersn
    }
    var url = 'https://partner.shopeemobile.com/api/v1/logistics/tracking';
    callAPI(key, url, data).then(function (body) {
        cb(body);
    });
}

module.exports.genExcel = function (data, cb) {
    var wb = new xl.Workbook({
        defaultFont: {
            size: 12,
            name: '新細明體'
        }
    });

    var x = 1;
    var y = 3;
    var count = 0;
    var index = 1;
    var ws = wb.addWorksheet('sheet');
    ws.cell(1, 1).string('查詢時間範圍');
    ws.cell(1, 2, 1, 3, true).string(data.tf + "-" + data.tt);
    ws.cell(1, 5).string('物流篩選');
    ws.cell(1, 6).string(data.carrier);
    delete data.carrier;
    delete data.tf;
    delete data.tt;
    ws.cell(2, 1).string('項次');
    ws.cell(2, 2).string('名稱');
    ws.cell(2, 3).string('貨號');
    ws.cell(2, 4).string('單價');
    ws.cell(2, 5).string('尺寸/顏色');
    ws.cell(2, 6).string('數量');
    for (var i in data) {
        var typeamt = Object.keys(data[i].type).length;
        ws.cell(y, 1, y + typeamt - 1, 1, true).number(index);
        ws.cell(y, 2, y + typeamt - 1, 2, true).string(data[i].name.replace(emojiReg, " "));
        ws.cell(y, 3, y + typeamt - 1, 3, true).string(data[i].sku);
        for (var j in data[i].type) {
            ws.cell(y, 4).number(parseInt(data[i].type[j].price));
            ws.cell(y, 5).string(data[i].type[j].typename);
            ws.cell(y, 6).number(data[i].type[j].amount);
            y++;
        }
        index++;
    }
    wb.write('../file/待出貨商品統計.xlsx');
    cb()
}

//取得商品分類
function getCategory(key, cb) {
    return new Promise(function (resolve, reject) {
        var data = {
            "pagination_offset": 0,
            "pagination_entries_per_page": 100,
            "shopid": parseInt(key.shopeeshopid),
            "partner_id": parseInt(key.shopeepartnerid),
            "timestamp": Math.floor(new Date().getTime() / 1000)
        }
        var url = 'https://partner.shopeemobile.com/api/v1/shop_categorys/get';
        callAPI(key, url, data).then(function (body) {
            resolve(body);
        });
    });
}

//取得單一分類中的商品
function getItemInCategory(category, key) {
    return new Promise(function (resolve, reject) {
        var data = {
            "shop_category_id": category.shop_category_id,
            "shopid": parseInt(key.shopeeshopid),
            "partner_id": parseInt(key.shopeepartnerid),
            "timestamp": Math.floor(new Date().getTime() / 1000)
        }
        var url = 'https://partner.shopeemobile.com/api/v1/shop_category/get/items';
        callAPI(key, url, data).then(function (body) {
            body.shop_category_name = category.name;
            resolve(body);
        });
    });
}

//取得單一商品的資料
function getItemDetail(itemId, key) {
    return new Promise(function (resolve, reject) {
        var data = {
            "item_id": itemId,
            "shopid": parseInt(key.shopeeshopid),
            "partner_id": parseInt(key.shopeepartnerid),
            "timestamp": Math.floor(new Date().getTime() / 1000)
        }
        var url = 'https://partner.shopeemobile.com/api/v1/item/get';
        callAPI(key, url, data).then(function (body) {
            resolve(body);
        });
    });
}

module.exports.getAllItems = function (key) {
    return new Promise(function (resolve, reject) {
        getCategory(key).then(function (data) {
            var categoryList = data.shop_categorys.filter(function (ele) {
                return ele.status == 1;
            });

            var getCategoryDetail = Promise.all(categoryList.map(function (category) {
                return getItemInCategory(category, key);
            }));

            getCategoryDetail.then(function (categorys) {
                //過濾掉未有商品的分類
                categorys = categorys.filter(function (category) {
                    return category.items.length > 0;
                });
                //Making itemId array
                var categorysItems = [];
                for (var i in categorys) {
                    categorysItems = categorysItems.concat(categorys[i].items);
                }

                //取得商品詳細資料
                var getAllItemsDetail = Promise.all(categorysItems.map(function (itemId) {
                    return getItemDetail(itemId, key);
                }));

                getAllItemsDetail.then(function (items) {
                    var itemsObject = {};
                    for (var i in items) {
                        itemsObject[items[i].item.item_id] = items[i].item;
                    }
                    for (var i in categorys) {
                        for (var j in categorys[i].items) {
                            categorys[i].items[j] = itemsObject[categorys[i].items[j]];
                        }
                    }
                    resolve(categorys);
                });
            });
        });
    });
}