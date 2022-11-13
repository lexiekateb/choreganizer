const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new mongoose.Schema({
    //Username of the user that the task belongs to
    userName: { type: String, required: true },
    //Name of the task
    task: { type: String, required: true },
    dueDate: Date,
    //Time remaining is measured in days
    timeRemaining: Number,
    difficulty: Number,
    tags: [String]
});

module.exports = mongoose.model("Task", taskSchema);