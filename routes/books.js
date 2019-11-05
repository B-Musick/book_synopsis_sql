let express = require('express');
    router  = express.Router()
    mysql = require('mysql')
    connection = require('./dbconnection')
    middleware = require('../middleware')
    session = require('express-session')
    dotenv    = require('dotenv');

// Set up the .env file to access through process.env.VALUE
dotenv.config();

/*************************** CREATE TABLE ************************************
******************************************************************************/

// connection.query(process.env.CREATE_TABLE_BOOK, (err, result) => {if (err) throw err;});

/************************** ALTER TABLE **************************************
******************************************************************************/

/*****************  
// The values in the brackets are inserted into the query string (?,?)
connection.query(process.env.ALTER_TABLE_BOOKS, (err, results) => {if(err) throw err; console.log('Altered book');
});
*****************/

/*************************** SELECT ******************************************
******************************************************************************/
errMessage=(string, err)=>{
    console.log(string + err);
    res.sendStatus(500);
    res.end();
    return
}
makeSelectQuery = (queryString, queryVariables, res, connection, route) => {

    // Query the Database
    connection.query(queryString, queryVariables, (err, rows, fields) => {
        if (err) errMessage('failed to query users',err);
        // Rename the values from SQL for JSON
        let books = rows.map(row => {return { title: row.title, author: row.author, image: row.Image }});

        res.render(route, { books });  
    })
}; // makeSelectQuery()

/************ ROOT BOOK ROUTE **************/
router.get('/', (req, res) => { makeSelectQuery(process.env.SELECT_BOOKS, [], res, connection, 'books/index');});

/********** GET INDIVIDUAL BOOK ************/
router.get('/:title&:author', (req, res) => {
    /* Join in the values from synopsis table so we can print previews of them in the Books show page then the 
    user can access them from there */

    // Get the show page for the book
    let title = req.params.title, author = req.params.author, queryVariables = [title, author];

    // Query the Database
    connection.query(process.env.SELECT_JOIN_BOOKS_SYNOPSIS, queryVariables, (err, rows, fields) => {
        if (err) errMessage('Failed to query book', err);
        // Rename the values from SQL for JSON, contains multiple instances of the same book with each synopsis
        let book = rows.map(book => {if (book.title === title) return book;});

        // Need to access book[0] to get the title, author, image
        // Then to access synopsis, need to book.forEach and take the synopsis values
        res.render('books/show', { book });
    })
});

/*************************** INSERT ******************************************
******************************************************************************/

/************* CREATE BOOK ***********/
router.get('/create',  middleware.isSuperUser, (req, res) => res.render('books/create'));

/************** POST BOOK ************/
router.post('/', (req, res) => {
    // Get the information submitted by the user from the form, only I can 
    let title = req.body.title, author = req.body.author, image = req.body.image, username = req.session.username;

    connection.query(process.env.INSERT_BOOKS, [title, author, image,username], (err, results, fields) => {
        if (err) errMessage('Failed to input new book.',err);
        console.log('Inserted a new book ' + results.insertId);
        res.redirect('/books');
    })
});

/**************************** UPDATE ****************************************
******************************************************************************/

/******** LOAD EDIT PAGE FOR UPDATE ROUTE ******/
router.get('/:title&:author/update', middleware.isSuperUser, (req, res) => {
    let title = req.params.title, author = req.params.author;

    connection.query(process.env.SELECT_AUTHOR_TITLE, [author, title], (err, rows, fields) => {
        if (err) errMessage('Failed to query book', err)
        let book = rows.map(book => {if (book.title === title) book;});
        console.log(book[0].author);

        // rows returns [{user}] so need to take it out of the array
        res.render('books/update', { book: book[0] });
    });
});

/****** UPDATE ROUTE ******/
router.put('/:title&:author', (req, res) => {
    let title = req.params.title, author = req.params.author, image = req.body.image;

    // The values in the brackets are inserted into the query string (?,?)
    connection.query(process.env.UPDATE_BOOKS, [author, title, image, author, title], (err, results, fields) => {
        if (err) errMessage('Failed to update book',err)
        console.log('Updated a book ' + results);
        res.redirect(`/books/${title}&${author}`);
    })
});

/**************************** DELETE ****************************************
******************************************************************************/

/******** DELETE ROUTE *******/
router.delete('/:title&:author', middleware.isSuperUser, (req, res) => {
    let title = req.params.title, author = req.params.author;

    // The values in the brackets are inserted into the query string (?,?)
    getConnection().query(process.env.DELETE_BOOKS, [author, title], (err, results, fields) => {
        if (err) errMessage('Failed to delete book',err);
        console.log('Deleted a book ' + results);
        res.redirect('/books');
    });
});

module.exports = router;