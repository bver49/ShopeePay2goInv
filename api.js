var express = require('express');
var fs = require('fs');
var router = express.Router();
var helper = require('./helper');
var getOrderList = helper.getOrderList;
var getOrdersDetail = helper.getOrdersDetail;
var getOrderDetail = helper.getOrderDetail;
var genInvoice = helper.genInvoice;
var getOrderListByStatus = helper.getOrderListByStatus;
var genExcel = helper.genExcel;

router.post("/orders", function(req, res) {
	var key = {
		shopeesecret: req.body.shopeesecret,
		shopeeshopid: req.body.shopeeshopid,
		shopeepartnerid: req.body.shopeepartnerid,
		paytwogoid: req.body.paytwogoid,
		paytwogohashkey: req.body.paytwogohashkey,
		paytwogohashiv: req.body.paytwogohashiv
	}
	if (req.query.status) {
		if (req.query.status == 1) {
			req.query.status = "COMPLETED";
		} else {
			req.query.status = "READY_TO_SHIP";
		}
		getOrderListByStatus(req.body.tf, req.body.tt, req.body.page,req.query.status, key, function(list, more) {
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
		shopeepartnerid: req.body.shopeepartnerid,
		paytwogoid: req.body.paytwogoid,
		paytwogohashkey: req.body.paytwogohashkey,
		paytwogohashiv: req.body.paytwogohashiv
	}
	getOrdersDetail(req.body['ordersn[]'], key, function(orders) {
		res.send(orders);
	});
});

router.post("/order/detail", function(req, res) {
	var key = {
		shopeesecret: req.body.shopeesecret,
		shopeeshopid: req.body.shopeeshopid,
		shopeepartnerid: req.body.shopeepartnerid,
		paytwogoid: req.body.paytwogoid,
		paytwogohashkey: req.body.paytwogohashkey,
		paytwogohashiv: req.body.paytwogohashiv
	}
	getOrderDetail(req.body.ordersn, key, function(orders) {
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
		paytwogohashiv: req.body.paytwogohashiv
	}
	getOrderDetail(req.body.ordersn, key, function(order) {
		genInvoice(order, key, function(result) {
			if (result == "解密錯誤") {
				res.send("解密錯誤")
			} else {
				if (result == "發票開立成功" || result == "已開過發票") {
					fs.appendFileSync('list.txt', req.body.ordersn + '\n');
				}
				res.send(result);
			}
		})
	});
});

router.get("/invlist", function(req, res) {
	var list = fs.readFileSync('list.txt','utf8');
	res.send(list.split(/\n/));
});

router.post("/genexcel", function(req, res) {
  genExcel(req.body,function(){
		res.send('ok');
	});
});

router.get('/downloadexcel', function(req, res) {
	res.download('./file/待出貨商品統計.xlsx');
});

module.exports = router;
