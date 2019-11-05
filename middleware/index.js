var middlewareObj = {}
    express       = require('express')
    session       = require('express-session');

/* Check that the user is logged in to:
    * Create a new synopsis => /synopsis/create */
middlewareObj.isLoggedIn = (req, res, next) => {
        if (req.session.loggedin) return next();
        res.redirect('/login');
} //isLoggedIn

/* UPDATE BOOKS so only I can update the books */
middlewareObj.isSuperUser = (req,res,next)=>{      
        if (req.session.username === 'brendanmusick') return next();
        // Otherwise redirect them to home
        res.redirect('/');
}//isSuperUser

module.exports = middlewareObj;