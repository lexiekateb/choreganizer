let express = require('express');
let router = express.Router();
let User = require('../schemas/user-schema');

//Sign up
router.post('/signup', function(req, res) {
    let userName = req.body.userName;
    let pass = req.body.password;
    let reenterPass = req.body.reenterPass;

    //Check for valid fields
    if (userName.length === 0 || pass.length === 0
        || reenterPass.length === 0){
            res.send("Please enter info for all fields");
        }
    else {
        //Check if password has been reentered correctly
        if (pass === reenterPass) {
            //Username must be unique, cannot already by in use
            User.findOne({ userName: userName })
            .then(user => {
                //Query is nonempty if username already exists
                if (user != null){
                    res.send("Username is already in use");
                }
                else {
                    //Create and store new user
                    let newUser = new User({
                        firstName: 'testFirst',
                        lastName: 'testLast',
                        userName: userName,
                        password: pass
                    });

                    newUser.save()
                    .then(newUser => {
                        //Redirect back to login page
                        res.send("New user created");
                        res.end();
                    })
                    .catch(err => {
                        console.log(err);
                    });
                }
            })
            .catch(err => {
                console.log(err);
            });
        }
        else {
            res.send("Passwords do not match");
        }
    }
});

module.exports = router;