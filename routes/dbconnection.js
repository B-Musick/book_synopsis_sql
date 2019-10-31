let mysql = require('mysql');

/*************************** DATABASE CONNECTION ******************************/
getConnection = () => {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: "#kernal32",
        database: 'books_app'
    });
};

let connection = getConnection();


module.exports = connection;