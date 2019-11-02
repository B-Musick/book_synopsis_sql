var middlewareObj = {};
let express = require('express')
    session = require('express-session');

/* Check that the user is logged in to:
    * Create a new synopsis => /synopsis/create */
middlewareObj.isLoggedIn =
    (req, res, next) => {
        console.log(req.session.username)
        if (req.session.loggedin) {
            return next();
        }
        
        res.redirect('/login');
    }

middlewareObj.isSuperUser =
    (req,res,next)=>{
        // Used on the update book route so only I can update the books
        if (req.session.username === 'brendanmusick'){
            console.log('hi')
            return next();
        }
        
        res.redirect('/login');
    }

module.exports = middlewareObj;