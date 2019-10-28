let express = require('express'),
    app     = express(),
    bodyParser = require('body-parser'),
    mysql   = require('mysql')
    morgan = require('morgan')
    dotenv = require('dotenv');

// Set up the .env file to access through process.env.VALUE
dotenv.config();

// App server is now serving all the files in this folder, just use root
app.use(express.static('./public')); 

app.use(morgan('short'));

// Middleware to help process requests, it can go in POST request and retrieve data
app.use(bodyParser.urlencoded({ extended: false }));

// Sets the extension 
app.set('view engine', 'ejs');

/*************************** DATABASE CONNECTION ******************************/
getConnection=()=>{ 
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: "#kernal32",
        database: 'book_syn_app'
    });
};

let connection = getConnection();

/************************** CREATE DATABASE  *********************************/
connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    connection.query("CREATE DATABASE IF NOT EXISTS book_syn_app", function (err, result) {
        if (err) throw err;
        console.log(result);
    });
});

/*************************** CREATE TABLE ************************************/

connection.query(`CREATE TABLE IF NOT EXISTS books
    (
        title VARCHAR(255) DEFAULT 'title' NOT NULL ,
        author VARCHAR(255) DEFAULT 'author' NOT NULL 
    );`,
     (err,result)=>{
        if(err) throw err;
        console.log('Created book table');
});

app.get('/',(req,res)=>{
    res.render('landing');
});


/*************************** SELECT ******************************************/
makeSelectQuery = (queryString, queryVariables, res, connection, route) => {
   
    // Query the Database
    connection.query(queryString, queryVariables, (err, rows, fields) => {
        if (err) {
            console.log('failed to query users' + err)
            res.sendStatus(500);
            // throw err (can do this istead)
            res.end();
            return
        }

        // Rename the values from SQL for JSON
        let books = rows.map(row => {
            return { title: row.title, author: row.author }
        });

        res.render(route, {books});
    })
}; // makeSelectQuery()

app.get('/books', (req, res) => {
    
    // SELECT all books
    const queryString = "SELECT * FROM books";
    let renderType = 'render';
    let queryVariables = [];
    let route = 'books/index';
    makeSelectQuery(queryString, queryVariables,  res,connection, route);
    
});

/*************************** INSERT ******************************************/
app.get('/books/create',(req,res)=>res.render('books/create'));

app.post('/books', (req,res)=>{
    let title = req.body.title;
    let author = req.body.author;

    let queryString = 'INSERT INTO books (title, author) VALUES (?,?)';
    connection.query(queryString, [title,author],(err,results,fields)=>{
        if (err) {
            console.log('Failed to input new book.');
            res.sendStatus(500);
            return
        }
        console.log('Inserted a new book ' + results.insertId);
        res.redirect('/books');
    })
})

app.listen(process.env.PORT,()=>{
    console.log(`Server is running and listening on ${process.env.PORT}...`);
});