var db = require("./db");
var Sequelize = require("sequelize");

var orderSchema = {
	id: {
	    type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
    sn:{
        type: Sequelize.STRING,
        unique: true
    }
}

var Order = db.define('order', orderSchema,{
    timestamps: false
});

module.exports = Order;
