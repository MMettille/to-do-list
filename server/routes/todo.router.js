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
});















module.exports = router;