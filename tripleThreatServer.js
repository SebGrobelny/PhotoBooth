/* This server, unlike our previous ones, uses the express framework */
var express = require('express');
var formidable = require('formidable');  // we upload images in forms
// this is good for parsing forms and reading in the images

// make a new express server object
var app = express();

var sqlite3 = require("sqlite3").verbose();  // use sqlite
var dbFile = "photos.db"
var db = new sqlite3.Database(dbFile);  // new object, old DB

// Now we build a pipeline for processing incoming HTTP requests

// Case 1: static files
app.use(express.static('public')); // serve static files from public
// if this succeeds, exits, and rest of the pipeline does not get done

// Case 2: queries
//ex: getQueryValueFor(type, 138.68.25.50:???/query?img=hula&type=getLabel)
//returns "getLabel"
function getQueryValueFor(key, url){
  var query = url.split("?")[1]; 
  console.log("Query String is : "+query);

  var tag = query.split("&");

  for(i=0; i<tag.length; i++){
    var kvPair = tag[i].split("=");
    if(kvPair[0]==key){
        console.log("Returning: "+kvPair[1]);
      return kvPair[1];
    }
  }
}



app.get('/query', function (request, response){
    // console.log("get request");
    console.log(request);
     var url = request.url; //the url, like "138.68.25.50:???/query?img=hula"
     var queryType = getQueryValueFor("op", url);
     console.log("The query type is:"+queryType);
    //query = request.url.split("?")[1]; // get query string
    if(queryType == "rmvLabels")
    {
        answerRmvLabels(url,response);
    }

    if(queryType == "getLabels")
    {
        //console.log(queryType);
        answerGetLabels(url,response);
    }

    if(queryType == "addLabels")
    {
        answerAddLabels(url,response);
    }

    if(queryType == "dumpDB")
    {
        answerDumpData(response);
    }

    if( queryType == "postFavorite")
    {
        console.log("posting to favorite");
        answerPostFavorite(url, response);
    }

    if (queryType == "dumpFavorite")
    {
        console.log("posting to favorite");
        answerDumpFavorite(response);
    }

    if (queryType == "filter")
    {
        console.log("posting to favorite");
        answerFilter(url, response);
    }


});

// Case 3: upload images
// Responds to any POST request
app.post('/', function (request, response){
    var form = new formidable.IncomingForm();
    form.parse(request); // figures out what files are in form

    // callback for when a file begins to be processed
    var filename = null;
    form.on('fileBegin', function (name, file){
        filename = file.name;
        // put it in /public
        file.path = __dirname + '/public/' + file.name;
        console.log("uploading ",file.name,name);



            function errorCallback(err) {
                if (err) {
                    console.log("error: ",err,"\n");
                }
            }

            function dataCallback(err, tableData) {
                if (err) {
                    console.log("error: ",err,"\n");
                } 
            else {
                    console.log("got: ",tableData,"\n");
                }
            }

          //  db.serialize( function () {

            console.log("starting DB operations");

            // Insert or replace rows into the table
            db.run('INSERT OR REPLACE INTO photoLabels VALUES (?, "", 0)',[file.name],errorCallback);
            db.get('SELECT labels FROM photoLabels WHERE fileName = ?', [file.name],dataCallback);


            /* Some more examples of database commands you could try
            // Dump whole database 
            // db.all('SELECT * FROM photoLabels',dataCallback);
            // fill-in-the-blanks syntax for Update command
            */
       

    });
        // You need to uncomment the line below when you uncomment the call
        // to db.serialize 
     // });
        // callback for when file is fully recieved
    url = 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyCT-4iY8NRGBRYvHRGCR1KyOsFSMckwN7c';
    
    var LIVE = true;
    var request = require('request');
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    
    form.on('end', function (){
            requestObject = {
                "requests": [
                {
                "image": {
                    "source": {"imageUri": "http://138.68.25.50:7398/" + filename}
                    },
                "features": [{ "type": "LABEL_DETECTION" }]
                }
            ]
            }
                
            if (LIVE) {
                        request(
                           { // HTTP header stuff
                              url: url,
                              method: "POST",
                              headers: {"content-type": "application/json"},
                              // stringifies object and puts into HTTP request body as JSON 
                              json: requestObject,
                           },
                        // callback function for API request
                        APIcallback
                        );
                        
                    function APIcallback(err, APIresponse, body) {
                                if ((err) || (APIresponse.statusCode != 200)) {
                                   console.log("Got API error"); 
                                        console.log(body.error.message);
                                       console.log(body.responses[0].error.message);
                                } else {
                                   APIresponseJSON = body.responses[0];
                                   console.log(APIresponseJSON);
                                
                                        var APIlabels = '';
                                    for (var i = 0; i < APIresponseJSON.labelAnnotations.length; i++) {
                                        APIlabels += ', ' + APIresponseJSON.labelAnnotations[i].description;
                                       
                                    }
                                     db.run('INSERT OR REPLACE INTO photoLabels VALUES (?, ?, 0)', [filename, APIlabels]);
                                    
                                    console.log('success');
                                    sendCode(201,response,APIlabels);  // respond to browser
                                    
                                }
                            }
                    }

        });
});

// You know what this is, right? 
app.listen(7398);


    
function answerGetLabels(url,response)
{
    console.log("answerGetLabels");
    var labelStr;
    var imgName = getQueryValueFor("img", url);

    db.get(
    'SELECT labels FROM photoLabels WHERE fileName = ?',
    [imgName],dataCallback);

    function dataCallback(err, tableData) {
        if(err){
          console.log("error: ",err,"\n");
          sendCode(400,response,"error reading DB")
        }else{

          if(tableData){
            labelStr = tableData.labels;
            console.log("got: ",tableData,"\n");
          }

            if (labelStr) {
           // response.status(200);
            response.type("text/json");
            sendCode(200,response,labelStr);
            //response.send(labelStr);
            } else {
                sendCode(400,response,"requested photo not found");
            }
          
          //console.log("labels for image: ",labelStr,"\n");
        }
    }

}

// query looks like: op=add&img=[image filename]&label=[label to add]
function answerAddLabels(url, response)
{
    console.log("answerAddLabels");
    var labelStr;
    var imgName = getQueryValueFor("img", url);

    var newLabel = getQueryValueFor("label", url);

    db.get(
    'SELECT labels FROM photoLabels WHERE fileName = ?',
    [imgName],getCallback);

    function getCallback(err,data) {
    console.log("getting labels from "+imgName);
    if (err) {
            console.log("error: ",err,"\n");
            sendCode(400,response,"error reading DB");
        } 
    else {

        if(data.labels == "")
        {
            data.labels = newLabel;
        }
        else
        {
            data.labels = data.labels+", "+newLabel
        }

        labelStr = data.labels;

            // good response...so let's update labels
            db.run(
            'UPDATE photoLabels SET labels = ? WHERE fileName = ?',
            [data.labels, imgName],
            updateCallback);


        }
    }

            // callback for db.run('UPDATE ..')
        // Also defined inside answer so it knows about
        // response object
        function updateCallback(err) {
        console.log("updating labels for "+imgName+"\n");
        if (err) {
            console.log(err+"\n");
            sendCode(400,response,"requested photo not found");         
        } else {
            console.log("here");
           // response.status(200);
            console.log("posted status");
            response.type("text/json");
            console.log("posted type");
            sendCode(200,response,labelStr);
            //response.send(labelStr);
            console.log("sent it");
        }
    }
    //answerGetLabels(url,response);

}

function answerRmvLabels(url, response){
    console.log("answerRmvLabels");
    var newStr;
    var imgName = getQueryValueFor("img", url);

    var rmvLabel = getQueryValueFor("label", url);

    console.log(rmvLabel);

    db.get(
    'SELECT labels FROM photoLabels WHERE fileName = ?',
    [imgName],obtCallback);

    function obtCallback(err,mydata) {
    console.log("getting labels from "+imgName);
    if (err) {
            console.log("error: ",err,"\n");
            sendCode(400,response,"error reading DB");
        } 
    else {

            if(mydata.labels.length == 1)
            {
                mydata.labels = "";
            }
            else
            {
                //convert from http to normal text 
                var find = "%20";
                var re = new RegExp(find, 'g');
                var rmvLabel = rmvLabel.replace(re, " ");
                console.log(rmvLabel);

                mydata.labels = mydata.labels.replace(", "+rmvLabel,"")
            }
            
            console.log("new labels are "+mydata.labels);
        

        newStr = mydata.labels;

            // good response...so let's update labels
              db.run(
            'UPDATE photoLabels SET labels = ? WHERE fileName = ?',
            [mydata.labels, imgName],
            renewCallback);


        }
    }

        // callback for db.run('UPDATE ..')
        // Also defined inside answer so it knows about
        // response object
        function renewCallback(err) {
        console.log("updating labels for "+imgName+"\n");
        if (err) {
            console.log(err+"\n");
            sendCode(400,response,"requested photo not found");         
        } else {
            // response.status(200);
            response.type("text/json");
            // response.send(labelStr);
            sendCode(200,response,newStr);
        }
    }

}



function answerDumpData( response) {
        console.log("taking a dump");


        
                console.log("dumping database");
                db.all("SELECT * FROM photoLabels", dataCallback);

                function dataCallback(err, tableData) {
                        if (err) {
                                console.log("error: ", err, "\n");
                                sendCode(400,response,"error reading DB");
                        }

                        else {
                                console.log("got: ", tableData, "\n");
                                console.log("about to send");
                                response.type("text/json");
                                sendCode(200,response,tableData);
                                console.log("sent");

                        }
                }

}

function answerDumpFavorite(response) {
        console.log("taking a favorite dump");


        
                console.log("dumping database");
                db.all("SELECT * FROM photoLabels WHERE favorite = ?",1, dataCallback);

                function dataCallback(err, tableData) {
                        if (err) {
                                console.log("error: ", err, "\n");
                                sendCode(400,response,"error reading DB");
                        }

                        else {
                                console.log("got: ", tableData, "\n");
                                console.log("about to send");
                                response.type("text/json");
                                sendCode(200,response,tableData);
                                console.log("sent");

                        }
                }

}


function answerPostFavorite(url, response){

    var imgName = getQueryValueFor("img", url);

        db.get(
    'SELECT labels FROM photoLabels WHERE fileName = ?',
    [imgName],getCallback);

           function getCallback(err,data) {
    console.log("getting labels from "+imgName);
    if (err) {
            console.log("error: ",err,"\n");
            sendCode(400,response,"error reading DB");
        } 
    else {

            // good response...so let's update labels
            db.run(
            'UPDATE photoLabels SET favorite = ? WHERE fileName = ?',
            [1, imgName],
            renewCallback);


        }
    }

            function renewCallback(err) {
            console.log("updating labels for "+imgName+"\n");
            if (err) {
                console.log(err+"\n");
                sendCode(400,response,"requested photo not found");         
            }
            sendCode(200,response, "");
        }



}

function answerFilter(url, response)
{
    var label = getQueryValueFor("label", url);

        db.all(
    'SELECT * FROM photoLabels WHERE labels LIKE ?',
    [label],dataCallback);

                function dataCallback(err, tableData) {
                if (err) {
                        console.log("error: ", err, "\n");
                        sendCode(400,response,"error reading DB");
                }

                else {
                        console.log("got: ", tableData, "\n");
                        console.log("about to send");
                        response.type("text/json");
                        sendCode(200,response,tableData);
                        console.log("sent");

                }
        }

}

// sends off an HTTP response with the given status code and message
function sendCode(code,response,message) {
    //console.log("Getting sent from sendCode with : "+message);
    response.status(code);
    response.send(message);
}

// // show just the answer function when this file is included as a module
// exports.answer = answer;

