let express = require('express'),
    app     = express(),
    bodyParser = require('body-parser'),
    mysql   = require('mysql')
    morgan = require('morgan')
    dotenv = require('dotenv')
    methodOverride = require('method-override')
    connection = require('./routes/dbconnection')
    passport    = require('passport')
    LocalStrategy = require('passport-local').Strategy;

// ROUTES
let bookRoutes = require('./routes/books');
let synopsisRoutes = require('./routes/synopsis');

// Set up the .env file to access through process.env.VALUE
dotenv.config();

// App server is now serving all the files in this folder, just use root
app.use(express.static('./public')); 

// Log requests to the console
app.use(morgan('dev'));

// Middleware to help process requests, it can go in POST request and retrieve data
app.use(bodyParser.urlencoded({ extended: false }));

// Sets the extension 
app.set('view engine', 'ejs');

// METHOD-OVERRIDE (PUT form action) ?_method=PUT
app.use(methodOverride('_method'));

// USE ROUTES
app.use('/books', bookRoutes);
app.use('/synopsis', synopsisRoutes);


// /************************** CREATE DATABASE  *********************************/
// connection.connect(function (err) {
//     if (err) throw err;
//     console.log("Connected!");
//     connection.query("CREATE DATABASE IF NOT EXISTS books_app", function (err, result) {
//         if (err) throw err;
//         console.log("Created "+result.insertId);
//     });
// });

/***************************** LANDING PAGE **********************************/

app.get('/', (req, res) => res.render('landing'));


/***************************** START SERVER **********************************/

app.listen(process.env.PORT,()=>console.log(`Server is running and listening on ${process.env.PORT}...`));