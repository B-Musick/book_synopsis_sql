let express = require('express');
    router  = express.Router()
    mysql = require('mysql')
    connection = require('./dbconnection')
    middleware = require('../middleware')
    session = require('express-session')
    ;

/*************************** CREATE TABLE ************************************/

connection.query(`CREATE TABLE IF NOT EXISTS books
    (
        title VARCHAR(255) DEFAULT 'title' NOT NULL ,
        author VARCHAR(255) DEFAULT 'author' NOT NULL 
        
        
    );`,
    (err, result) => {
        if (err) throw err;
        console.log('Created book table');
    });

/************************** ALTER TABLE **************************************/
router.get('/addAttr', (req, res) => {
    res.render('books/addAttr');
});

//     // The values in the brackets are inserted into the query string (?,?)
// connection.query("ALTER TABLE `books` ADD `username` varchar(100) NOT NULL;", (err, results) => {
//         if(err) throw err;
//         console.log('Altered book')
//     });
router.post('/addAttr', (req, res) => {
    let column = req.body.column;
    let dataType = req.body.dataType;
    let constraint = req.body.constraint;
    let defaultVal = req.body.defaultVal;


    let queryString = `ALTER TABLE books ADD ${column} ${dataType};`;
    // The values in the brackets are inserted into the query string (?,?)
    connection.query(queryString, [], (err, results, fields) => {
        if (err) {
            console.log('Failed to alter books table ' + err);
            res.sendStatus(500);
            return
        }
        console.log('Updated books table ' + results);
        res.redirect('/books');
    });
});

/*************************** SELECT ******************************************/
makeSelectQuery = (queryString, queryVariables, res, connection, route,req) => {

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

        // if(req.session.loggedin){
        //     console.log('logged in');
            res.render(route, { books });
        // }else{
        //     res.send('Log in')
        // }
        
    })
}; // makeSelectQuery()

router.get('/', (req, res) => {

    // SELECT all books
    const queryString = "SELECT * FROM books";
    let renderType = 'render';
    let queryVariables = [];
    let route = 'books/index';
    makeSelectQuery(queryString, queryVariables, res, connection, route,req);

});

router.get('/:title&:author', (req, res) => {
    // Get the show page for the book
    let title = req.params.title;
    let author = req.params.author;

    // Join in the values from synopsis table so we can print previews of them in the Books show page then the 
    // user can access them from there
    const queryString = "SELECT * FROM books LEFT JOIN synopsis ON books.title LIKE synopsis.book_title WHERE title LIKE ? AND author LIKE ?";

    let queryVariables = [title, author];

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
        let book = rows.map(book => {
            // Contains multiple instances of the same book with each synopsis
            
            if (book.title === title) {
                return book;
            }
        });

        console.log(book);
        
        // Need to access book[0] to get the title, author, image
        // Then to access synopsis, need to book.forEach and take the synopsis values
        res.render('books/show', { book });

    })


});

/*************************** INSERT ******************************************/
router.get('/create',  middleware.isLoggedIn, (req, res) => res.render('books/create'));

router.post('/', (req, res) => {
    // Get the information submitted by the user from the form
    let title = req.body.title;
    let author = req.body.author;
    let image = req.body.image;
    // Take current session username and set it as
    
    let username = 'brendanmusick';
    
    let queryString = 'INSERT INTO books (title, author,image, username) VALUES (?,?,?,?)';
    connection.query(queryString, [title, author, image,username], (err, results, fields) => {
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
router.get('/:title&:author/update', middleware.isSuperUser, (req, res) => {
    let title = req.params.title;
    let author = req.params.author;

    const queryString = "SELECT * FROM books WHERE author LIKE ? AND title LIKE ?";
    connection.query(queryString, [author, title], (err, rows, fields) => {
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
        console.log(book[0].author);

        // rows returns [{user}] so need to take it out of the array
        res.render('books/update', { book: book[0] });
    });
});

// UPDATE ROUTE
router.put('/:title&:author', (req, res) => {

    let title = req.params.title;
    let author = req.params.author;
    let image = req.body.image;


    let queryString = 'UPDATE books SET author= ?, title= ? , Image= ? WHERE author LIKE ? AND title LIKE ?';
    // The values in the brackets are inserted into the query string (?,?)

    connection.query(queryString, [author, title, image, author, title], (err, results, fields) => {
        if (err) {
            console.log('Failed to update book');
            res.sendStatus(500);
            return
        }
        console.log('Updated a book ' + results);
        res.redirect(`/books/${title}&${author}`);
    })
});

/**************************** DELETE ****************************************/

// DELETE ROUTE
router.delete('/:title&:author', middleware.isSuperUser, (req, res) => {

    let title = req.params.title;
    let author = req.params.author;

    let queryString = 'DELETE FROM books WHERE author LIKE ? AND title LIKE ?';
    // The values in the brackets are inserted into the query string (?,?)
    getConnection().query(queryString, [author, title], (err, results, fields) => {
        if (err) {
            console.log('Failed to delete book');
            res.sendStatus(500);
            return
        }
        console.log('Deleted a book ' + results);
        res.redirect('/books');
    })
});

// // route middleware to make sure
// function isLoggedIn(req, res, next) {

//     // if user is authenticated in the session, carry on
//     if (req.session.loggedin) return next();

//     // if they aren't redirect them to the home page
//     res.redirect('/');
// }

module.exports = router;