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
    $( '#list' ).on('click', '.checkedBtn', toggleComplete);
}

// ⬇ This function adds a task to the database
function addTask(){
    // ⬇ If the user forgets to enter a note, it will prompt an little error
    if($('#note').val() === ''){
        return;
    }
    // ⬇ Grabbing the user's input
    let task = {
        task: $('#note').val(),
        priorityStatus: $('.dropdown-item.selected').data("value")
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

// ⬇ This function will delete a task from the database
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
    }).then( result => {
        if (result.value) {
            // User confirmed that they wanted to delete the item
                $.ajax({
                method: 'DELETE',
                url: `todo/${taskId}`
            }).then( response => {
                // Confirms to the user that it was deleted
                swal.fire(
                    'Deleted!',
                    'Your item has been deleted.',
                    'success'
                )
                // ⬇ Will refresh the DOM with the updated database containing the new information
                refreshTasks();
                }).catch( err => {
                    alert(`There was a problem deleting your task. Please try again later.`)
                });
        } // Nothing happens if the user decides not to delete
    })
} // end deleteTask

// ⬇ This function will edit the complete status
function toggleComplete(){
    // ⬇ This grabs the data-id of the task we would like to edit
    let taskId = $(this).closest('tr').data('id');
    // ⬇ This grabs the data-isComplete of the task we would like to edit
    let status = $(this).closest('tr').data('isComplete')
    $.ajax({
        method: 'PUT',
        url: `todo/${taskId}`,
        data: status
    }).then( response => {
        // ⬇ Will refresh the DOM with the updated database containing the new information
        refreshTasks();
    }).catch( err => {
        console.log(`Error Editing Tasks. Please try again later.`);
    });
}


// ⬇ This will sort through the priority and return what the user selected
function getPriorityList(toSearch) {
    $.ajax({
        type: 'GET',
        url: `/todo/${toSearch}`
    }).then( response => {
        renderTasks(response);
        // ⬇ This will automatically close the dropdown menu when you click an item
        $(this).closest(".dropdown-menu").prev().dropdown("toggle");
    }).catch( err => {
        console.log('Error getting selected tasks. Please try again later.')
    })
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

// ⬇ This will modify everything on the DOM
function renderTasks(toDo){
    // ⬇ This will empty the table of tasks
    $('#list').empty();
    // ⬇ These three variables will grab the status of if the task has been complete and what class to assign
    let setClass, setClassTwo, taskStatus, isItChecked='';
    for (let task of toDo){
        if(task.isComplete === true){
            taskStatus = `You did the thing!`
            setClass = 'complete';
            setClassTwo = 'strikethrough'
            task.priority = '';
            isItChecked = checked="checked";
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
                <td class="align-middle"><input class="form-check-input checkedBtn" type="checkbox" value="" id="checkedBtn${task.id}"></input></td>
            <td class="align-middle">
                <button id="deleteBtn" class="btn btn-outline-danger">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-archive-fill" viewBox="0 0 16 16">
                        <path d="M12.643 15C13.979 15 15 13.845 15 12.5V5H1v7.5C1 13.845 2.021 15 3.357 15h9.286zM5.5 7h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1zM.8 1a.8.8 0 0 0-.8.8V3a.8.8 0 0 0 .8.8h14.4A.8.8 0 0 0 16 3V1.8a.8.8 0 0 0-.8-.8H.8z"/>
                    </svg>
                </button></td>
        </tr>
        `);
        // ⬇ After we append the list, the computer will search for the id where the isComplete task 
        if(task.isComplete === true){
            $(`#checkedBtn${task.id}`).prop('checked', true)
        }
    }
}

function dropDown(){
        // ⬇ These two lines will diferenciate the clicked item from the others, so we can grab it later.
        $(this).siblings().removeClass("selected");
        $(this).addClass("selected");
        // ⬇ This will automatically close the dropdown menu when you click an item
        $(this).closest(".dropdown-menu").prev().dropdown("toggle");
}
