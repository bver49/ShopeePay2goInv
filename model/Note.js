var db = require("./db");
var Sequelize = require("sequelize");

var noteSchema = {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
  sn:{
    type: Sequelize.STRING,
    unique:true
  },
  content:{
    type: Sequelize.STRING
  },
	order_time:{
		type: Sequelize.INTEGER
	},
	created_at: {
		type: 'TIMESTAMP',
		defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
		allowNull: false
	}
}

var Note = db.define('note', noteSchema,{
  timestamps: false
});

module.exports = Note;
