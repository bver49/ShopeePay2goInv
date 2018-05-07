var Invoice = require('../model/Invoice');
Invoice.sync({force: true}).then(function () {
  console.log("Table Invoice setup");
  process.exit();
});
