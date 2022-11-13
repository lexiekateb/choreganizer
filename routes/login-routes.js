let express = require('express');
let router = express.Router();
let User = require('../schemas/user-schema');

//Input login
router.post('/login', function(req, res) {
    let userName = req.body.userName;
    let pass = req.body.password;
    
    //Check for valid inputs
    if (userName.length === 0 || pass.length === 0) {
        res.send("Please enter username and password");
    }
    else {
        //Search for matching login credentials
        User.findOne({ $and: [
            { userName: userName },
            { password: pass }
        ] })
        .then(user => {
            //Log in if user is found
            if (user != null) {
                //Store username, will use for all task queries
                req.app.locals.currentUser = userName;
                //Redirect to main page
                res.send("Logging in");
                res.end();
            }
            else {
                res.send("User not found");
            }
        })
        .catch(err => {
            console.log(err);
        });
    }
});

// Make a new user account
router.post('/new-user', function(req, res) {
    //Redirect to signup page
    res.send("Redirecting to signup");
    res.end();
})

module.exports = router;