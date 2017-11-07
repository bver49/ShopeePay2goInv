var express = require("express");
var router = express.Router();
var bcrypt = require('bcrypt');
var User = require("./model/User");
const Op = require("sequelize").Op;

router.get("/", function(req, res) {
	if (req.user && req.user.role == 2) {
		User.findAll({
			where: {
				role: {
					[Op.ne]: 2
				}
			},
			attributes: ["id", "username", "role","inv","ship"]
		}).then(function(result) {
			res.render("users", {
				users: result,
				me: req.user
			});
		}).catch(function(err) {
			res.send(err);
		});
	} else {
		res.redirect("back")
	}
});

router.post("/", function(req, res) {
	bcrypt.hash(req.body.password, 5, function(err, hash) {
		req.body.password = hash;
		User.create(req.body).then(function(result) {
			res.send("ok");
		}).catch(function(err) {
			res.send(handleError(err));
		});
	});
});

router.get("/login", function(req, res) {
	res.clearCookie("isLogin");
	res.clearCookie("id");
	res.render("login");
});

/*
router.get("/signup", function(req, res) {
  res.clearCookie("isLogin");
  res.clearCookie("id");
  res.render("signup");
});
*/

router.get("/profile", function(req, res) {
	if (req.user) {
		res.render("profile", {
			me: req.user
		});
	} else {
		res.redirect("login");
	}
});


//Login auth
router.post("/auth", function(req, res) {
	User.findOne({ where: { username: req.body.username } }).then(function(user) {
		if (user) {
			bcrypt.compare(req.body.password, user.password, function(err, result) {
				if (result == true) {
					if (user.role > 0) {
						res.cookie("isLogin", 1, { maxAge: 60 * 60 * 1000 });
						res.cookie("id", user.id, { maxAge: 60 * 60 * 1000 });
						res.send("ok");
					} else {
						res.send("用戶尚未開通");
					}
				} else {
					res.send("密碼錯誤");
				}
			});
		} else {
			res.send("找不到用戶");
		}
	});
});

router.get("/logout", function(req, res) {
	res.clearCookie("isLogin");
	res.clearCookie("id");
	res.redirect("login");
});

router.put("/:id", function(req, res) {
	bcrypt.hash(req.body.password, 5, function(err, hash) {
		req.body.password = hash;
		User.update(req.body, {
			where: { id: req.params.id }
		}).then(function(result) {
			res.send("ok");
		}).catch(function(err) {
			res.send(handleError(err));
		});
	});
});

router.put("/verify/:id", function(req, res) {
	if (req.user.role == 2) {
		User.update({ role: 1 }, {
			where: { id: req.params.id }
		}).then(function(result) {
			res.send("ok");
		}).catch(function(err) {
			res.send(handleError(err));
		});
	} else {
		res.send("fail");
	}
});

router.put("/allow/:job/:id", function(req, res) {
	if (req.user.role == 2) {
		var data = {}
		data[req.params.job] = 1;
		User.update(data, {
			where: { id: req.params.id }
		}).then(function(result) {
			res.send("ok");
		}).catch(function(err) {
			res.send(handleError(err));
		});
	} else {
		res.send("fail");
	}
});

router.put("/notallow/:job/:id", function(req, res) {
	if (req.user.role == 2) {
		var data = {}
		data[req.params.job] = 0;
		User.update(data, {
			where: { id: req.params.id }
		}).then(function(result) {
			res.send("ok");
		}).catch(function(err) {
			res.send(handleError(err));
		});
	} else {
		res.send("fail");
	}
});

router.delete("/:id", function(req, res) {
	User.destroy({ where: { id: req.params.id } }).then(function(result) {
		res.send("ok");
	}).catch(function(err) {
		res.send(handleError(err));
	})
});

function handleError(err) {
	var errmsg = [];
	for (var i in err.errors) {
		errmsg.push(err.errors[i].message);
	}
	return errmsg;
}

module.exports = router;
