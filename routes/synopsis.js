let express = require('express');
    router = express.Router()
    mysql = require('mysql')
    connection = require('./dbconnection')
    session = require('express-session')
    middleware = require('../middleware')
    dotenv = require('dotenv');

// Set up the .env file to access through process.env.VALUE
dotenv.config();

errMessage = (string, err) => {
    console.log(string + err);
    res.sendStatus(500);
    res.end();
    return
}

/*************************** CREATE TABLE ************************************/

// connection.query(process.env.CREATE_SYNOPSIS_TABLE,
//     (err, result) => {if (err) throw err; console.log('Created synopsis table');});

/************************** ALTER TABLE **************************************/

/*
// The values in the brackets are inserted into the query string (?,?)
    connection.query(process.env.ALTER_SYNOPSIS_TABLE, [], (err, results, fields) => {
        if (err) errMessage('Failed to alter books table ', err)
        console.log('Updated books table ' + results);
        res.redirect('/books');
    });
});
*/

/*************************** SELECT ******************************************
******************************************************************************/

router.get('/',(req,res)=>{ connection.query(process.env.SELECT_SYN_BOOK, (err, rows, fields)=>{
        // Query the database by the book_author and book_title. Pass the synopsis for this specific author
        if (err) errMessage('failed to query synopsis', err); res.render('synopsis/index', {books:rows});})
});

router.get('/:title&:author',(req,res)=>{
    let title = req.params.title, author = req.params.author;

    connection.query(process.env.SELECT_JOIN_BOOKS_SYNOPSIS,[title, author], (err, rows, fields)=>{
        if (err) errMessage('failed to query synopsis', err);

        let synopsis = rows.map(syn=>{
            if(syn.book_title===title && syn.book_author===author){
                return syn;
            }
        });

        res.render('synopsis/show', {synopsis});
    });
});

/*************************** INSERT ******************************************
******************************************************************************/

/********* CREATE SYNOPSIS *********/
router.get('/create', (req, res) => res.render('synopsis/create'));

// /**** CREATE IF AUTHOR UNKNOWN *****/
// router.post('/', (req, res) => {
//     let title = req.body.book_title, author = req.body.book_author, 
//                 synopsis_author = req.body.synopsis_author, synopsis_text = req.body.synopsis_text;

//     connection.query(process.env.INSERT_SYNOPSIS, [title, author, synopsis_author, synopsis_text], (err, results, fields) => {
//         if (err) errMessage('Failed to input new synopsis.',err)
//         console.log('Inserted a new synopsis ' + results.insertId);
//         res.redirect('/synopsis');
//     });
// });

router.get('/:title&:author/create', middleware.isLoggedIn, (req, res) => 
    res.render('synopsis/create',{title:req.params.title,author:req.params.author, synopsis_author:req.session.username
}));

/**** CREATE IF AUTHOR KNOWN ****
 * Access from /books route
 * Will automatically fill author and title
*/
router.post('/:title&:author', (req, res) => {
    let title = req.params.title, author = req.params.author,
                synopsis_author = req.body.synopsis_author, synopsis_text = req.body.synopsis_text;

    connection.query(process.env.INSERT_SYNOPSIS, [title, author, synopsis_author, synopsis_text], (err, results, fields) => {
        if (err) errMessage('Failed to input new synopsis.',err)
        console.log('Inserted a new synopsis ' + results.insertId + results.id);
        res.redirect(`/synopsis/${title}&${author}`);
    })
});

module.exports = router;