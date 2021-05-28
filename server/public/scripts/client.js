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
}

function addTask(){
    console.log('in addTask function')
    // ⬇ Grabbing the user's input
    let task = {
        task: $('#note').val()
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
        alert(`There was a problem adding your task. Please try again later`);
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
        console.log('Error Refreshing Tasks. Please try again later');
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
        <tr data=id=${task.id} data-isComplete=${task.isComplete} class='${setClass}'>
            <td>${task.taskName}</td>
            <td>${taskStatus}</td>
            <td><button id="markAsComplete">Mark As Complete</button></td>
            <td><button id="deleteBtn">DELETE</button></td>
        </tr>
        `);
    }
}
