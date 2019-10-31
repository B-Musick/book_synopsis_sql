let express = require('express');
    router = express.Router()
    mysql = require('mysql')
    connection = require('./dbconnection');

/*************************** CREATE TABLE ************************************/

connection.query(`CREATE TABLE IF NOT EXISTS synopsis
    (
        book_title VARCHAR(255) DEFAULT 'title' NOT NULL ,
        book_author VARCHAR(255) DEFAULT 'author' NOT NULL,
        synopsis_author VARCHAR(255) DEFAULT 'syn_author' NOT NULL,
        synopsis_text TEXT NOT NULL,
        submit_date DATE NOT NULL
    
    );`,
    (err, result) => {
        if (err) throw err;
        console.log('Created synopsis table');
    });





// /************************** ALTER TABLE **************************************/
// router.get('/addAttr', (req, res) => {
//     res.render('books/addAttr');
// });

// router.post('/addAttr', (req, res) => {
//     let column = req.body.column;
//     let dataType = req.body.dataType;
//     let constraint = req.body.constraint;
//     let defaultVal = req.body.defaultVal;


//     let queryString = `ALTER TABLE books ADD ${column} ${dataType};`;
//     // The values in the brackets are inserted into the query string (?,?)
//     connection.query(queryString, [], (err, results, fields) => {
//         if (err) {
//             console.log('Failed to alter books table ' + err);
//             res.sendStatus(500);
//             return
//         }
//         console.log('Updated books table ' + results);
//         res.redirect('/books');
//     });
// });
/*************************** SELECT ******************************************/
router.get('/',(req,res)=>{
    let queryString = 'SELECT DISTINCT book_author,book_title FROM synopsis';

    connection.query(queryString, (err, rows, fields)=>{
        if(err){
            console.log('failed to query synopsis' + err)
            res.sendStatus(500);
            // throw err (can do this istead)
            res.end();
            return
        }
        
        let books = rows;
        res.render('synopsis/index', {books});
    })
});

router.get('/:title&:author',(req,res)=>{
    let title = req.params.title;
    let author = req.params.author;

    let queryString = 'SELECT * FROM synopsis WHERE book_author LIKE ? AND book_title LIKE ?';

    connection.query(queryString,[author, title], (err, rows, fields)=>{
        if(err){
            console.log('failed to query synopsis' + err)
            res.sendStatus(500);
            // throw err (can do this istead)
            res.end();
            return
        }

        console.log(rows[0].synopsis_author)
        let synopsis = rows.map(syn=>{
            if(syn.book_title===title && syn.book_author===author){
                return syn;
            }
        });

        res.render('synopsis/show', {synopsis});
    });
});
/*************************** INSERT ******************************************/
router.get('/create', (req, res) => res.render('synopsis/create'));

router.post('/', (req, res) => {
    let title = req.body.book_title;
    let author = req.body.book_author
    let synopsis_author = req.body.synopsis_author;
    let synopsis_text = req.body.synopsis_text;
    

  

    let queryString = 'INSERT INTO synopsis (book_title,book_author, synopsis_author, synopsis_text, submit_date) VALUES (?,?,?,?,CURRENT_TIMESTAMP)';
    connection.query(queryString, [title, author, synopsis_author, synopsis_text], (err, results, fields) => {
        if (err) {
            console.log('Failed to input new synopsis.'+err);
            res.sendStatus(500);
            return
        }
        console.log('Inserted a new synopsis ' + results.insertId);
        res.redirect('/synopsis');
    })
});

module.exports = router;