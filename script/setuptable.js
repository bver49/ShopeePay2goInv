var Item = require('../model/Item');
Item.sync({force: true}).then(function () {
  console.log("Table item setup");
  process.exit();
});
