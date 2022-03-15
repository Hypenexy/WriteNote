function PushError(error){
    pushNotification("Error occured!", error, "warn")
    $.ajax({
        url: server + "/app/errorlog.php",
        type: "post",
        data: error,
        success: function (response) {},
        error: function() {
            //?do i keep? pushNotification("Could not report error to server.", "Server is unreachable!", "warn")
        }
    })
}