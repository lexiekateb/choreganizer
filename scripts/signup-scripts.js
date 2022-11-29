$(function() {
    //Create a new user and redirect to login
    $('#signup').on('submit', function(event) {
        event.preventDefault();

        //Get username and password from fields
        let userName = $('#user').val().trim();
        let password = $('#pwd').val().trim();
        let reenterPass = $('#repwd').val().trim();

        $.ajax({
            url: 'signup',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ userName: userName,
            password: password,
            reenterPass: reenterPass }),
            success: function(response) {
                alert(response);
                if (response !== "Username is already in use" &&
                response !== "Passwords do not match") {
                    //Redirect to login if successful
                    window.location.pathname = "/";
                }
            }
        });
    });
});