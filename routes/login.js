let express = require('express')
    router = express.Router()
    mysql = require('mysql')
    connection = require('./dbconnection')
    session = require('express-session');

/*************************** CREATE TABLE ************************************/

connection.query(`CREATE TABLE IF NOT EXISTS login
    (
        id int(11) NOT NULL ,
        username VARCHAR(50) NOT NULL ,
        password varchar(255) NOT NULL,
        email varchar(100) NOT NULL
    );`,
    (err, result) => {
        if (err) throw err;
        console.log('Created login table');
});



/************************** ALTER TABLE **************************************/

//     // The values in the brackets are inserted into the query string (?,?)
// connection.query("INSERT INTO `login` (`id`, `username`, `password`, `email`) VALUES (2, 'brendanmusick', 'brendanmusick', 'test@test.com');", (err, results) => {
//         if(err) throw err;
//         console.log('Altered superuser')
//     });
router.get('/login',(req,res)=>{
    res.render('login')
})
router.post('/authorize', (req,res)=>{
    var username = req.body.username;
    let password = req.body.password;

    if(username && password){
        connection.query('SELECT * FROM login WHERE username = ? AND password = ?', [username,password], (err, results, fields)=>{
            if(results.length > 0){
                req.session.loggedin = true;
                req.session.username = username;
                console.log('User logged in')
                res.redirect('/');
            }else{
                res.send('Incorrect username or password.');
            }
            res.end()
        })
    }else{
        res.send('Please enter username and password.');
        res.end();
    }
});

module.exports = router;
