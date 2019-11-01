var middlewareObj = {};
session = require('express-session');

middlewareObj.isLoggedIn =
    (req, res, next) => {
        if (req.session.isLoggedIn) {
            return next();
        }
        res.redirect('/login');
    }

middlewareObj.isSuperUser =
    (req,res,next)=>{
        // Used on the update book route so only I can update the books
        if (req.session.username === 'brendanmusick'){
            return next();
        }
        
        res.redirect('/login');
    }
module.exports = middlewareObj