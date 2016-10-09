/**
 * Created by dhanyapai on 9/23/16.
 */
//package datacenterSpecific code into it's own namespace -GP

initializaCloudant = (function ($) {
        console.log("Entered Datacenter initial")
    if (!process.env.CLOUDANT_URL) {
        console.error("Please add the URL of the Cloudant instance in an environment variable 'CLOUDANT_URL'")
        process.exit(1)
    }
// load the Cloudant library
    else {
        console.log("else");
        console.log(process.env.CLOUDANT_URL);
        var async = require('async'),
            Cloudant = require('cloudant'),
            cloudant = Cloudant({url: process.env.CLOUDANT_URL})
            var dbname = 'dr-web-db'  //the databases specific to web will be prefixed by 'web'.
            datacenter_db  = cloudant.db.use(dbname);
            doc = null;
        console.log("AFTER USE");
        //datacenter_db = cloudant.db.use(dbname);
        console.log("After initialization");

    }
})();


// read a document
    var readDocument = function(callback) {
        console.log("Reading document 'datacenter'");
        datacenter_db .get("datacenter-1", function(err, data) {
            console.log("Error:", err);
            console.log("Data:", data);
            // keep a copy of the doc so we know its revision token
            doc = data;
            callback(err, data);
        });
    };

// update a document
    var updateDocument = function(callback) {
        console.log("Updating document 'datacenter-1'");
        // make a change to the document, using the copy we kept from reading it back
        doc.c = true;
        datacenter_db .insert(doc, function(err, data) {
            console.log("Error:", err);
            console.log("Data:", data);
            // keep the revision of the update so we can delete it
            doc._rev = data.rev;
            callback(err, data);
        });
    };

// list all documents
     listDatacenters = function (callback) {
        console.log("Listing documents: 'datacenter");

        datacenter_db.list(function(err, body) {
            console.log("Error:", err);
            body.rows.forEach(function(db) {
               // console.log(db);
            });
        });
    };
// fetch all documents with details
   fetchDatacenters = function(callback) {
        console.log("Fetching documents: datacenter");
        datacenter_db.list(function(err, body) {
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

    }
    /*


     // deleting a document
     var deleteDocument = function(callback) {
     console.log("Deleting document 'mydoc'");
     // supply the id and revision to be deleted
     db.destroy(doc._id, doc._rev, function(err, data) {
     console.log("Error:", err);
     console.log("Data:", data);
     callback(err, data);
     });
     };

     // deleting the database document
     var deleteDatabase = function(callback) {
     console.log("Deleting database '" + dbname  + "'");
     cloudant.db.destroy(dbname, function(err, data) {
     console.log("Error:", err);
     console.log("Data:", data);
     callback(err, data);
     });
     };
     */

    //async.series([readDocument ]);

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
        initializaCloudant :initializaCloudant,
        fetchDatacenters: fetchDatacenters

    };
}

else {
    window.datacenterServices = {
        initializaCloudant :initializaCloudant,
        fetchDatacenters: fetchDatacenters

    };

}



