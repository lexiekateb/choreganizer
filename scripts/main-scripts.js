$(function() {
    // Retrieve list of tasks upon page reload
    $.ajax({
        url: 'main',
        contentType: 'application/json',
        success: function(response) {
            console.log(response);
            let taskGrid = $('#taskGrid');
            // Array of tasks that are close to being due for alert
            let riskyTasks = [];
            var riskyTasksAlert = "";

            // Clear all tasks
            taskGrid.html('');

            // Iterate through each task
            response.forEach(function(task) {
                var taskColor;
                if (task.timeRemaining > 7) {
                    // Set color of task background to green
                    taskColor = "background:#457373";
                }
                else if (task.timeRemaining > 3) {
                    // Set color of task background to light green
                    taskColor = "background:#a2c0c0";
                }
                else if (task.timeRemaining > 0) {
                    // Set color of task background to light red
                    taskColor = "background:#D5B9B1";
                    // Add task to array
                    riskyTasks.push({ taskName: task.task, 
                    timeRemaining: task.timeRemaining });
                }
                else {
                    // Set color of task background to red
                    taskColor = "background:#b5887b"
                    // Add task to array
                    riskyTasks.push({ taskName: task.task, 
                    timeRemaining: task.timeRemaining });
                }

                // Append the task to the grid
                // Due date should be split by 'T' to remove time section
                taskGrid.append('\
                <div class="task" id="' + task._id + '" style="' + taskColor + '">\
                    <div class="taskHeader">' + task.task + '</div><br>\
                    Due Date: ' + task.dueDate.split('T')[0] + '<br>\
                    Time Remaining: ' + task.timeRemaining + '<br>\
                    Difficulty: ' + task.difficulty + '<br>\
                    Tags: ' + task.tags +
                    '<button class="deleteTaskButton" type="button" onclick="deleteTask(this)">X</button>\
                </div>');
            });

            // Display alert for tasks that are close to due date
            if (riskyTasks.length > 0) {
                // Append task name and time remaining to string
                riskyTasks.forEach(task => {
                    riskyTasksAlert += task['taskName'] + ": " +
                    task['timeRemaining'] + " days remaining\n";
                })
                // Display alert
                alert("WARNING: TASKS MUST BE COMPLETED SOON\n" + riskyTasksAlert);
            }
        }
    });

    //Create a new task
    $('#createTaskForm').on('submit', function(event) {
        event.preventDefault();

        let taskName = $('#taskName').val().trim();
        let difficulty = $('#taskDifficulty').val();
        //Parsed date is number of milliseconds since Jan 1, 1970
        let dueDate = Date.parse($('#taskDueDate').val())
        //Make array for tags
        let tags = [];
        //Iterate through list of tags and add to array
        $('#tags').find("input").each(function() {
            tags.push($(this).val());
        })

        $.ajax({
            url: '/taskcreate',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                taskName: taskName,
                difficulty: difficulty,
                dueDate: dueDate,
                tags: tags
            }),
            success: function(response) {
                console.log(response)
                if (response["result"] === "Task created") {
                    //Clear fields
                    $('#taskName').val("");
                    $('#taskDifficulty').val("");
                    $('#taskDueDate').val("");
                    $('#tags').html('');

                    alert(response["result"]);

                    //Close the form
                    $('#taskPopupForm').css("display", "none");

                    //Prepare to add new task to grid
                    let taskGrid = $('#taskGrid');
                    var newTask = response["newTask"];
                    var taskColor;

                    if (newTask.timeRemaining > 7) {
                        // Set color of task background to green
                        taskColor = "background:#457373";
                    }
                    else if (newTask.timeRemaining > 3) {
                        // Set color of task background to light green
                        taskColor = "background:#a2c0c0";
                    }
                    else if (newTask.timeRemaining > 0) {
                        // Set color of task background to light red
                        taskColor = "background:#D5B9B1";
                    }
                    else {
                        // Set color of task background to red
                        taskColor = "background:#b5887b"
                    }
    
                    // Append the task to the grid
                    // Due date should be split by 'T' to remove time section
                    taskGrid.append('\
                    <div class="task" id="' + newTask._id + '" style="' + taskColor + '">\
                        <div class="taskHeader">' + newTask.task + '</div><br>\
                        Due Date: ' + newTask.dueDate.split('T')[0] + '<br>\
                        Time Remaining: ' + newTask.timeRemaining + '<br>\
                        Difficulty: ' + newTask.difficulty + '<br>\
                        Tags: ' + newTask.tags +
                        '<button class="deleteTaskButton" type="button" onclick="deleteTask(this)">X</button>\
                    </div>');
                }
                else {
                    alert(response);
                }
            },
            error: function(err, errText, errThrown) {
                console.log(err.status);
                console.log(errText);
                console.log(errThrown);
            }
        });
    });

    // Delete a task
    // Listen for click from button descendents of taskGrid
    $('#taskGrid').on('click', 'button', function() {
        // Store parent of button to delete it later
        let taskItem = this.parentNode;
        // Get ID of the task to delete
        let taskID = taskItem.id;

        $.ajax({
            url: '/deletetask',
            method: 'DELETE',
            contentType: 'application/json',
            data: JSON.stringify({ taskID: taskID }),
            success: function(response) {
                if (response === "Successfully deleted") {
                    // Delete task from HTML if successful
                    taskItem.remove();
                }
            }
        });
    });

    // Sort a task
    $('#sortform').on('submit', function(event) {
        event.preventDefault();

        let sortType = $('#sortTypes').val();

        $.ajax({
            url: '/tasks/sort',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ sortType: sortType }),
            success: function(response) {
                let taskGrid = $('#taskGrid');
                
                // Clear all tasks
                taskGrid.html('');

                // Display all desired tasks
                taskDisplay(response, taskGrid);
            }
        })
    });

    $('#searchform').on('submit', function(event) {
        event.preventDefault();

        let searchInput = $('#searchInput');
        let searchTerm = searchInput.val().trim();

        $.ajax({
            url: '/tasks/search',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ searchTerm: searchTerm }),
            success: function(response) {
                let taskGrid = $('#taskGrid');
                
                // Clear all tasks
                taskGrid.html('');

                // Display all desired tasks
                taskDisplay(response, taskGrid);
            }
        })
    })
});

// Used for displaying tasks upon sort and search
function taskDisplay(response, taskGrid) {
    // Iterate through each task
    response.forEach(function(task) {
        var taskColor;
        if (task.timeRemaining > 7) {
            // Set color of task background to green
            taskColor = "background:#457373";
        }
        else if (task.timeRemaining > 3) {
            // Set color of task background to light green
            taskColor = "background:#a2c0c0";
        }
        else if (task.timeRemaining > 0) {
            // Set color of task background to light red
            taskColor = "background:#D5B9B1";
        }
        else {
            // Set color of task background to red
            taskColor = "background:#b5887b"
        }

        // Append the task to the grid
        // Due date should be split by 'T' to remove time section
        taskGrid.append('\
        <div class="task" id="' + task._id + '" style="' + taskColor + '">\
            <div class="taskHeader">' + task.task + '</div><br>\
            Due Date: ' + task.dueDate.split('T')[0] + '<br>\
            Time Remaining: ' + task.timeRemaining + '<br>\
            Difficulty: ' + task.difficulty + '<br>\
            Tags: ' + task.tags +
            '<button class="deleteTaskButton" type="button" onclick="deleteTask(this)">X</button>\
        </div>');
    });
}