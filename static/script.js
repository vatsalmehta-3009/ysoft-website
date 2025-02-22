$(document).ready(function() {
    $("#register-form").submit(function(event) {
        event.preventDefault();

        $.ajax({
            url: "/register",
            type: "POST",
            data: $(this).serialize(),
            success: function(response) {
                window.location.href = "/login";
            },
            error: function() {
                alert("Registration failed. Try again.");
            }
        });
    });
});
