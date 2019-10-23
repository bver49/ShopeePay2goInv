var pay2go = require('./helper/pay2go');
var data = {
    "ordersn":"12343522",
    "recipient_address": {
        "name": "derek"
    },
    "message_to_seller": "test@gmail.com",
    "total_amount": 1000,
    "invitemname": "服飾",
    "order_status":"COMPLETED"
}

pay2go.genInvoice(data, key, function(res) {
});