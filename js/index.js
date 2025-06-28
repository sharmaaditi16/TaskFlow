$(document).ready(function () {
    token = localStorage.getItem("user_token");
    // alert(token)
    if (token === null || token === undefined || token === "") {
        // alert("You are not logged in. Please log in to access this page.");
        console.log("You are not logged in. Please log in to access this page.");
        window.location = "login.html";
        // return;
    }
    $.ajax({
        url: "http://127.0.0.1:5000/tasks",
        method: "GET",
        headers: {
            "token": localStorage.getItem("user_token"),
        },
        contentType: "application/json",
        success: function (response) {
            var table = $(".display tbody");
            let tasks = response.tasks;
            table.empty();
            for (let i = 0; i < tasks.length; i++) {
                let task = tasks[i];
                table.append("<tr><td>" + task.id + "</td>" +
                    "<td>" + task.title + "</td>" +
                    "<td>" + task.description + "</td>" +
                    "<td>" + task.due_date + "</td>" +
                    "<td>" + (task.created_at || "-") + "</td>" +
                    "<td><a href='edit-task.html?task=" + task.id + "' target='_blank' class='btn btn-secondary'><i class='fas fa-pencil-alt me-1'></i></a> " +
                    "<a class='btn btn-danger delete-btn' custom-id='task" + task.id + "'><i class='fa-solid fa-trash'></i></a>");
                $("body").append("<input type='hidden' value='" + task.id + "' id='task" + task.id + "'>");
            }
            $(".display").DataTable();

            $(".delete-btn").click(function () {
                var taskId = $(this).attr('custom-id');
                var actualTaskId = $('#' + taskId).val();
                var apiUrl = "http://127.0.0.1:5000/tasks/" + actualTaskId;

                $.ajax({
                    url: apiUrl,
                    method: 'DELETE',
                    headers: {
                        "token": localStorage.getItem("user_token"),
                    },
                    contentType: 'application/json',
                    success: (response) => {
                        console.log(response.message);
                        $(this).removeAttr("custom-id");
                        $(this).closest("tr").fadeOut();
                    }
                });
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // alert("Failed to fetch tasks. Please reload.");
            $("#alertFailure").html("Failed to fetch tasks. Please reload.");
            $("#alertFailure").removeClass("d-none");
        }
    })
});


