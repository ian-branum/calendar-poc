require('dotenv').config();
var express = require('express');
const app = express();
var router = express.Router();

var sessions=[
    {   
        sessId:1,
        sessionType: 0, 
        start: '2020-11-03 11:00:00', 
        end: '2020-11-03 13:00:00',
        locationId: 0,
        student: {name:'Jenny Smith', id:100},
        coach: {name:'Marge Simpson', id:10}
    },
    {   
        sessId:2,
        sessionType: 1, 
        start: '2020-11-03 13:00:00', 
        end: '2020-11-03 15:00:00',
        locationId:1,
        student: {name:'June Smith', id:101},
        coach: {name:'Marge Simpson', id:10}
    },
    {   
        sessId:3,
        sessionType: 0, 
        start: '2020-11-05 11:00:00', 
        end: '2020-11-05 13:00:00',
        locationId: 0,
        student: {name:'Jenny Smith', id:100},
        coach: {name:'Lisa Simpson', id:30}
    }
  ];

  var students = [
    {name: 'Jenny Smith', id: 100, familyId: 1},
    {name: 'June Smith', id: 101, familyId: 1},
    {name: 'Joey Smith', id: 102, familyId: 1},
    {name: 'Jane Doe', id: 103, familyId: 2},
    {name: 'Johnny Doe', id: 104, familyId: 3},
    {name: 'Luke Skywalker', id: 105, familyId: 4}
  ];

  var coaches = [
    {name: 'Marge Simpson', id: 10},
    {name: 'Homer Simpson', id: 20},
    {name: 'Lisa Simpson', id: 30}
  ];

router.get('/session', function(req, res, next) {
    //With no params, return everything
    //userType == coach, return all sessions for student OR coach. Not AND. 
    //userType == parent, return all sessions for family, all children, but not Coach Availability (id:2)
    res.send(sessions);
});

router.post('/session', function(req, res, next) {
    console.log('updateing session: ' + req.body.sessId);
    var idx = sessions.findIndex((obj => obj.sessId == req.body.sessId));
    console.log(req.body);
    sessions[idx] = req.body;
    console.log('session updated: ' + sessions[idx]);
    res.sendStatus(200);
});

router.put('/session', function(req, res, next) {
    var newSess = req.body;
    newSess['sessId'] = sessions.length + 1;
    console.log(newSess);
    sessions.push(newSess);
    res.sendStatus(200);
});

router.delete('/session', function(req, res) {
    console.log('sess: ' + req.query['sessionId'])
    res.sendStatus(200);
});

router.get('/student', function(req, res, next) {
    res.send(students);
});

router.get('/coach', function(req, res, next) {
    res.send(coaches);
});





module.exports = router;