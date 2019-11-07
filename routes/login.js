let express = require('express')
    router = express.Router()
    mysql = require('mysql')
    connection = require('./dbconnection')
    session = require('express-session')
    dotenv = require('dotenv');

// Set up the .env file to access through process.env.VALUE
dotenv.config();

/*************************** CREATE TABLE ************************************
******************************************************************************/

connection.query(process.env.CREATE_TABLE_USERS, (err, result) => { if (err) throw err; console.log('Created login table');});

/************************** ALTER TABLE **************************************/

/********* 
// The values in the brackets are inserted into the query string (?,?)
// connection.query(process.env.INSERT_USER, (err, results) => {if(err) throw err; console.log('Altered superuser')}); 
*********/


/************* REGISTER GET ROUTE **************/
router.get('/register', (req, res) => { res.render('register') });

/*********** REGISTER POST (INSERT) ROUTE ************/

router.post('/register', (req, res) => {
    let username = req.body.username, password = req.body.password, email = req.body.email;
 
        connection.query(process.env.INSERT_USERNAME_PASSWORD, [username, password, email], (err, results, fields) => {
            if(err) errMessage('User could not be created: '+err)
            else{
                console.log(results+' user was created');
                res.redirect('/books')
            }
 
})});

/************* LOGIN ROUTE **************/
router.get('/login',(req,res)=>{ res.render('login')});

/*********** AUTHORIZE ROUTE ************/

router.post('/authorize', (req,res)=>{
    let username = req.body.username, password = req.body.password;

    if(username && password){
        connection.query(process.env.SELECT_USERNAME_PASSWORD, [username,password], (err, results, fields)=>{
            if(results.length > 0){
                console.log(results)
                req.session.loggedin = true;
                req.session.username = username;
                console.log('User logged in');
                res.redirect('/');
            }else{
                res.send('Incorrect username or password.'); 
                res.end();
            }
        });
    }else{
        res.send('Please enter username and password.'); 
        res.end();
    }
});

module.exports = router;
