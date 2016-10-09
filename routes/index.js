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

/* GET datacenters page */

var datacenterServices = require("../public/javascripts/database/datacenters.js");
console.log("Initialized services");

function genDatacentersHTML(res) {
    console.log("Request handler 'genDatacentersHTML' for datacenters page.");
    res.render('datacenters-info');
}

router.get('/datacenters-info',function(req, res) {
  genDatacentersHTML(res);
});



/* GET list of datacenters page */

router.get('/fetchDatacenters', function(req,res) {

  console.log("Request handler 'fetchDatacenters' for datacenters page using routes.");
 // datacenterServices.initializaCloudant(); //TODO:Move it somewhere else!
  console.log("Initialization done");
  datacenterServices.fetchDatacenters(function (err,resp) {
    if(err) {
      console.log(err.stack);
      res.status(500).send('No datacenters returned');
    } else {
      console.log(resp);
      res.json(resp);
    }

  });

})

function genDisasterNotificationsHTML(res) {
    console.log("Request handler 'genDisasterNotificationsHtml' for disaster notifications page");
    var homeTabs = $('#homeTab');
    homeTabs.addClass('hidden');
    res.render('notifications');
}

router.get('/notifications', function(req, res) {
    console.log("Getting /notifications page");
    genDisasterNotificationsHTML(res);
});


//Socket code for receiving alerts

module.exports = router;
