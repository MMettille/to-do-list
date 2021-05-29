$(document).ready(readyNow);

function readyNow(){
    console.log('jQuery is working, it is safe to manipulate the DOM');
    // ⬇ Establish click listeners
    clickListeners();
    // ⬇ Load existing tasks on page load:
    refreshTasks();
} // end readyNow function

function clickListeners(){
    console.log('in clickListeners function');
    // ⬇ click listener for the addBtn
    $( '#addBtn' ).on('click', addTask);
    $( '#list' ).on('click', '#deleteBtn', deleteTask);
    $( '#list' ).on('click', '#markAsCompleteBtn', toggleComplete);
    // ⬇ Click listener dropdown
    $('.dropdown-toggle').dropdown();
    // $('.dropdown-item').dropdown('update');
}

function addTask(){
    console.log('in addTask function');
    // ⬇ Grabbing the user's input
    let priority = {
        this: $('#priorityStatus option:selected').text()
    }
    
    let task = {
        task: $('#note').val(),
        priorityStatus: $('#priorityStatus option:selected').text()
    };
    // ⬇ Testing that I can get the task on client side - I can!
    console.log(task);
    // ⬇ Sending the input to the server
    $.ajax({
        method: 'POST',
        url: '/todo',
        data: task
    }).then( response => {
        console.log(`Your task has been added`, response);
        // ⬇ Emptying the user input fields
        $('input').val('');
        // ⬇ Will refresh the DOM with the updated database containing the new information
        refreshTasks()
    }).catch( err => {
        alert(`There was a problem adding your task. Please try again later.`);
    });
}

function deleteTask(){
    console.log('in deleteTask function');
    // ⬇ This grabs the data-id of the task we would like to delete
    let taskId = $(this).closest('tr').data('id');
    // ⬇ This send the thing to be deleted to the server
    $.ajax({
        method: 'DELETE',
        url: `todo/${taskId}`
    }).then( response => {
        console.log(`Deleted!`);
        // ⬇ Will refresh the DOM with the updated database containing the new information
        refreshTasks();
    }).catch( err => {
        alert(`There was a problem deleting your task. Please try again later.`)
    })
}

// ⬇ This function will grab the information from the database
function toggleComplete(){
    console.log('in toggleComplete function');
    // ⬇ This grabs the data-id of the task we would like to edit
    let taskId = $(this).closest('tr').data('id');
    // ⬇ This grabs the data-isComplete of the task we would like to edit
    let status = $(this).closest('tr').data('isComplete')
    // ⬇ This sets up the data we would like to send to the server
    let data = {};
    if(status === true){
        data = {status}
        $(this).closest('tr').addClass('complete')
    } else {
        data = {status};
        $(this).closest('tr').removeClass();
    }
    $.ajax({
        method: 'PUT',
        url: `todo/${taskId}`,
        data: data
    }).then( response => {
        console.log(`Toggled`);
        // ⬇ Will refresh the DOM with the updated database containing the new information
        refreshTasks();
    }).catch( err => {
        console.log(`Error Editing Tasks. Please try again later.`);
    });
}
    // ⬇ This function will grab the information from the database
function refreshTasks(){
    console.log('in getTasks function');
    // ⬇ This is the get request to the server
    $.ajax({
        type: 'GET',
        url: '/todo'
    }).then( response => {
        console.log(response);
        // ⬇ This will call a function that will loop through the database and update the DOM
        renderTasks(response);
    }).catch( err => {
        console.log('Error Refreshing Tasks. Please try again later.');
    });
}

// ⬇ This will modify everything on the DOM
function renderTasks(toDo){
    console.log('in renderTasks function');
    // ⬇ This will empty the table of tasks
    $('#list').empty();
    // ⬇ These two variables will grab the status of if the task has been complete and what class to assign
    let taskStatus = '';
    let setClass ='';
    for (let task of toDo){
        if(task.isComplete === true){
            taskStatus = `You did the thing!`
            setClass = 'complete';
        } else {
            taskStatus = `Let's do the thing!`
            setClass = 'notYetComplete'
        }
        // ⬇ Set the data-id and data-isComplete here, to grab later in the put and delete request.
        $('#list').append(`
        <tr data-id=${task.id} data-isComplete=${task.isComplete} class='${setClass}'>
            <td>${task.taskName}</td>
            <td>${taskStatus}</td>
            <td><button id="markAsCompleteBtn">Mark As Complete</button></td>
            <td><button id="deleteBtn">DELETE</button></td>
        </tr>
        `);
    }
}
