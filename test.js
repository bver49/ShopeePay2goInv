var helper = require('./helper');
var getOrderDetail = helper.getOrderDetail;
var getOrderIncome = helper.getOrderIncome;
var key = {
    shopeeshopid:"",
    shopeepartnerid:"",
    shopeesecret:""
}

getOrderDetail("ordersn",key,function(detail){
    console.log(detail);
});