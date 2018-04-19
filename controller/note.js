var express = require("express");
var router = express.Router();
var Note = require("../model/Note");
const Op = require("sequelize").Op;

router.get("/", function(req, res) {
  Note.findAll({
    where: {
      order_time: {
        [Op.lte]: req.query.tt,
        [Op.gte]: req.query.tf
      }
    }
  }).then(function(notes) {
    var result = {}
    for(var i in notes) {
      result[notes[i].sn] = notes[i].content;
    }
    res.send(result);
  });
});

router.post("/", function(req, res) {
  Note.create(req.body).then(function(result) {
    res.send("ok");
  }).catch(function(err) {
    res.send(handleError(err));
  });
});

router.put("/:sn", function(req, res) {
  Note.update(req.body, {
    where: { sn: req.params.sn }
  }).then(function(result) {
    res.send("ok");
  }).catch(function(err) {
    res.send(handleError(err));
  });
});

router.delete("/:sn", function(req, res) {
  Note.destroy({ where: { sn: req.params.sn } }).then(function(result) {
    res.send("ok");
  }).catch(function(err) {
    res.send(handleError(err));
  })
});

function handleError(err) {
  var errmsg = [];
  for(var i in err.errors) {
    errmsg.push(err.errors[i].message);
  }
  return errmsg;
}

module.exports = router;
