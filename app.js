var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var User = require("./model/User");
app.set("views", path.join(__dirname, "views")); //view的路徑位在資料夾views中

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser("secretString"));
app.use("/assets", express.static("assets"));
app.use("/", express.static(__dirname));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(function(req, res, next) {
	if (!req.body.shopeesecret) {
		if (req.cookies.isLogin) {
			User.findOne({
				where: { id: req.cookies.id },
				attributes: ["id", "username", "role", "ship","inv"]
			}).then(function(user) {
				req.user = user;
				next();
			});
		} else {
			next();
		}
	} else {
		next();
	}
});

app.use("/api", require("./api"));
app.use("/users", require('./user'));
app.use("/notes", require('./note'));

app.get("/", function(req, res) {
	if (req.user) {
		res.render("profile", {
			me: req.user
		});
	} else {
		res.redirect("/users/login");
	}
});

app.get("/inv", function(req, res) {
	if (req.user) {
		if (req.user.role == 2 || req.user.inv == 1) {
			res.render("inv", {
				me: req.user
			});
		} else {
			res.redirect("/");
		}
	} else {
		res.redirect("/users/login");
	}
});

app.get("/ship", function(req, res) {
	if (req.user) {
		if (req.user.role == 2 || req.user.ship == 1) {
			res.render("ship", {
				me: req.user
			});
		} else {
			res.redirect("/");
		}
	} else {
		res.redirect("/users/login");
	}
});

app.get('/downloadexcel', function(req, res) {
	res.download('./file/待出貨商品統計.xlsx');
});

app.use(function(err, req, res, next) {
	res.status(500).send(err);
});

app.get('*', function(req, res, next) {
	res.status(404).send('Page not found');
});

app.listen(3000, function() {
	console.log("Listen on port 3000!");
});
