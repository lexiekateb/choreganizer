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
app.use(express.static(__dirname));
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
app.get('/login', function(req, res) {
    let userName = req.body.userName;
    let pass = req.body.password;

    //Check for valid inputs
    if (userName.length === 0 || pass.length === 0) {
        console.log("Please enter all fields");
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
            }
            else {
                console.log("User not found");
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

});

//Sign up
app.post('/signup', function(req, res) {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let userName = req.body.userName;
    let pass = req.body.password;
    let reenterPass = req.body.reenterPass;

    //Check for valid fields
    if (firstName.length === 0 || lastName.length === 0
        || userName.length === 0 || pass.length === 0
        || reenterPass.length === 0){
            console.log("Please enter info for all fields");
        }
    else {
        //Check if password has been reentered correctly
        if (pass === reenterPass) {
            //Username must be unique, cannot already by in use
            User.findOne({ userName: userName })
            .then(user => {
                //Query is nonempty if username already exists
                if (user != null){
                    console.log("Username is already in use");
                }
                else {
                    //Create and store new user
                    let newUser = new User({
                        firstName: firstName,
                        lastName: lastName,
                        userName: userName,
                        password: pass
                    });

                    newUser.save()
                    .then(newUser => {
                        console.log("New user created");
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
            console.log("Passwords do not match");
        }
    }
});

//Upload profile image
app.post('/signup/profile-image', function(req, res) {

});

//Add task
app.post('/tasks', function(req, res) {
    let taskName = req.body.task;
    let dueDate = req.body.dueDate;
    let timeRemaining = null;
    let difficulty = req.body.difficulty;
    let tags = req.body.tags;

    //Checks for valid date before calculating remaining time
    if (dueDate !== null) {
        timeRemaining = calcDaysRemaining(Date.now(), duedate);
    }
    else {
        console.log("Please enter a due date");
    }

    //Assumes you can make a task on the day it is due
    //Prevents creation of a task at least a day after it is due
    if (taskName.length === 0 || dueDate === null || difficulty === null
        || tags.length === 0) {
            console.log("Please enter info for all fields");
        }
    else if ((dueDate.getTime() - Date.now()) < (1000 * 60 * 60 * 24)) {
        console.log("Invalid due date");
    }
    else {
        //Create and store new task
        let newTask = new Task({
            userName: currentUser,
            task: taskName,
            dueDate: dueDate,
            timeRemaining: timeRemaining,
            difficulty: difficulty,
            tags: tags
        });

        newTask.save()
        .then(newTask => {
            console.log("Task created");
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
    let rawRemainingTime = dueDate.getTime() - currentDate.getTime();

    //Returns number of full days remaining
    //1000 is number of milliseconds in a second
    //60 seconds in a minute
    //60 minutes in an hour
    //24 hours in a day
    return Math.floor(rawRemainingTime / (1000 * 60 * 60 * 24));
}