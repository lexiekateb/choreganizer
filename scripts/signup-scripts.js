$(function() {
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
});