var crypto = require('crypto');
var request = require('request');
var secret = '8236de828b167b0df1a5c09706f8cca54aa61f81b9119f0c044199077525b7a6';
var url = 'https://partner.staging.shopeemobile.com/api/v1/logistics/address/get'
var data = {
    "shopid": 205457,
    "partner_id": 90014,
    "timestamp": Math.floor(new Date().getTime() / 1000)
}

var basestring = url.concat('|',JSON.stringify(data));
basestring = basestring.replace(/\,/g,'\, ');
basestring = basestring.replace(/\"\:/g,'\"\: ');
var hash = crypto.createHmac('sha256',secret).update(basestring).digest('hex');
console.log(basestring);
console.log(hash);

request({
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length':JSON.stringify(data).replace(/\,/g,', ').replace(/\"\:/g,'": ').length,
        'Authorization': hash
    },
    url:url,
    json: data
}, function(e, r, b) {
    console.log(b);
});
