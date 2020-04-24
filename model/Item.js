var db = require("./db");
var Sequelize = require("sequelize");

var itemSchema = {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	shopee_id: {
		type: Sequelize.STRING,
        defaultValue:0
    },
    sku: {
        type: Sequelize.STRING
    },
    product_name: {
        type: Sequelize.STRING,
    },
    on_yahoo: {
		type: Sequelize.INTEGER,
        defaultValue:0
    },
    yahoo_store: {
        type: Sequelize.STRING
    },
    yahoo_id: {
		type: Sequelize.STRING,
        defaultValue:0
    },
	created_at: {
		type: 'TIMESTAMP',
		defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
		allowNull: false
    },
    updated_at: {
		type: 'TIMESTAMP',
		defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
		allowNull: false
	}
}

var Item = db.define('items', itemSchema, {
    timestamps: false,
    freezeTableName: true
});

module.exports = Item;
