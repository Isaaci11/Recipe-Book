var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cons = require('consolidate'); // consolidate module
var dust = require('dustjs-helpers');
var {Client} = require('pg'); // postgres modules
var app = express();


// What is a pool?
//const { Pool, Client } = pg;
const connectionString = 'postgresql://isaac:newpassword@localhost:3000/isaac'; //changed database.server.com to local host bcause I am connecting to a local db
const client = new Client({
    connectionString,
}); //we created the client


// What is this Pool configuration
//const pool = new Pool({
//    connectionString,
//});




// Assigns dust engine to .dust files
app.engine('dust', cons.dust);

// Set default ext .dust
app.set('view engine', 'dust');
app.set('views', path.join(__dirname, 'views'));

// Set public folder
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



// Start the server before defining routes to ensure all routes are set up correctly.
// This avoids potential asynchronous issues or module loading quirks. 


//server 
app.listen(3001, function(){ 
    console.log('Server Started on Port 3001'); 
});


// Define a route 
//The reason I think I can forward port to 3000 is because that is the port by databse is using
//This is the route

app.get('/', function(req, res) {
    client.connect((err) => { //make sure when you call connect you have a handler which handels any errors whic may occur
        if (err) { //if an error is logged  when we connect then we log it
            console.error('Connection error', err.stack);
        } else {
            client.query('SELECT * FROM recipes', function(err, result) { //else we query the database
                if (err) { //if we get an error then we log that error I honeslty want to know what javascript params are always using anyomous functions 
                    //and what is kinda of the meaning schema of the paramamters and how it works
                    console.log(err.message);
                } else {
                    console.log("Query successful");
                    res.render('index', { recipes: result.rows[1] }); //what does the result object look like and it seems to be an array of things
                }
                client.end(); //we end after we finshed querying the results from the client
            });
        }
    });
});