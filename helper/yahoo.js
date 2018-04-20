var request = require('request');
var crypto = require('crypto');
var yahooAPIkey = config.yahoo.APIKey;
var yahooAPISecret = config.yahoo.APISecret;

function callAPI(url, data){
    return new Promise(function(resolve, reject){
        var ts = Math.floor(new Date().getTime() / 1000);
        var QueryString = "";
        if (typeof data !== "undefined" && Object.keys(data).length > 0) {
            for (var i in data){
                QueryString += `&${i}=${data[i]}`;
            }
        }
        var RequestContent = `ApiKey=${yahooAPIkey}&TimeStamp=${ts}&Format=json${QueryString}`;
        var Signature = crypto.createHmac('sha1', yahooAPISecret).update(RequestContent).digest('hex');
        url = url + "?" + RequestContent + "&Signature=" + Signature;
        request({
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            url: url
        }, function (e, r, b) {
            resolve(JSON.parse(b).Response);
        });
    });
}