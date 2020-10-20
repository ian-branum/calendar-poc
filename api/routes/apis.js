var express = require('express');
const app = express();
var router = express.Router();

var sessions=[
    {   
        sessId:1,
        title: 'event 1', 
        start: '2020-10-20 11:00:00', 
        end: '2020-10-20 13:00:00',
//        extendedProps: {sessId:1} 
    },
    {   
        sessId:2,
        title: 'event 2', 
        start: '2020-10-20 13:00:00', 
        end: '2020-10-20 16:00:00',
//        extendedProps: {sessId:2} 
    },
    {   
        sessId:3,
        title: 'event 3', 
        start: '2020-10-23 11:00:00', 
        end: '2020-10-23 13:00:00',
//        extendedProps: {sessId:3} 
    }
  ];

router.get('/student', function(req, res, next) {
    
    res.send(sessions);
});

router.post('/student', function(req, res, next) {
    console.log(req.body.sessId);
    var idx = sessions.findIndex((obj => obj.sessId == req.body.sessId));
    console.log(idx);
    sessions[idx] = req.body;
    console.log('session updated: ' + sessions[idx]);
});

router.put('/student', function(req, res, next) {
    var newSess = req.body;
    newSess['sessId'] = sessions. 
    sessions.push(req.body);
});

router.get('/coach', function(req, res, next) {
    res.send('API is working properly');
});

module.exports = router;