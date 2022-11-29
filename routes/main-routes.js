let express = require('express');
let router = express.Router();
let Task = require('../schemas/task-schema');

//Activate upon main page reload
router.get('/main', function(req, res) {
    //Find all tasks under current user
    Task.find({ userName: req.app.locals.currentUser })
    .then(tasks => {
        //Update time remaining for all tasks
        tasks.forEach(function(task) {
            //Calculate new remaining time per task
            var newTime = calcDaysRemaining(new Date().setUTCHours(0, 0, 0, 0),
            task.dueDate);

            //Update days remaining
            Task.updateOne({ _id: task._id },
                { $set: { timeRemaining: newTime } })
                .then(result => {
                })
                .catch(err => {
                    console.log(err);
                })
        })

        //Find and send all updated tasks
        Task.find({ userName: req.app.locals.currentUser })
        .then(updatedTasks => {
            res.send(updatedTasks);
        })
        .catch(err => {
            console.log(err);
        })
    })
    .catch(err => {
        console.log(err);
    })
});

//Add task
router.post('/taskcreate', function(req, res) {
    let taskName = req.body.taskName;
    //Convert date milliseconds to object
    let dueDate = new Date(req.body.dueDate);
    let timeRemaining = null;
    let difficulty = req.body.difficulty;
    let tags = req.body.tags;

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
    //Prevents creation of a task after the day it is due
    if (taskName.length === 0 || dueDate === null || difficulty === null) {
            res.send("Please enter info for all fields");
        }
    else if (timeRemaining < 0) {
        console.log(timeRemaining);
        res.send("Invalid due date");
    }
    else {
        //Create and store new task
        let newTask = new Task({
            userName: req.app.locals.currentUser,
            task: taskName,
            dueDate: dueDate,
            timeRemaining: timeRemaining,
            difficulty: difficulty,
            tags: tags
        });

        newTask.save()
        .then(newTask => {
            // Send new task to display
            res.send({ result: "Task created", newTask: newTask});
        })
        .catch(err => {
            console.log(err);
        });
    }

    
});

//Delete tasks
router.delete('/deletetask', function(req, res) {
    let taskID = req.body.taskID;

    //Delete task using the passed ID
    Task.deleteOne({ _id: taskID })
    .then(result => {
        res.send("Successfully deleted");
    })
    .catch(err => {
        console.log(err);
    });
});

//Search for tasks
router.get('/tasks/search', function(req, res) {
    let searchTerm = req.body.searchTerm;

    //Check to see if search term has been entered
    if (searchTerm.length > 0) {
        Task.find({ $and: [
            //Find tasks under current user
            { userName: req.app.locals.currentUser },
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
});

//Sort tasks
router.put('/tasks/sort', function(req, res) {

});

//Calculates remaining time for a task
function calcDaysRemaining(currentDate, dueDate) {
    //Difference between dates in milliseconds
    //currentDate is a number, not a Date object
    let rawRemainingTime = dueDate.setUTCHours(0, 0, 0, 0) - currentDate;

    //Returns number of full days remaining
    //1000 is number of milliseconds in a second
    //60 seconds in a minute
    //60 minutes in an hour
    //24 hours in a day
    //Round is used due to discrepancies from DST
    return Math.round(rawRemainingTime / (1000 * 60 * 60 * 24));
}

module.exports = router;