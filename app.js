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

// Define route variables
let login = require('./routes/login-routes.js');
let signup = require('./routes/signup-routes.js');
let main = require('./routes/main-routes.js');

//Path to access static files
app.use(express.static(__dirname, { index: 'login.html' }));
//Used to parse frontend requests
app.use(bodyParser.json());
// Use routes for the given pages
app.use('/', login);
app.use('/', signup);
app.use('/', main);

//Global variable to store current user, can be used by route files
app.locals.currentUser = null;

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

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});