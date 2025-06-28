var api_url = "http://127.0.0.1:5000/tasks"
var get_api_url = "http://127.0.0.1:5000/tasks/"

$(document).ready(function(){
    token = localStorage.getItem("user_token");
    if (token === null || token === undefined || token === "") {
        alert("You are not logged in. Please log in to access this page.");
        window.location.href = "login.html";
        return;
    }

    var urlParams = new URLSearchParams(window.location.search);
    if(urlParams.has('task')==true){
        id = urlParams.get('task')
        $.ajax({
            url: get_api_url+id,
            headers: {
                "token": localStorage.getItem("user_token")
            },
            method: 'GET',
            success: function(response) {
                console.log(response)
                $("#staticTitle").val(response["task"]["title"])
                $("#inputDescription").val(response["task"]["description"])
                $("#idFieldHidden").val(response["task"]["id"])
                $('#inputStatus').val(response["task"]["status"]);
                
                const today = new Date(response["task"]["due_date"]);
                const year = today.getFullYear();
                const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
                const day = today.getDate().toString().padStart(2, '0');
                const formattedDate = `${year}-${month}-${day}`;
                const dateInput = document.getElementById('inputDueDate');
                dateInput.value = formattedDate;
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $("#alertFailure").html("Failed to fetch task. Please reload.")
                $("#alertFailure").removeClass("d-none")
            },
        })
    }
})

$("#updateForm").click(function(){
    var title_usr = ""
    var description_usr = ""
    var due_date_usr = ""
    var status_usr = ""
    title_usr = $("#staticTitle").val()
    description_usr = $("#inputDescription").val()
    due_date_usr = $("#inputDueDate").val()
    status_usr = $('#inputStatus option:selected').text();
    let taskData = {
        id : $("#idFieldHidden").val(),
        title: title_usr,
        description: description_usr,
        due_date: due_date_usr,
        status: status_usr
    };
    $.ajax({
        url: api_url,
        method: 'PUT',
        headers: {
            "token": localStorage.getItem("user_token")
        },
        contentType: 'application/json',
        data: JSON.stringify(taskData),
        success: function(response) {
            $("#alertSuccess").removeClass("d-none")
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $("#alertFailure").html("Failed to update task. Please reload.")
            $("#alertFailure").removeClass("d-none")
        },
    })
})
