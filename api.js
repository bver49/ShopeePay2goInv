var express = require('express');
var router = express.Router();
var helper = require('./helper');
var getOrderList = helper.getOrderList;
var dateToTs = helper.dateToTs;

router.post("/orders",function(req,res){
  getOrderList(dateToTs(req.body.tf),dateToTs(req.body.tt),req.body.page,function(list){
    res.json(list);
  })
});

module.exports = router;
