const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new mongoose.Schema({
    task: { type: String, required: true },
    timeLeft: Date,
    difficulty: Number,
    tags: [String]
});

module.exports = taskSchema;
//module.exports = mongoose.model("Task", taskSchema);