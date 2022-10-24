var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.listen(PORT)

var fs = require('fs');
const { userInfo, type } = require('os');

var taskInfo = []; //global variable for task info

function openForm() {
    document.getElementById("taskPopupForm").style.display = "block";
}

function closeForm() {
    document.getElementById("taskPopupForm").style.display = "none";
}

app.post('/taskcreate', function(req, res) {

    //create a task
    var name = req.body.taskName;
    var taskDifficulty = req.body.difficulty;
    var taskDate = req.body.dueDate;

    taskInfo.push({
        taskName: name,
        difficulty: taskDifficulty,
        dueDate: taskDate
    });

    res.send('created task');

});
