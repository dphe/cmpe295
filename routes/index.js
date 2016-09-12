var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  genHTML(res);
});

function genHTML(res) {
  console.log("Request handler 'genHTML' for home page was called.");
  res.render('home', { title: 'CMPE295 Disaster Recover using SDN'});
}

module.exports = router;
