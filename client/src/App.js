import React, {useState} from 'react';
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from "@fullcalendar/interaction";
import axios from 'axios';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'


import EditEvent from "./Components/EditEventModal";
import QueryPanel from "./Components/QueryPanel";
import * as Constants from './constants'

import './App.css';
require('dotenv').config()

export default function App(props) {

  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [displayedSessions, setDisplayedSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [locationFilter, setLocationFilter] = useState([]);
  const [coachFilter, setCoachFilter] = useState([]);
  const [studentFilter, setStudentFilter] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [coachList, setCoachList] = useState([]);
  const [coach, setCoach] = useState(null);

  //Dummy session data
  const user = {name:'Marge Simpson', id:10, userType:3};
  const student = {name:'Jenny Smith', id:100};

  const callAPI = () => {
    if(!loaded) {
      setLoaded(true);
      axios.get("http://localhost:5000/api/session", {params:{userId:user.id, userType:user.userType, studentId:student.id}})
        .then(res => formatEventList(res.data))
        .then(res => user.userType === 3 ? setSessions(res) : setDisplayedSessions(res)) //this ternary is to support the filter for team leads
        .then(() => setLoaded(false)); 
    }  
  }

  const formatEventList = (json) => {
    var ret = [];
    json.forEach(elem => {
      var sess = {
        title: (elem.sessionType === 2 ? elem.coach.name : elem.student.name) + ' (' + Constants.SESSION_TYPES[elem.sessionType].display + ')', 
        start:elem.start, 
        end:elem.end, 
        color: (sessionEditable(elem.coach.id) || user.userType <=1 ) ? Constants.SESSION_TYPES[elem.sessionType].bgColor : '#cccccc',
        textColor: Constants.SESSION_TYPES[elem.sessionType].textColor,
        extendedProps:{
          sessId:elem.sessId, 
          student:elem.student, 
          coach:elem.coach, 
          sessionType:elem.sessionType, 
          locationId:elem.locationId, 
          cancelledBilled:elem.cancelledBilled, 
          cancelledUnbilled:elem.cancelledUnbilled,
          cancelNotes:elem.cancelNotes
        }
      }
      ret.push(sess);
    });
    console.log(ret);
    return ret;
  }

  const closeDialog = () => {
    setLoaded(false);
    callAPI();
    setShow(false);
  }

  const handleDateClick = (arg) => { 
    if(user.userType <= 1) { //if parent or student
      return;
    }
    var start = new Date(arg.date).setHours(arg.date.getHours()+0);
    var end = new Date(arg.date).setHours(arg.date.getHours()+1);
    var sess = {
      sessId: 0, 
      title:'New Session', 
      start:start, 
      end:end, 
      student:student,
      coach:user
    }; 
    setEdit(false);  
    setActiveSession(sess);

  }
  
  const sessionEditable = (coachId) => {
    if(user.userType >= 3) {
      return true; //admin or lead coach
    }
    if(user.userType === 2 && user.id === coachId) {
      return true;
    }
    return false;
  }

  const handleEventClick = (arg) => { 
    if(!sessionEditable(arg.event.extendedProps.coach.id)) { 
      return;
    }
    var sess = {
      sessId: arg.event.extendedProps.sessId, 
      title:arg.event.title, 
      sessionType: arg.event.extendedProps.sessionType,
      locationId: arg.event.extendedProps.locationId,
      start:arg.event.start, 
      end:arg.event.end, 
      coach:arg.event.extendedProps.coach, 
      student:arg.event.extendedProps.student,
      cancelledBilled:arg.event.extendedProps.cancelledBilled,
      cancelledUnbilled:arg.event.extendedProps.cancelledUnbilled,
      cancelNotes:arg.event.extendedProps.cancelNotes
    };
    setEdit(true);
    setActiveSession(sess);
  }

  const handleEventDrop = (arg) => {
    if(!sessionEditable(arg.event.extendedProps.coach.id)) { 
      arg.revert();
      return;
    }
    const sess = {
      sessId: arg.event.extendedProps.sessId, 
      sessionType:arg.event.extendedProps.sessionType,
      locationId:arg.event.extendedProps.locationId,
      start:arg.event.start, 
      end:arg.event.end, 
      student:arg.event.extendedProps.student, 
      coach:arg.event.extendedProps.coach
    };
    axios
      .post('http://localhost:5000/api/session', sess)
      .then(() => callAPI())
      .catch(err => {
        console.error(err);
      });
  }

  const updateFilter = (update) => {
    //console.log(update);
    if(update.field === 'location') {
      updateArray(locationFilter, update.id, update.value);
    }
    if(update.field === 'coach') {
      updateArray(coachFilter, update.id, update.value);    
    }
    if(update.field === 'student') {
      updateArray(studentFilter, update.id, update.value);    
    }

    var filtered = sessions;
    filtered = filtered.filter(sess => locationFilter.includes(sess.extendedProps.locationId));
    filtered = filtered.filter(sess => coachFilter.includes(sess.extendedProps.coach.id));
    //get coach availability for location and coach 
    var coachAvailability = filtered.filter(sess => sess.extendedProps.sessionType === 2);
   
    filtered = filtered.filter(sess => studentFilter.includes(sess.extendedProps.student.id));
    filtered = filtered.concat(coachAvailability);

    
    setDisplayedSessions(filtered);
  }

  const updateArray = (array, id, value) => {
    if(value) {
      array.push(id);
    }
    else {
      array.splice(array.indexOf(id),1);
    }
  }


  React.useEffect(() => {
    if(activeSession) {
        setLoaded(false);
          setShow(true);
    }
  }, [activeSession]);
    
  //On page load
  React.useEffect(() => {
    callAPI();
    axios
            .get('http://localhost:5000/api/student')
            .then((res) => {
                setStudentList(res.data);
                
            })
            .catch(err => {
                console.error(err);
        });
        axios
            .get('http://localhost:5000/api/coach')
            .then((res) => {
                setCoachList(res.data);
            })
            .catch(err => {
                console.error(err);
        });
    
  }, []);

  
  return (
    <div className="App">
      <Container fluid>
        <Row>
          <QueryPanel 
            user={user}
            updateFilter={updateFilter}
            locationFilter={locationFilter}
            coachFilter={coachFilter}
            studentFilter={studentFilter}
            studentList={studentList}
            coachList={coachList}
          />
          <Col>
            <FullCalendar
              plugins={[timeGridPlugin, interactionPlugin]}
              events={displayedSessions}
              initialView="timeGridWeek"
              editable = {user.userType > 1}
              eventOrder = "-sessionType"
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              eventDrop={handleEventDrop}  
              eventResize={handleEventDrop}      
              locationFilter={locationFilter}
              coachFilter={coachFilter}
              studentFilter={studentFilter}
            />       
          </Col>
        </Row>
      </Container>
      <EditEvent 
        show={show}
        edit={edit}
        activeSession={activeSession}
        closeDialog={closeDialog}
        user={user}
        student={student}
        coach={user}
        coachList={coachList}
        studentList={studentList}
      />

    </div>
  )



}

