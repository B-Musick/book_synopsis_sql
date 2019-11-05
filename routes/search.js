let express = require('express');
    router = express.Router()
    mysql = require('mysql')
    connection = require('./dbconnection')
    middleware = require('../middleware')
    session = require('express-session')
    dotenv = require('dotenv');

// Set up the .env file to access through process.env.VALUE
dotenv.config();

errMessage = (string, err) => {
    console.log(string + err);
    res.sendStatus(500);
    res.end();
    return
}

/******************************** SEARCH **************************************/

/******* SEARCH BAR FORM *******/
router.get('/', (req, res) => res.render('search',{books:false}));

router.post('/',(req,res)=>{
    let query = req.body.query;

    
    connection.query('SELECT * FROM books WHERE title LIKE ? OR author LIKE ?', [query, query], (err, rows, fields) => {
        if (err) errMessage('failed to query', err);

        // Rename the values from SQL for JSON
        let books = rows.map(row => { return { title: row.title, author: row.author, image: row.Image } });

        res.render('search', { books: books.length > 0 ? books : false });
    });
    

})

module.exports = router;
