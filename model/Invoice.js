var db = require("./db");
var Sequelize = require("sequelize");

var invoiceSchema = {
	id: {
	    type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
    sn:{
        type: Sequelize.STRING
    }
}

var Invoice = db.define('invoice', invoiceSchema,{
    timestamps: false
});

module.exports = Invoice;
