const mongoose = require('mongoose');
const taskSchema = require('./task-schema');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userName: { type: String, required: true },
    password: { type: String, required: true },
    taskList: [taskSchema]
});

module.exports = userSchema;
//module.exports = mongoose.model("User", userSchema);