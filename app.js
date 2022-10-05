let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let userSchema = require('./schemas/user-schema');
let taskSchema = require('./schemas/task-schema');

let app = express();
//3000 is express server
let PORT = process.env.PORT || 3000;
//URI to access MongoDB cloud database
const dbURI = "mongodb+srv://etruong1014:dc2WfCHoZKUIWpdy@cluster0.pmhb6ux.mongodb.net/choreganizer-db?retryWrites=true&w=majority";


const User = mongoose.model('User', userSchema);
const Task = mongoose.model('Task', taskSchema);

//Path to access static files
app.use(express.static(__dirname));
app.use(bodyParser.json());

let fs = require('fs');
const internal = require('stream');

//Connect to MongoDB database
mongoose
    .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Server is running on Port: " + PORT);
    })
    .catch((err) => {
        console.log(err);
    });

// let testTask1 = new Task({
//     task: "This is Task 1",
//     timeLeft: new Date(),
//     difficulty: 1,
//     tags: ['tag1', 'tag2']
// });

// let testTask2 = new Task({
//     task: "This is Task 2",
//     timeLeft: new Date(),
//     difficulty: 2,
//     tags: ['tag3', 'tag4']
// });

// let testUser = new User({
//     firstName: 'John',
//     lastName: 'Doe',
//     userName: 'testUser',
//     password: 'testPassword',
//     taskList: [testTask1, testTask2]
// })

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

//Input login
app.get('/login', function(req, res) {
    let userName = req.body.userName;
    let pass = req.body.password;

    //Search for matching login credentials
    User.findOne({ $and: [
        { userName: userName },
        { password: pass }
    ] })
    .then( user => {

    })
    .catch(err => {

    });

});

//Sign up
app.post('/signup', function(req, res) {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let pass = req.body.password;
    let reenterPass = req.body.reenterPass;

    if (pass === reenterPass) {
        
    }
    else {

    }
});

//Upload profile image
app.post('/signup/profile-image', function(req, res) {

});

//Add task
app.post('/tasks', function(req, res) {

});

//Search for task
app.get('/tasks/search', function(req, res) {

})

//Sort tasks
app.put('/tasks/sort', function(req, res) {

});

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});

// const bookSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     author: String
// });

// const Book = mongoose.model("Book", bookSchema);

// const book = new Book({
//     name: 'TestName2',
//     author: 'TestAuthor2'
// });

// book.save()
//     .then(book => {
//         console.log(book);
//     })
//     .catch(err => {
//         console.log(err);
//     });

