var express = require('express');
var fs = require('fs');
var router = express.Router();
var helper = require('./helper');
var getOrderList = helper.getOrderList;
var getOrdersDetail = helper.getOrdersDetail;
var getOrderDetail = helper.getOrderDetail;
var genInvoice = helper.genInvoice;
var getOrderListByStatus = helper.getOrderListByStatus;
var getOrderIncome = helper.getOrderIncome;
var getOrderLogistic = helper.getOrderLogistic;
var genExcel = helper.genExcel;

router.post("/orders", function(req, res) {
  var key = {
    shopeesecret: req.body.shopeesecret,
    shopeeshopid: req.body.shopeeshopid,
    shopeepartnerid: req.body.shopeepartnerid
  }
  if (req.query.status && req.query.status == 1) {
    req.query.status = "READY_TO_SHIP";
    getOrderListByStatus(req.body.tf, req.body.tt, req.body.page, req.query.status, key, function(list, more) {
      res.json({ list: list, more: more });
    });
  } else {
    getOrderList(req.body.tf, req.body.tt, req.body.page, key, function(list, more) {
      res.json({ list: list, more: more });
    });
  }
});

router.post("/orders/detail", function(req, res) {
  var key = {
    shopeesecret: req.body.shopeesecret,
    shopeeshopid: req.body.shopeeshopid,
    shopeepartnerid: req.body.shopeepartnerid
  }
  getOrdersDetail(req.body['ordersn[]'], key, function(orders) {
    res.send(orders);
  });
});

router.post("/order/detail", function(req, res) {
  var key = {
    shopeesecret: req.body.shopeesecret,
    shopeeshopid: req.body.shopeeshopid,
    shopeepartnerid: req.body.shopeepartnerid
  }
  getOrderDetail(req.body.ordersn, key, function(order) {
    if (order.length > 0) {
      getOrderIncome(req.body.ordersn, key, function(income) {
        var detail = income.order.income_details;
        var total_fee = parseInt(detail.escrow_amount) + parseInt(detail.commission_fee) + parseInt(detail.credit_card_transaction_fee) - parseInt(detail.actual_shipping_cost) - parseInt(detail.shipping_fee_rebate);
        order.total_amount = (total_fee > 0) ? total_fee : 0;
        res.send(order);
      });
    } else {
      res.send('notFound');
    }
  });
});

router.post("/order/income", function(req, res) {
  var key = {
    shopeesecret: req.body.shopeesecret,
    shopeeshopid: req.body.shopeeshopid,
    shopeepartnerid: req.body.shopeepartnerid
  }
  getOrderIncome(req.body.ordersn, key, function(orders) {
    res.send(orders);
  });
});

router.post("/order/logistic", function(req, res) {
  var key = {
    shopeesecret: req.body.shopeesecret,
    shopeeshopid: req.body.shopeeshopid,
    shopeepartnerid: req.body.shopeepartnerid
  }
  getOrderLogistic(req.body.ordersn, key, function(orders) {
    res.send(orders);
  });
});

router.post("/geninv", function(req, res) {
  var key = {
    shopeesecret: req.body.shopeesecret,
    shopeeshopid: req.body.shopeeshopid,
    shopeepartnerid: req.body.shopeepartnerid,
    paytwogoid: req.body.paytwogoid,
    paytwogohashkey: req.body.paytwogohashkey,
    paytwogohashiv: req.body.paytwogohashiv,
    invurl: (req.body.invurl == "") ? 'https://inv.pay2go.com/api/invoice_issue' : req.body.invurl,
    invemail: (req.body.invemail == "") ? "c.p.max.tw@gmail.com" : req.body.invemail
  }
  getOrderDetail(req.body.ordersn, key, function(order) {
    getOrderIncome(req.body.ordersn, key, function(income) {
      var detail = income.order.income_details;
      var total_fee = parseInt(detail.escrow_amount) + parseInt(detail.commission_fee) + parseInt(detail.credit_card_transaction_fee) - parseInt(detail.actual_shipping_cost) - parseInt(detail.shipping_fee_rebate);
      order.total_amount = (total_fee > 0) ? total_fee : 0;
      order.invitemname = req.body.invitemname;
      if (order.total_amount > 0) {
        genInvoice(order, key, function(result) {
          if (result == "解密錯誤") {
            res.send("解密錯誤")
          } else {
            if (result == "發票開立成功" || result == "已開過發票") {
              fs.appendFileSync('list.txt', req.body.ordersn + '\n');
            }
            res.send(result);
          }
        });
      } else {
        res.send("0元訂單");
      }
    });
  });
});

router.get("/invlist", function(req, res) {
  var list = fs.readFileSync('list.txt', 'utf8');
  res.send(list.split(/\n/));
});

router.post("/genexcel", function(req, res) {
  genExcel(req.body, function() {
    res.send('ok');
  });
});

module.exports = router;