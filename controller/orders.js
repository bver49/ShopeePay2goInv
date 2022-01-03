var express = require('express');
var fs = require('fs');
var Op = require('sequelize').Op;
var router = express.Router();
var Invoice = require('../model/Invoice');
var shopee = require('../helper/shopee');
var pay2go = require('../helper/pay2go');
var smilePay = require('../helper/smilePay');
var getOrderList = shopee.getOrderList;
var getOrdersDetail = shopee.getOrdersDetail;
var getOrderDetail = shopee.getOrderDetail;
var getOrderListByStatus = shopee.getOrderListByStatus;
var getOrderIncome = shopee.getOrderIncome;
var getOrderLogistic = shopee.getOrderLogistic;
var genExcel = shopee.genExcel;
var countOrderIncomeTotalAmount = shopee.countOrderIncomeTotalAmount;
var getReturnList = shopee.getReturnList;

//查詢訂單
router.post("/", function (req, res) {
    var key = {
        shopeesecret: req.body.shopeesecret,
        shopeeshopid: req.body.shopeeshopid,
        shopeepartnerid: req.body.shopeepartnerid
    }
    if (req.query.status && req.query.status == 1) {
        getOrderListByStatus(req.body.tf, req.body.tt, req.body.page, "READY_TO_SHIP", key, function (orders, more) {
            res.json({
                orders: orders,
                more: more
            });
        });
    } else {
        getOrderList(req.body.tf, req.body.tt, req.body.page, key, function (orders, more) {
            res.json({
                orders: orders,
                more: more
            });
        });
    }
});

//查詢訂單
router.post("/byStatusAndCreatedTime", function (req, res) {
    var key = {
        shopeesecret: req.body.shopeesecret,
        shopeeshopid: req.body.shopeeshopid,
        shopeepartnerid: req.body.shopeepartnerid
    }
    var status = req.body.status;
    getOrderListByStatus(req.body.tf, req.body.tt, req.body.page, status, key, function (orders, more) {
        var ordersn = [];
        for (var i in orders) {
            ordersn.push(orders[i].ordersn);
        }
        //撈訂單發票
        Invoice.findAll({
            where: {
                sn: {
                    [Op.in]: ordersn
                },
                status: {
                    [Op.ne]: -1
                }
            }
        }).then(function (invoices) {
            res.json({
                orders: orders,
                invoices: invoices,
                more: more
            });
        });
    });
});

//用更新時間查詢訂單 會篩選訂單狀態
router.post("/byStatusAndUpdatedTime", function (req, res) {
    var key = {
        shopeesecret: req.body.shopeesecret,
        shopeeshopid: req.body.shopeeshopid,
        shopeepartnerid: req.body.shopeepartnerid
    }
    var status = req.body.status;
    getOrderList(req.body.tf, req.body.tt, req.body.page, key, function (orders, more) {
        //如果有設定訂單狀態要篩出符合狀態的訂單
        if (status != "ALL") {
            orders = orders.filter(function (ele) {
                return ele.order_status == status;
            });
        }
        var ordersn = [];
        for (var i in orders) {
            ordersn.push(orders[i].ordersn);
        }
        //撈訂單發票
        Invoice.findAll({
            where: {
                sn: {
                    [Op.in]: ordersn
                },
                status: {
                    [Op.ne]: -1
                }
            }
        }).then(function (invoices) {
            res.json({
                orders: orders,
                invoices: invoices,
                more: more
            });
        });
    });
});

//多筆訂單詳細資料
router.post("/detail", function (req, res) {
    var key = {
        shopeesecret: req.body.shopeesecret,
        shopeeshopid: req.body.shopeeshopid,
        shopeepartnerid: req.body.shopeepartnerid
    }
    getOrdersDetail(req.body['ordersn[]'], key, function (orders) {
        res.send(orders);
    });
});

//單筆訂單詳細資料
router.post("/:ordersn/detail", function (req, res) {
    var key = {
        shopeesecret: req.body.shopeesecret,
        shopeeshopid: req.body.shopeeshopid,
        shopeepartnerid: req.body.shopeepartnerid
    }
    getOrderDetail(req.params.ordersn, key, function (order) {
        if (order) {
            getOrderIncome(req.params.ordersn, key, function (income) {
                order.total_amount = countOrderIncomeTotalAmount(income.order.income_details);
                res.send(order);
            });
        } else {
            res.send('notFound');
        }
    });
});

//訂單收益
router.post("/:ordersn/income", function (req, res) {
    var key = {
        shopeesecret: req.body.shopeesecret,
        shopeeshopid: req.body.shopeeshopid,
        shopeepartnerid: req.body.shopeepartnerid
    }
    getOrderIncome(req.params.ordersn, key, function (orders) {
        res.send(orders);
    });
});

//訂單運輸狀態
router.post("/:ordersn/logistic", function (req, res) {
    var key = {
        shopeesecret: req.body.shopeesecret,
        shopeeshopid: req.body.shopeeshopid,
        shopeepartnerid: req.body.shopeepartnerid
    }
    getOrderLogistic(req.params.ordersn, key, function (orders) {
        res.send(orders);
    });
});

//開立發票
router.post("/:ordersn/geninv", function (req, res) {
    var isSmilePay = false;
    var key = {
        shopeesecret: req.body.shopeesecret,
        shopeeshopid: req.body.shopeeshopid,
        shopeepartnerid: req.body.shopeepartnerid,
        paytwogoid: req.body.paytwogoid,
        paytwogohashkey: req.body.paytwogohashkey,
        paytwogohashiv: req.body.paytwogohashiv,
        isProduction: req.body.isProduction,
        invemail: (req.body.invemail == "") ? "c.p.max.tw@gmail.com" : req.body.invemail
    }
    getOrderDetail(req.params.ordersn, key, function (order) {
        getOrderIncome(req.params.ordersn, key, function (income) {
            order.total_amount = countOrderIncomeTotalAmount(income.order.income_details);
            order.invitemname = req.body.invitemname;
            if (order.total_amount > 0) {
                if (isSmilePay) {
                    smilePay.genInvoice(order, key, function (result) {
                        if (result.msg == "解密錯誤") {
                            res.send("解密錯誤")
                        } else {
                            if (result.msg == "發票開立成功" || result.msg == "已開過發票") {
                                var invDetail = result.detail.Result;
                                invDetail = JSON.parse(invDetail);
                                Invoice.create({
                                    "sn": req.params.ordersn,
                                    "MerchantID": invDetail.Grvc,
                                    "TotalAmt": order.total_amount,
                                    "InvoiceNumber": invDetail.InvoiceNumber,
                                    "RandomNum": invDetail.RandomNumber,
                                    "created_at": invDetail.InvoiceDate + ' ' + invDetail.InvoiceTime
                                });
                            }
                            res.send(result.msg);
                        }
                    });
                }  else {
                    pay2go.genInvoice(order, key, function (result) {
                        if (result.msg == "解密錯誤") {
                            res.send("解密錯誤")
                        } else {
                            if (result.msg == "發票開立成功" || result.msg == "已開過發票") {
                                var invDetail = result.detail.Result;
                                invDetail = JSON.parse(invDetail);
                                Invoice.create({
                                    "sn": req.params.ordersn,
                                    "MerchantID": invDetail.MerchantID,
                                    "TotalAmt": invDetail.TotalAmt,
                                    "InvoiceNumber": invDetail.InvoiceNumber,
                                    "RandomNum": invDetail.RandomNum,
                                    "created_at": invDetail.CreateTime
                                });
                            }
                            res.send(result.msg);
                        }
                    });
                }
            } else {
                res.send("0元訂單");
            }
        });
    });
});

//作廢
router.post("/:ordersn/invalidInvoice", function (req, res) {
    var isSmilePay = false;
    var key = {
        shopeesecret: req.body.shopeesecret,
        shopeeshopid: req.body.shopeeshopid,
        shopeepartnerid: req.body.shopeepartnerid,
        paytwogoid: req.body.paytwogoid,
        paytwogohashkey: req.body.paytwogohashkey,
        paytwogohashiv: req.body.paytwogohashiv,
        isProduction: req.body.isProduction
    }
    var ordersn = req.params.ordersn;
    Invoice.findAll({
        where: {
            sn: ordersn,
            status: 0
        }
    }).then(function (invoices) {
        if (invoices.length == 0) {
            res.send("查無此訂單發票，或是發票已作廢/折讓");
        } else {
            var invoiceNumber = invoices[0].InvoiceNumber;
            if (isSmilePay) {
                smilePay.invalidInvoice(invoiceNumber, key, function (result) {
                    Invoice.update({
                        status: 1
                    }, {
                        where: {
                            sn: ordersn
                        }
                    });
                    res.send(result.msg);
                });
            } else {
                pay2go.invalidInvoice(invoiceNumber, key, function (result) {
                    Invoice.update({
                        status: 1
                    }, {
                        where: {
                            sn: ordersn
                        }
                    });
                    res.send(result.msg);
                });
            }
        }
    });
});

//折讓
router.post("/:ordersn/discountInvoice", function (req, res) {
    var isSmilePay = false;
    var key = {
        shopeesecret: req.body.shopeesecret,
        shopeeshopid: req.body.shopeeshopid,
        shopeepartnerid: req.body.shopeepartnerid,
        paytwogoid: req.body.paytwogoid,
        paytwogohashkey: req.body.paytwogohashkey,
        paytwogohashiv: req.body.paytwogohashiv,
        isProduction: req.body.isProduction
    }
    var ordersn = req.params.ordersn;
    var discountAmount = req.body.discountAmount;
    Invoice.findAll({
        where: {
            sn: ordersn,
            status: 0
        }
    }).then(function (invoices) {
        if (invoices.length == 0) {
            res.send("查無此訂單發票，或是發票已作廢/折讓");
        } else {
            var invoiceNumber = invoices[0].InvoiceNumber;
            var invoiceTotalAmount = invoices[0].TotalAmt;
            if (discountAmount > invoiceTotalAmount) {
                res.send("錯誤，折讓金額大於發票金額");
            } else {
                if (isSmilePay) {
                    smilePay.discountInvoice(invoiceNumber, ordersn, discountAmount, key, function (result) {
                        Invoice.update({
                            status: 2
                        }, {
                            where: {
                                sn: ordersn
                            }
                        });
                        res.send(result.msg);
                    });
                } else {
                    pay2go.discountInvoice(invoiceNumber, ordersn, discountAmount, key, function (result) {
                        Invoice.update({
                            status: 2
                        }, {
                            where: {
                                sn: ordersn
                            }
                        });
                        res.send(result.msg);
                    });
                }
            }
        }
    });
});

//產生excel
router.post("/genexcel", function (req, res) {
    genExcel(req.body, function () {
        res.send('ok');
    });
});

//下載excel
router.get('/downloadexcel', function (req, res) {
    res.download('./file/待出貨商品統計.xlsx');
});

//查詢退款清單
router.post("/getReturnList", function (req, res) {
    var key = {
        shopeesecret: req.body.shopeesecret,
        shopeeshopid: req.body.shopeeshopid,
        shopeepartnerid: req.body.shopeepartnerid
    }
    getReturnList(req.body.tf, req.body.tt, req.body.page, key, function (returns, more) {
        returns = returns.filter(function (ele) {
            return ele.status == "REFUND_PAID";
        });
        res.json({
            returns: returns,
            more: more
        });
    });
});

module.exports = router;