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


function getLatLong(place){

  console.log("here1");
  var placesObj = {};
  placesObj['san jose'] ={};
  placesObj['santa clara'] ={};
  placesObj['new york'] ={};
  placesObj['chicago'] ={};
  placesObj['houston']={};
  placesObj['san jose']['latitude'] = 	37.279518;
  placesObj['santa clara']['latitude'] = 37.354107;
  placesObj['new york']['latitude'] = 40.730610;
  placesObj['chicago']['latitude'] = 41.881832;
  placesObj['houston']['latitude'] = 29.682720;
  placesObj['san jose']['longitude'] = -121.867905;
  placesObj['santa clara']['longitude'] = -121.955238;
  placesObj['new york']['longitude'] = -73.935242;
  placesObj['chicago']['longitude'] = -87.623177;
  placesObj['houston'] ['longitude']= -95.593239;
  var ret_obj={};
  ret_obj['latitude']= placesObj[place]['latitude'];
  ret_obj['longitude']= placesObj[place]['longitude'];
  return ret_obj;
}

/* Create a disaster event */
router.post('/createDisasterEvent', function(req,res) {
  console.log("Request handler to create a new disaster");
  docObj={};
  docObj.dbType= "disasters";
  docObj.disasterName=req.body.disasterName;
  docObj.disasterTime = req.body.disasterTime;
  docObj.disasterTimeZone = req.body.disasterTimeZone;
  docObj.disasterLocation = req.body.disasterLocation;
  if(req.body.disasterLocation == "other"){
    docObj.disasterlatitude = req.body.disasterLatitude;
    docObj.disasterlongitude = req.body.disasterLongitude;
  }else{
    var latLongObj = getLatLong(req.body.disasterLocation.toString().toLowerCase());
    docObj.disasterlatitude = latLongObj.latitude;
    docObj.disasterlongitude = latLongObj.longitude;
  }


  db.update("dr-web-db",docObj,function (err,data) {
    if(!err) {
        res.status(200).send("Success");
    } else {
        res.status(500).send("error" + err)
    }
  });

});

module.exports = router;
