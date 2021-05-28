const express = require('express');
const router = express.Router();
const pool = require('../modules/pool.js')

//* GET REQUEST
router.get('/', (req, res) => {
    let queryText = 'SELECT * FROM "to-do" ORDER BY "id";';
    pool.query(queryText).then( result => {
        // ⬇ Sends back the results in an object
        res.send(result.rows);
    })
})
















module.exports = router;