var express = require('express');
var fs = require('fs');
var router = express.Router();
var helper = require('./helper');
var getOrderList = helper.getOrderList;
var getOrderDetail = helper.getOrderDetail;
var genInvoice = helper.genInvoice;
var getOrderListStatus = helper.getOrderListStatus;

router.post("/orders", function(req, res) {
	var key = {
		shopeesecret: req.body.shopeesecret,
		shopeeshopid: req.body.shopeeshopid,
		shopeepartnerid: req.body.shopeepartnerid,
		paytwogoid: req.body.paytwogoid,
		paytwogohashkey: req.body.paytwogohashkey,
		paytwogohashiv: req.body.paytwogohashiv
	}
	getOrderList(req.body.tf, req.body.tt, req.body.page, key, function(list, more) {
		res.json({ list: list, more: more });
	})
});

router.post("/ordersstatus", function(req, res) {
	var key = {
		shopeesecret: req.body.shopeesecret,
		shopeeshopid: req.body.shopeeshopid,
		shopeepartnerid: req.body.shopeepartnerid,
		paytwogoid: req.body.paytwogoid,
		paytwogohashkey: req.body.paytwogohashkey,
		paytwogohashiv: req.body.paytwogohashiv
	}
	getOrderListStatus(req.body.tf, req.body.tt, req.body.page,key, function(list, more) {
		res.json({ list: list, more: more });
	})
});

router.post("/order", function(req, res) {
	var key = {
		shopeesecret: req.body.shopeesecret,
		shopeeshopid: req.body.shopeeshopid,
		shopeepartnerid: req.body.shopeepartnerid,
		paytwogoid: req.body.paytwogoid,
		paytwogohashkey: req.body.paytwogohashkey,
		paytwogohashiv: req.body.paytwogohashiv
	}
	getOrderDetail(req.body.ordersn, key, function(order) {
		res.send(order);
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
	var list = fs.readFileSync('list.txt', 'utf8');
	res.send(list.split(/\n/));
});

module.exports = router;
