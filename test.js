var helper = require('./helper');
var getOrderDetail = helper.getOrderDetail;
var getOrderIncome = helper.getOrderIncome;
var key = {
  shopid:"",
  partner_id:"",
  shopeesecret:""
}

getOrderDetail("ordersn",key,function(detail){
  getOrderIncome("ordersn",key,function(income){
    console.log(detail);
    console.log(income);
  });
});