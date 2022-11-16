$(function() {
    // Retrieve list of tasks upon page reload
    $.ajax({
        url: 'main',
        contentType: 'application/json',
        success: function(response) {
            //Placeholder, use this list to add tasks to front end
            console.log(response);
        }
    });

    //Create a new task
    $('#createTaskForm').on('submit', function(event) {
        event.preventDefault();

        let taskName = $('#taskName').val().trim();
        let difficulty = $('#taskDifficulty').val();
        let tags = $('#tags').val();
        //Parsed date is number of milliseconds since Jan 1, 1970
        let dueDate = Date.parse($('#taskDueDate').val())


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
                if (response === "Task created") {
                    //Clear fields
                    $('#taskName').val("");
                    $('#taskDifficulty').val("");
                    $('#taskDueDate').val("");
                    $('#tags').val("");

                    alert(response);
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
});