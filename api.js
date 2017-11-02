var express = require('express');
var fs = require('fs');
var router = express.Router();
var helper = require('./helper');
var getOrderList = helper.getOrderList;
var getOrderDetail = helper.getOrderDetail;
var genInvoice = helper.genInvoice;

router.post("/orders",function(req,res){
  getOrderList(req.body.tf,req.body.tt,req.body.page,function(list,more){
    res.json({list:list,more:more});
  })
});

router.post("/order",function(req,res){
  getOrderDetail(req.body.ordersn,function(order){
    res.send(order);
  });
});

router.post("/geninv",function(req,res){
  getOrderDetail(req.body.ordersn,function(order){
    genInvoice(order,function(result){
      if(result == "發票開立成功" || result == "已開過發票" ){
        fs.appendFileSync('list.txt',req.body.ordersn+'\n');
      }
      res.send(result);
    })
  });
});

router.get("/invlist",function(req,res){
  var list = fs.readFileSync('list.txt', 'utf8');
  res.send(list.split(/\r?\n/));
});

module.exports = router;
