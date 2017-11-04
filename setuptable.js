var User = require('./model/User');

User.sync({force: true}).then(function () {
  console.log("Table user setup");
  process.exit();
});
