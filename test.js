const ShopeeApi = require('shopee-api');
const shopeeApi = new ShopeeApi({
    isUAT: false,
    shopid: 123,
    partner_id: 'xxx',
    partner_key: 'xx',
    redirect_uri: 'http://localhost:3000/callback', // callback url when perform OAuth
    webhook_url: 'http://localhost:3000/webhook',
    verbose: true // show more logs
});

const authUrl = shopeeApi.buildAuthURL();
console.log(authUrl);