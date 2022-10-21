$(function() {
    //Login
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
                alert(response);
            },
            error: function(err, errText, errThrown) {
                console.log(err.status);
                console.log(errText);
                console.log(errThrown);
            }
        })
    });

    $('#newuser').on('submit', function(event) {
        event.preventDefault();

        $.ajax({
            url: 'new-user',
            method: 'POST',
            success: function(response) {
                window.location.pathname = "signup.html";
            }
        })
    });

    $('#signup').on('submit', function(event) {
        event.preventDefault();

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
                    window.location.pathname = "/";
                }
            }
        });
    })
});