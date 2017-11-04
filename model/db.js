var Sequelize = require("sequelize");
var config = require("../config");
var db = new Sequelize(config.db.name,config.db.user,config.db.pw,{
  host: config.db.host,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  define: {
    charset: 'utf8',
    collate: 'utf8_general_ci'
  },
  query:{raw:true}
});

module.exports = db;
