var helper = require('./helper');
var getShopeeItems = helper.getShopeeItems;

var key = {
    shopeeshopid:"",
    shopeepartnerid:"",
    shopeesecret:""
}

getShopeeItems(key).then(function (ShopeeItems){
    console.log(ShopeeItems);
});