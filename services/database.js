/**
 * Created by Roopa on 10/9/16.
 */


var app_root = require('app-root-path');
var env = process.env.NODE_ENV;
require('dotenv').load();

// DB modules
var Cloudant = require('cloudant');
var db_params = require(app_root+'/config/database')[env] ;
var cloudant = require('cloudant')({account: db_params.username,db_params:env.key_user, db_params:env.pwd_user});

var main_db  = cloudant.db.use('cmpe295');

//Get DB Object
function getDBObject(dbName,callback){
    if(dbName == 'cmpe295'){
        callback(null,main_db);
    }else{
        callback("Invalid");
    }
}

//Get document with doc ID
exports.get = function  (docName,callback){
    console.log("Reading document 'datacenter'");
    getDBObject(db_name,function(err,db){
        if(!err){
            db.get(docName, function(err, data) {
                console.log("Error:", err);
                callback(err, data);
            });
        }else{
            callback(err);
        }
    });

};

// create or update a document
exports.update = function  (docObj,callback){
    getDBObject(db_name,function(err,db){
        if(!err){
            db.insert(docObj, function(err, data) {
                console.log("Error:", err);
                callback(err, data);
            });
        }else{
            callback(err);
        }
    });
};

// list all documents
exports.list = function  (db_name,callback){
    getDBObject(db_name,function(err,db){
        if(!err){
            console.log("Listing documents");
            db.list(function(err, body) {
                console.log("Error:", err);
                callback(err, body);
            });
        }else{
            callback(err);
        }
    });

};

// fetch all documents with details

exports.fetchDatacenters = function  (db_name,callback){
    getDBObject(db_name,function(err,db){
        if(!err){
            console.log("Fetching documents: datacenter");
            db.list(function(err, body) {
                console.log("FetchDatacenters Error:", err);
                datacenter_db.fetch(body,function(err, body) {
                    var array_size = 0;
                    var array_documents = [];
                    body.rows.forEach((function(db) {
                        array_documents.push(db.doc);
                        array_size++;
                    }))
                    if(array_size == (Object.keys(body.rows).length)) {
                        callback(err,array_documents);
                    }
                    else {
                        callback(err);
                    }
                })
            });
        }else{
            callback(err);
        }
    });
}

// Get document details with a search index object

exports.finaDocsWithSearchIndex = function  (db_name,indexObj,callback){
    getDBObject(db_name,function(err,db){
        if(!err){
            var SearchObj = {};
            if(indexObj){
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
                    callback(null,records_data);
                } else {
                    callback(err);
                }
            });
        }else{
            callback(err);
        }
    });
}

//Delete a document in Cloudant
exports.destroy = function  (db_name,doc_id,doc_rev,callback){

    getDBObject(db_name,function(err,db){
        if(!err){
            db.destroy(doc_id, doc_rev, function(err, body) {
                if (!err) {
                    callbacl(body);
                } else {
                    console.log(err);
                    callback(err);
                }
            });
        }else{
            console.log(err);
            callback(err);
        }
    });
};