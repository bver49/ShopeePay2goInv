var db = require("./db");
var Sequelize = require("sequelize");

var userSchema = {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
    username: {
        type: Sequelize.STRING,
        validate: {
            len: {
                args: 4,
                msg: "帳號長度請大於4個字母"
            }
        },
        unique:true
    },
    password: {
        type: Sequelize.STRING,
        validate: {
            len: {
                args: 6,
                msg: "密碼長度請大於6個字母"
            }
        }
    },
	role: {
        type: Sequelize.INTEGER,
        defaultValue:0
	},
	ship: {
		type: Sequelize.INTEGER,
        defaultValue:0
	},
	inv: {
		type: Sequelize.INTEGER,
        defaultValue:0
    },
    syncitems: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
	created_at: {
		type: 'TIMESTAMP',
		defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
		allowNull: false
	}
}

var User = db.define('users', userSchema,{
  timestamps: false,
  freezeTableName: true
});

module.exports = User;
