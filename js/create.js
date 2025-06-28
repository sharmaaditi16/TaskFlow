
var api_url = "http://127.0.0.1:5000/tasks"
$("#submitForm").click(function(){
    var title_usr = ""
    var description_usr = ""
    var due_date_usr = ""
    var status_usr = ""
    title_usr = $("#staticTitle").val()
    description_usr = $("#inputDescription").val()
    due_date_usr = $("#inputDueDate").val()
    status_usr = $('#inputStatus option:selected').text();
    let taskData = {
        title: title_usr,
        description: description_usr,
        due_date: due_date_usr,
        status: status_usr,
    };

    $.ajax({
        url: api_url,
        headers: {
            "token": localStorage.getItem("user_token")
        },
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(taskData),
        success: function(response) {
            $("#staticTitle").val("")
            $("#inputDescription").val("")
            $("#inputDueDate").val("")
            $("#alertSuccess").removeClass("d-none")
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $("#alertFailure").removeClass("d-none")
        },
    })
})
