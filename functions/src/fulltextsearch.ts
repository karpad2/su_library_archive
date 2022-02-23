import * as functions from "firebase-functions";
import {initializeApp,storage} from "firebase-admin";

const mysql = require('mysql');


export default (async (req:functions.https.Request,res:functions.Response)=>  {
    initializeApp(functions.config().firebase);
    let text="";

    const mysql = require('mysql');
      const mysqlConfig = {
        connectionLimit: 1,
        host: "88.99.252.254",
        user: "subiblio_su_library_archive",
        password: "4wgfnJzHukhMM4Pq",
        database: "subiblio_su-library-archive",
        port: 3306
    };
    var con= mysql.createConnection(mysqlConfig).connect(function (err) {
        if (!err) {
            console.log("Database is connected");
        } else {
            console.log("Database is not connected " + err);
        }
    });
   
      let searched=req.params.text;
      let query="SELECT profiles,id,chapter_id,page FROM pdfs where text like '%"+mysql.escape(searched)+"%'";
  
      con.query(query, function (err, result, fields) {
        if (err) throw err;
        text=result;
      });
      
      res.set('Content-Type', 'application/json');
      res.status(200).send(text);
    return;
  });
