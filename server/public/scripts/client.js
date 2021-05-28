$(document).ready(readyNow);

function readyNow(){
    console.log('jQuery is working, it is safe to manipulate the DOM');
    // ⬇ Establish click listeners
    clickListeners();
    // ⬇ Load existing tasks on page load:
    getTasks();
} // end readyNow function

function clickListeners(){
    console.log('in clickListeners function');
    // ⬇ click listener for the addBtn
    $( '#addBtn' ).on('click', addTask);
}

function addTask(){
    console.log('in addTask function')
}

function getTasks(){
    console.log('in getTasks function');
    //TODO ⬇ get request
}