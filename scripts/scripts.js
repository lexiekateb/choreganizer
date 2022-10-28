$(function() {
    //Login and redirect to main page
    $('#login').on('submit', function(event) {
        // Prevents page refresh upon clicking button because of 'submit'
        event.preventDefault();

        // Get username and password from input fields
        let userName = $('#user').val().trim();
        let password = $('#pwd').val().trim();

        $.ajax({
            url: 'login',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ userName: userName, 
            password: password }),
            success: function(response) {
                if (response === "Logging in") {
                    window.location.pathname = "main.html";
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
        })
    });

    //Redirect to signup page
    $('#newuser').on('submit', function(event) {
        event.preventDefault();

        $.ajax({
            url: 'new-user',
            method: 'POST',
            success: function(response) {
                //Redirect to signup page
                window.location.pathname = "signup.html";
            }
        })
    });

    //Create a new user and redirect to login
    $('#signup').on('submit', function(event) {
        event.preventDefault();

        //Get username and password from fields
        let userName = $('#user').val().trim();
        let password = $('#pwd').val().trim();

        $.ajax({
            url: 'signup',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ userName: userName,
            password: password}),
            success: function(response) {
                alert(response);
                if (response !== "Username is already in use") {
                    //Redirect to login if successful
                    window.location.pathname = "/";
                }
            }
        });
    });

    //Create a new task
    $('#createTaskForm').on('submit', function(event) {
        event.preventDefault();

        let taskName = $('#taskName').val().trim();
        let difficulty = $('#taskDifficulty').val();
        //Parsed date is number of milliseconds since Jan 1, 1970
        let dueDate = Date.parse($('#taskDueDate').val())


        $.ajax({
            url: '/taskcreate',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                taskName: taskName,
                difficulty: difficulty,
                dueDate: dueDate
            }),
            success: function(response) {
                if (response === "Task created") {
                    //Clear fields
                    $('#taskName').val("");
                    $('#taskDifficulty').val("");
                    $('#taskDueDate').val("");

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