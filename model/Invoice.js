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
    },
    "MerchantID": {
        type: Sequelize.STRING(50),
        allowNull: true
    },
    "TotalAmt": {
	    type: Sequelize.INTEGER,
		allowNull: true
	},
    "InvoiceNumber": {
        type: Sequelize.STRING(50),
        allowNull: true
    },
    "RandomNum": {
        type: Sequelize.STRING(5),
        allowNull: true
    },
    created_at: {
		type: 'TIMESTAMP',
		defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
		allowNull: false
    },
    "status": {
        type: Sequelize.TINYINT,
        defaultValue: 0,
        allowNull: false
    },
    "show_period": {
        type: Sequelize.TINYINT,
        defaultValue: 1,
        allowNull: false
    }
}

var Invoice = db.define('invoices', invoiceSchema,{
    timestamps: false,
    freezeTableName: true
});

module.exports = Invoice;
