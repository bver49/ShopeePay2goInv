/*
var User = require('./model/User');
User.sync({force: true}).then(function () {
  console.log("Table user setup");
  process.exit();
});
*/
/*
var Order = require('./model/Order');
Order.sync({force: true}).then(function () {
  console.log("Table order setup");
  process.exit();
});*/

var fs = require('fs');
var sn = fs.readFileSync("list.txt").toString().split("\n");
console.log(sn);
