let express = require('express'),
    app     = express(),
    bodyParser = require('body-parser'),
    mysql   = require('mysql')
    morgan = require('morgan')
    dotenv = require('dotenv')
    methodOverride = require('method-override');

// Set up the .env file to access through process.env.VALUE
dotenv.config();

// App server is now serving all the files in this folder, just use root
app.use(express.static('./public')); 

app.use(morgan('short'));

// Middleware to help process requests, it can go in POST request and retrieve data
app.use(bodyParser.urlencoded({ extended: false }));

// Sets the extension 
app.set('view engine', 'ejs');

// METHOD-OVERRIDE (PUT form action) ?_method=PUT
app.use(methodOverride('_method'));

/*************************** DATABASE CONNECTION ******************************/
getConnection=()=>{ 
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: "#kernal32",
        database: 'books_app'
    });
};

let connection = getConnection();

/************************** CREATE DATABASE  *********************************/
connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    connection.query("CREATE DATABASE IF NOT EXISTS books_app", function (err, result) {
        if (err) throw err;
        console.log("Created "+result.insertId);
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

/************************** ALTER TABLE **************************************/
app.get('/books/addAttr',(req,res)=>{
    res.render('books/addAttr');
});

app.post('/books/addAttr', (req, res) => {
    let column = req.body.column;
    let dataType = req.body.dataType;
    let constraint = req.body.constraint;
    let defaultVal = req.body.defaultVal;

    
    let queryString = `ALTER TABLE books ADD ${column} ${dataType};`;
    // The values in the brackets are inserted into the query string (?,?)
    connection.query(queryString, [], (err, results, fields) => {
        if (err) {
            console.log('Failed to alter books table '+ err);
            res.sendStatus(500);
            return
        }
        console.log('Updated books table ' + results);
        res.redirect('/books');
    });
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
            return { title: row.title, author: row.author, image: row.Image }
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

app.get('/books/:title&:author',(req,res)=>{
    // Get the show page for the book
    let title = req.params.title;
    let author = req.params.author;
    

    const queryString = "SELECT * FROM books WHERE title LIKE ? AND author LIKE ?";
    
    let queryVariables = [title,author];

    // Query the Database
    connection.query(queryString, queryVariables, (err, rows, fields) => {
        if (err) {
            console.log('failed to query book' + err)
            res.sendStatus(500);
            // throw err (can do this istead)
            res.end()
            return
        }
        // Rename the values from SQL for JSON   
        // console.log(rows);
        let book = rows.map(book=>{
            if(book.title === title){
                
                return book;
            }
        });
        let image = book[0].Image;
        
        res.render('books/show', {author,title, image});
        
    })
    

});

/*************************** INSERT ******************************************/
app.get('/books/create',(req,res)=>res.render('books/create'));

app.post('/books', (req,res)=>{
    let title = req.body.title;
    let author = req.body.author;
    let image     = req.body.image;
    console.log(req.body);

    let queryString = 'INSERT INTO books (title, author,image) VALUES (?,?,?)';
    connection.query(queryString, [title,author,image],(err,results,fields)=>{
        if (err) {
            console.log('Failed to input new book.');
            res.sendStatus(500);
            return
        }
        console.log('Inserted a new book ' + results.insertId);
        res.redirect('/books');
    })
});

/**************************** UPDATE ****************************************/

// LOAD EDIT PAGE FOR UPDATE ROUTE
app.get('/books/:title&:author/update', (req, res) => {
    let title = req.params.title;
    let author = req.params.author;

    const queryString = "SELECT * FROM books WHERE author LIKE ? AND title LIKE ?";
    connection.query(queryString, [author,title], (err, rows, fields) => {
        if (err) {
            console.log('failed to query user' + err)
            res.sendStatus(500);
            // throw err (can do this istead)
            res.end()
            return
        }
        let book = rows.map(book => {
            if (book.title === title) {
                return book;
            }
        });
        
        // rows returns [{user}] so need to take it out of the array
        res.render('books/update', { book:rows[0] });
    });
});

// UPDATE ROUTE
app.put('/books/:title&:author', (req, res) => {

    let title = req.params.title;
    let author = req.params.author;
    let image = req.body.image;

  
    let queryString = 'UPDATE books SET author= ?, title= ? , Image= ? WHERE author LIKE ? AND title LIKE ?';
    // The values in the brackets are inserted into the query string (?,?)

    connection.query(queryString, [author, title, image,author,title], (err, results, fields) => {
        if (err) {
            console.log('Failed to update book');
            res.sendStatus(500);
            return
        }
        console.log('Updated a book ' + results);
        res.redirect(`/books/${title}&${author}`);
    })
});


app.listen(process.env.PORT,()=>{
    console.log(`Server is running and listening on ${process.env.PORT}...`);
});