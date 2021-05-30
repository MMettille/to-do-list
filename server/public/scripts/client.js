$(document).ready(readyNow);

function readyNow(){
    // ⬇ Establish click listeners
    clickListeners();
    // ⬇ Load existing tasks on page load:
    refreshTasks();
    // ⬇
} // end readyNow function

function clickListeners(){
    console.log('in clickListeners function');
    // ⬇ Click listener for the drop down stuff
    $( '.dropdown-toggle' ).dropdown();
    // ⬇ Will let us know which drop down has been selected and separate it from the others
    $( '.dropdown-item' ).on('click', dropDown);
    // ⬇ click listener for the add button
    $( '#addBtn' ).on('click', addTask);
    // ⬇ click listener for the delete button
    $( '#list' ).on('click', '#deleteBtn', deleteTask);
    // ⬇ click listener for the complete button
    $( '#list' ).on('click', '#markAsCompleteBtn', toggleComplete);
}

function addTask(){
    // ⬇ Grabbing the data of which selection the user made
    let status = $('.dropdown-item.selected').data("value");
    // ⬇ If the user forgets to enter a note, it will prompt an little error
    if($('#note').val() === ''){
        return;
    }
    // ⬇ Grabbing the user's input
    let task = {
        task: $('#note').val(),
        priorityStatus: status
    }
    // ⬇ Sending the input to the server
    $.ajax({
        method: 'POST',
        url: '/todo',
        data: task
    }).then( response => {
        // ⬇ Emptying the user input fields
        $('input').val('');
        // ⬇ Will refresh the DOM with the updated database containing the new information
        refreshTasks()
    }).catch( err => {
        alert(`There was a problem adding your task. Please try again later.`);
    });
}

function deleteTask(){
    // ⬇ This grabs the data-id of the task we would like to delete
    let taskId = $(this).closest('tr').data('id');
    // ⬇ Use Sweet Alerts to ask user to confirm that they'd like to delete the task
    swal.fire({
        title: "Are you sure?",
        text: "This will permanently delete this task. There is no undoing this action.",
        icon: "warning",
        dangerMode: true,
        showCancelButton: true,
        confirmButtonColor: '#ff8080',
        confirmButtonText: 'Yes, delete it!',
    }).then
    // // ⬇ This send the thing to be deleted to the server
    // $.ajax({
    //     method: 'DELETE',
    //     url: `todo/${taskId}`
    // }).then( response => {
    //     // ⬇ Will refresh the DOM with the updated database containing the new information
    //     refreshTasks();
    // }).catch( err => {
    //     alert(`There was a problem deleting your task. Please try again later.`)
    // })
}

// ⬇ This function will grab the information from the database
function toggleComplete(){
    // ⬇ This grabs the data-id of the task we would like to edit
    let taskId = $(this).closest('tr').data('id');
    // ⬇ This grabs the data-isComplete of the task we would like to edit
    let status = $(this).closest('tr').data('isComplete')
    // ⬇ This sets up the data we would like to send to the server
    let data = {};
    if(status === true){
        data = {status}
    } else {
        data = {status};
    }
    $.ajax({
        method: 'PUT',
        url: `todo/${taskId}`,
        data: data
    }).then( response => {
        // ⬇ Will refresh the DOM with the updated database containing the new information
        refreshTasks();
    }).catch( err => {
        console.log(`Error Editing Tasks. Please try again later.`);
    });
}
    // ⬇ This function will grab the information from the database
function refreshTasks(){
    // ⬇ This is the get request to the server
    $.ajax({
        type: 'GET',
        url: '/todo'
    }).then( response => {
        // ⬇ This will call a function that will loop through the database and update the DOM
        renderTasks(response);
    }).catch( err => {
        console.log('Error Refreshing Tasks. Please try again later.');
    });
}

// ⬇ This will sort through the priority and return what the user selected
function getPriorityList(toSearch) {
    $.ajax({
        type: 'GET',
        url: `/todo/${toSearch}`
    }).then( response => {
        renderTasks(response);
    }).catch( err => {
        console.log('Error getting selected tasks. Please try again later.')
    })
}   

// ⬇ This will modify everything on the DOM
function renderTasks(toDo){
    // ⬇ This will empty the table of tasks
    $('#list').empty();
    // ⬇ These three variables will grab the status of if the task has been complete and what class to assign
    let setClass, setClassTwo, taskStatus ='';
    for (let task of toDo){
        if(task.isComplete === true){
            taskStatus = `You did the thing!`
            setClass = 'complete';
            setClassTwo = 'strikethrough'
            task.priority = '';
        } else {
            taskStatus = `Let's do the thing!`
        }
        if(task.priority === null){
            task.priority = '';
        }
        // ⬇ Set the data-id and data-isComplete here, to grab later in the put and delete request.
        $('#list').append(`
        <tr data-id=${task.id} data-isComplete=${task.isComplete} class='${setClass}'>
            <td class='${setClassTwo} align-middle'>${task.taskName}</td>
            <td class="align-middle">${task.priority}</td>
            <td class="align-middle">${taskStatus}</td>
            <td class="align-middle"><button id="markAsCompleteBtn" class="btn btn-secondary">Mark As Complete</button></td>
            <td class="align-middle">
                <button id="deleteBtn" class="btn btn-outline-danger">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-archive-fill" viewBox="0 0 16 16">
                        <path d="M12.643 15C13.979 15 15 13.845 15 12.5V5H1v7.5C1 13.845 2.021 15 3.357 15h9.286zM5.5 7h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1zM.8 1a.8.8 0 0 0-.8.8V3a.8.8 0 0 0 .8.8h14.4A.8.8 0 0 0 16 3V1.8a.8.8 0 0 0-.8-.8H.8z"/>
                    </svg>
                </button></td>
        </tr>
        `);
    }
}

function dropDown(){
        $(this).siblings().removeClass("selected") //remove from others
        $(this).addClass("selected") //add selected to the one which clicked
}