import React, {useState} from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import ToggleButton from 'react-bootstrap/ToggleButton'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Form from 'react-bootstrap/Form'
import 'bootstrap/dist/css/bootstrap.min.css'
import DatePicker from 'react-datepicker'
import axios from 'axios';
import Dropdown from 'react-bootstrap/Dropdown'

import * as Constants from '../constants'

require('react-datepicker/dist/react-datepicker.css')

export default function EditEvent(props)  {

    const [activeSession, setActiveSession] = useState(null);
    const [student, setStudent] = useState(null);
    const [coach, setCoach] = useState(null);
 

    
    const handleSave = (arg) => { 
        //var coach = props.coachList.find(obj => {
        //    return obj.id == activeSession.coachId;
        //});
        const sess = {
            sessId: activeSession.sessId, 
            sessionType: activeSession.sessionType, 
            start:activeSession.start, 
            end:activeSession.end,
            student:activeSession.student,
            coach:activeSession.coach,
            locationId:activeSession.locationId
        };
        if(props.edit) {
            axios
                .post('http://localhost:5000/api/session', sess)
                .then(() => console.log('Sess modified'))
                .then(() =>  props.closeDialog(sess))
                .catch(err => {
                    console.error(err);
            });
        }
        else {
            axios
                .put('http://localhost:5000/api/session', sess)
                .then(() => {
                    props.closeDialog();
                })
                .catch(err => {
                    console.error(err);
            });
        }
       
    }

   
    React.useEffect(() => {
       setActiveSession(props.activeSession);
       //setCoach(props.activeSession.coach);
       
    }, [props.activeSession]);

    React.useEffect(() => {
        setStudent(props.student);
    }, [props.student]);


    const StudentViewer = () => {
        return (
          <Form.Group>
              <Form.Label>Student: </Form.Label>
              <Form.Control type="text" placeholder={props.activeSession.student.name} disabled />
              <br/>
          </Form.Group>
        );  
    }

    const handleStudentChange = (e) => {
        console.log('e: ' + e.target.value);
        setStudent(e.target.value);
    }

    //setActiveSession({...activeSession, student:parseInt(e.target.value)})
    const StudentSelector = (props) => {
        return (
        <Form.Group>
            <Form.Label>Student: </Form.Label>
            <Form.Control as="select" onChange={e => handleStudentChange(e)}> 
            <option className="text-muted">Select . . .</option>                
                        {
                            props.studentList.map((student, idx) => {
                                return (
                                    <option 
                                        value={student}
                                        key={student.id}
                                    >{student.name}</option>
                                )
                            })
                        }
                     </Form.Control>
            <br/>
        </Form.Group>
        );  
    }

    const CoachViewer = () => {
        return (
          <Form.Group>
              <Form.Label>Coach: </Form.Label>
              <Form.Control type="text" placeholder={props.activeSession.coach.name} disabled/>
          </Form.Group>
        );  
    }

    //onChange={e => setActiveSession({...activeSession, coachId:e.target.value})}
    const CoachSelector = (props) => {
        return (
        <Form.Group>
            <Form.Label>Coach: </Form.Label>
            <Form.Control as="select" >
            <option className="text-muted">Select . . .</option>                
            {
                props.coachList.map((elem, idx) => {
                    return (
                        <option 
                            value={elem.id}
                            key={elem.id}
                        >{elem.name}</option>
                    )
                })
            }
                     </Form.Control>
            <br/>
            
        </Form.Group>
        );  
    }
        
    if(!props.show) {
        return null;
    }
    else {
        return (
            <Modal 
                centered
                show={props.show}
                onHide={props.closeDialog}
            >
                <Modal.Header closeButton onClick={props.closeDialog}>
                    <Modal.Title>{props.edit ? 'Edit Session' : 'New Session'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label className="m-2">Session Type: </Form.Label>
                        <ButtonGroup className="bm-2 lm-2" toggle>
                            {Constants.SESSION_TYPES.map((sess, idx) => (
                                <ToggleButton 
                                    type="radio"
                                    name="sessionType"
                                    variant="primary"
                                    key={sess.sessionType} 
                                    checked={sess.id === activeSession.sessionType}
                                    onClick={e => setActiveSession({...activeSession, sessionType:sess.id})}
                                >{sess.display}</ToggleButton>
                            )) }  
                        </ButtonGroup>
                        <Form.Label className="m-2">Session Type: </Form.Label>
                        <ButtonGroup className="bm-2 lm-2" toggle>
                            {Constants.LOCATIONS.map((loc, idx) => (
                                <ToggleButton 
                                    type="radio"
                                    name="location"
                                    variant="primary"
                                    key={loc.id} 
                                    checked={loc.id === activeSession.locationId}
                                    onClick={e =>setActiveSession({...activeSession, locationId:loc.id})}
                                >{loc.display}</ToggleButton>
                            )) }  
                        </ButtonGroup>
                        {
                            props.user.userType === 3 ? <CoachSelector coachList={props.coachList}/> : <CoachViewer/>    
                        }
                        {
                            activeSession.sessionType == 2 ? null : (props.user.userType === 3 ? <StudentSelector studentList={props.studentList}/> : <StudentViewer/>)     
                        }
                        <Form.Label>Start time: </Form.Label>
                        <DatePicker
                            selected={activeSession.start}
                            onChange={date => setActiveSession({...activeSession, start:date})}
                            showTimeSelect
                            dateFormat="EEE, M d h:mm aa"
                        /><br/>
                        <Form.Label>End time: </Form.Label>
                        <DatePicker
                            selected={activeSession.end}
                            onChange={date => setActiveSession({...activeSession, end:date})}
                            showTimeSelect
                            dateFormat="EEE, M d h:mm aa"
                        />
                    </Form.Group>
                    
                    </Form>
                </Modal.Body>
    
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.closeDialog}>Cancel</Button>
                    <Button variant="primary" onClick={handleSave}>Delete</Button>
                    <Button variant="primary" onClick={handleSave}>Save</Button>
                </Modal.Footer>
            </Modal>
        );
    }


}