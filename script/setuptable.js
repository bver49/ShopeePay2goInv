var Note = require('../model/Note');
Note.sync({force: true}).then(function () {
  console.log("Table note setup");
  process.exit();
});
