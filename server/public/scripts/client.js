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
}

// ⬇ This function will grab the information from the database
function refreshTasks(){
    console.log('in getTasks function');
    //TODO ⬇ get request
    $.ajax({
        type: 'GET',
        url: '/todo'
    }).then( response => {
        console.log(response);
        // ⬇ This will call a function that will loop through the database and update the DOM
        renderTasks();
    })
}

