const express = require('express');
const router = express.Router();
const pool = require('../modules/pool.js')

//* GET REQUEST
router.get('/', (req, res) => {
    let queryText = 'SELECT * FROM "toDo" ORDER BY "id";';
    pool.query(queryText).then( result => {
        // ⬇ Sends back the results in an object
        res.send(result.rows);
    }).catch( error => {
        console.log( 'Error getting tasks from database', error );
        res.sendStatus(500);
    });
});

//* POST REQUEST
router.post('/', (req, res) => {
    // ⬇ Testing that I can get the task on server side - I can!
    console.log('req.body is ...', req.body);
    // ⬇ Telling the database WHAT we would like to do
    let queryText = `INSERT INTO "toDo" ("taskName", "priority") VALUES ($1, $2);`;
    // ⬇ Insert sanitized user input into the database
    let values = [req.body.task, req.body.priorityStatus];
    // ⬇ Inserting the user's input into the database
    pool.query (queryText, values)
    // ⬇ Sending back a 'created' code to the user
    .then( result => {
        // ⬇ Checking to see what the result is
        console.log('Response from SQL', result);
        res.sendStatus(201);
        });
})

//* DELETE METHOD
router.delete('/:id', (req, res) => {
    // ⬇ This will grab the id of the task that we would like to delete
    const taskToDelete = req.params.id;
    // ⬇ This tell the database what we'd like to delete and where
    const queryText = `DELETE FROM "toDo" WHERE "toDo".id = $1;`;
    // ⬇ Delete sanitized user input from the database
    pool.query(queryText, [taskToDelete])
    // ⬇ Sending back a 'ok' code to the user
    .then( response => {
        console.log(`You deleted...`, taskToDelete);
        res.sendStatus(200);
    }).catch( err => {
        console.log(`error deleting on server side`);
        res.sendStatus(500);
    });
});

//* PUT METHOD
router.put('/:id', (req, res) => {
    // ⬇ This will grab the id of the task that we would like to delete
    const taskId = req.params.id;
    // ⬇ This tell the database what we'd like to edit and where
    const queryText = `UPDATE "toDo" SET "isComplete" = NOT "isComplete" WHERE "toDo".id=$1;`;
    // ⬇ Edit sanitized user input in the database
    pool.query(queryText, [taskId])
    // ⬇ Sending back a 'ok' code to the user
    .then( result => {
        console.log(`You edited...`, result);
        res.sendStatus(200);
    }).catch( err => {
        console.log(`error editing on server side`);
        res.sendStatus(500);
    });
})













module.exports = router;