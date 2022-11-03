let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let User = require('./schemas/user-schema');
let Task = require('./schemas/task-schema');
let fs = require('fs');
const internal = require('stream');
const { Console } = require('console');

let app = express();
//3000 is express server
let PORT = process.env.PORT || 3000;
//URI to access MongoDB cloud database
const dbURI = "mongodb+srv://generaluser:WISc0SeWINaYf2wi@cluster0.pmhb6ux.mongodb.net/choreganizer-db?retryWrites=true&w=majority";

//Path to access static files
app.use(express.static(__dirname, { index: 'login.html' }));
//Used to parse frontend requests
app.use(bodyParser.json());

//Variable to store current user
let currentUser = null;

//Connect to MongoDB database
mongoose
    .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Server is running on Port: " + PORT);
    })
    .catch((err) => {
        console.log(err);
    });

// User.collection.drop();
// Task.collection.drop();

// let testTask1 = new Task({
//     userName: "testUser",
//     task: "This is Task 1",
//     dueDate: new Date(),
//     timeRemaining: 10,
//     difficulty: 1,
//     tags: ['tag1', 'tag2']
// });

// let testTask2 = new Task({
//     userName: "testUser",
//     task: "This is Task 2",
//     dueDate: new Date(),
//     timeRemaining: 5,
//     difficulty: 2,
//     tags: ['tag3', 'tag4']
// });

// let testUser = new User({
//     firstName: 'John',
//     lastName: 'Doe',
//     userName: 'testUser',
//     password: 'testPassword',
// });

// testTask1.save()
//     .then(testTask1 => {
//         console.log(testTask1);
//     })
//     .catch(err => {
//         console.log(err);
//     });

// testTask2.save()
//     .then(testTask2 => {
//         console.log(testTask2);
//     })
//     .catch(err => {
//         console.log(err);
//     });

// testUser.save()
//     .then(testUser => {
//         console.log(testUser);
//     })
//     .catch(err => {
//         console.log(err);
//     });

// User.find({ $or: [
//     //Find where task name or tags contain search term as a substring
//     {"taskList.task": { $regex: ".*tag.*" }},
//     {"taskList.tags": { $regex: ".*tag.*" }}
// ]})
// .then(user => {
//     console.log(user);
// })
// .catch(err => {
//     console.log(err);
// })

//Input login
app.post('/login', function(req, res) {
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
                currentUser = userName;
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
app.post('/new-user', function(req, res) {
    //Redirect to signup page
    res.send("Redirecting to signup");
    res.end();
})

//Sign up
app.post('/signup', function(req, res) {
    // let firstName = req.body.firstName;
    // let lastName = req.body.lastName;
    let userName = req.body.userName;
    let pass = req.body.password;
    // let reenterPass = req.body.reenterPass;

    //Check for valid fields
    if (/*firstName.length === 0 || lastName.length === 0
        || */userName.length === 0 || pass.length === 0
        /*|| reenterPass.length === 0*/){
            res.send("Please enter info for all fields");
        }
    else {
        //Check if password has been reentered correctly
        if (/*pass === reenterPass*/ true) {
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

//Upload profile image
app.post('/signup/profile-image', function(req, res) {

});

//Activate upon main page reload
app.get('/main', function(req, res) {
    //Find all tasks under current user, send them
    Task.find({ username: currentUser })
    .then(tasks => {
        res.send(tasks);
    })
    .catch(err => {
        console.log(err);
    })
});

//Add task
app.post('/taskcreate', function(req, res) {
    let taskName = req.body.taskName;
    //Convert date milliseconds to object
    let dueDate = new Date(req.body.dueDate);
    let timeRemaining = null;
    let difficulty = req.body.difficulty;
    //let tags = req.body.tags;

    //Checks for valid date before calculating remaining time
    if (dueDate !== null) {
        //currentDate will be considered the start of the current date
        timeRemaining = calcDaysRemaining(new Date().setUTCHours(0, 0, 0, 0),
        dueDate);
    }
    else {
        res.send("Please enter a due date");
    }

    //Assumes you can make a task on the day it is due
    //Prevents creation of a task at least a day after it is due
    if (taskName.length === 0 || dueDate === null || difficulty === null
        /*|| tags.length === 0*/) {
            res.send("Please enter info for all fields");
        }
    else if ((dueDate.getTime() - Date.now()) < (1000 * 60 * 60 * 24)) {
        res.send("Invalid due date");
    }
    else {
        //Create and store new task
        let newTask = new Task({
            userName: currentUser,
            task: taskName,
            dueDate: dueDate,
            timeRemaining: timeRemaining,
            difficulty: difficulty,
            tags: ["testTag"]
        });

        newTask.save()
        .then(newTask => {
            res.send("Task created");
        })
        .catch(err => {
            console.log(err);
        });
    }

    
});

//Search for tasks
app.get('/tasks/search', function(req, res) {
    let searchTerm = req.body.searchTerm;

    //Check to see if search term has been entered
    if (searchTerm.length > 0) {
        Task.find({ $and: [
            //Find tasks under current user
            { userName: currentUser },
            { $or: [
                 //Find where task name or tags contain search as a substring
                {task: { $regex: ".*" + searchTerm + ".*" }},
                {tags: { $regex: ".*" + searchTerm + ".*" }}
            ] }
        ] })
        .then(tasks => {
            res.send(tasks);
        })
        .catch(err => {
            console.log(err);
        });
    }
    else {
        console.log("Please enter a search term");
    }
})

//Sort tasks
app.put('/tasks/sort', function(req, res) {

});

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});

//Calculates remaining time for a task
function calcDaysRemaining(currentDate, dueDate) {
    //Difference between dates in milliseconds
    //currentDate is a number, not a Date object
    let rawRemainingTime = dueDate.getTime() - currentDate;

    //Returns number of full days remaining
    //1000 is number of milliseconds in a second
    //60 seconds in a minute
    //60 minutes in an hour
    //24 hours in a day
    return Math.floor(rawRemainingTime / (1000 * 60 * 60 * 24));
}