/**
 * Created by Roopa on 10/9/16.
 */

require('dotenv').load();
var app_root = require('app-root-path');
var env = process.env.NODE_ENV;


// DB modules
var Cloudant = require('cloudant');
var db_params = require(app_root + '/config/database.js')[env];
var cloudant = require('cloudant')({
  account: db_params.username,
  key: db_params.key_user,
  password: db_params.pwd_user
});
var main_db = cloudant.db.use('cmpe295');
var dev_db = cloudant.db.use('dr-web-db');

//Get DB Object

var getDBObject = function (dbName, callback) {
  if (dbName == 'cmpe295') {
    callback(null, main_db);
  } else if (dbName == 'dr-web-db') {
    callback(null, dev_db);
  } else {
    callback("Invalid Database Name");
  }
}

//Get document with doc ID

exports.get = function (dbName, docName, callback) {
  getDBObject(dbName, function (err, db) {
    if (!err) {
      db.get(docName, function (err, data) {
        if (!err) {
          console.log(data);
          callback(null, data);
        } else {
          console.log("Error in getting document:", err);
          callback(err, data);
        }
      });
    } else {
      console.log("Error in getting db object", err);
      callback(err);
    }
  });
};

// create or update a document
exports.update = function (db_name, docObj, callback) {
  getDBObject(db_name, function (err, db) {
    if (!err) {
      console.log(docObj,db_name);
      db.insert(docObj, function (err, data) {
        if(!err){
          callback(null, data);
        }else{
          callback(err);
        }
      });
    } else {
      callback(err);
    }
  });
};

// list all documents
exports.list = function (db_name, callback) {
  getDBObject(db_name, function (err, db) {
    if (!err) {
      console.log("Listing documents");
      db.list(function (err, body) {
        console.log("Error:", err);
        callback(err, body);
      });
    } else {
      callback(err);
    }
  });

};

// fetch all documents with details
exports.fetchDatacenters = function (db_name, callback) {

  getDBObject(db_name, function (err, db) {
    if (!err) {
      console.log("Fetching documents:");
      db.list(function (err, body) {
        if (!err) {
          db.fetch(body, function (err, body) {
            var array_size = 0;
            var array_documents = [];
            body.rows.forEach((function (db) {
              array_documents.push(db.doc);
              array_size++;
            }))
            if (array_size == (Object.keys(body.rows).length)) {
              callback(err, array_documents);
            }
            else {
              callback(err);
            }
          });
        } else {
          console.log("FetchDatacenters Error:", err);
        }
      });
    } else {
      callback(err);
    }
  });
}

// Get document details with a search index object

exports.finaDocsWithSearchIndex = function (db_name, indexObj, callback) {
  getDBObject(db_name, function (err, db) {
    if (!err) {
      var SearchObj = {};
      if (indexObj) {
        SearchObj = indexObj;
      } else {
        SearchObj = {
          "selector": {
            "_id": {
              "$gt": 0
            }
          }
        }
      }
      db.find(SearchObj, function (err, result) {
        if (!err) {
          if (result.docs && result.docs.length) {
            count++;
            result.docs.map(function (i) {
              records_data.push(i);
            });
          }
          callback(null, records_data);
        } else {
          callback(err);
        }
      });
    } else {
      callback(err);
    }
  });
}

//Delete a document in Cloudant
exports.destroy = function (db_name, doc_id, doc_rev, callback) {

  getDBObject(db_name, function (err, db) {
    if (!err) {
      db.destroy(doc_id, doc_rev, function (err, body) {
        if (!err) {
          callbacl(body);
        } else {
          console.log(err);
          callback(err);
        }
      });
    } else {
      console.log(err);
      callback(err);
    }
  });
};