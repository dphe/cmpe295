var express = require('express');
var router = express.Router();
var app_root = require('app-root-path');
var db = require(app_root.path+'/services/database.js');



/* GET home page. */
router.get('/', function(req, res) {
  genHTML(res);
});

function genHTML(res) {
  console.log("Request handler 'genHTML' for home page was called.");
  res.render('home', { title: 'CMPE295 Disaster Recover using SDN'});
}


router.get('/datacenters-info',function(req, res) {
  res.render('datacenters-info');
});


/* GET list of datacenters page */

router.get('/fetchDatacenters', function(req,res) {

  console.log("Request handler 'fetchDatacenters' for datacenters page using routes.");
  db.fetchDatacenters("dr-web-db",function (err,resp) {
    if(err) {
      res.status(500).send('No datacenters returned');
    } else {
      res.json(resp);
    }
  });

})

/* Create a disaster event */
router.post('/createDisasterEvent', function(req,res) {
  console.log("Request handler to create a new disaster");
  docObj={};
  docObj.dbType= "disasters";
  docObj.disasterName=req.body.disasterName;
  docObj.disasterTime = req.body.disasterTime;
  docObj.disasterTimeZone = req.body.disasterTimeZone;
  docObj.disasterLocation = req.body.disasterLocation;

  db.update("dr-web-db",docObj,function (err,data) {
      if(!err) {
        console.log("here1234");
          res.status(200).send("Success");
      } else {
          res.status(500).send("error" + err)
      }

  });

});

module.exports = router;
