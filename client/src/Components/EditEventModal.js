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
    const [studentId, setStudentId] = useState(null);
    const [coachId, setCoachId] = useState(null);
 

    const handleDelete = () => {
        axios
            .delete('http://localhost:5000/api/session', {params:{sessionId:activeSession.sessId}})
            .then(() =>  props.closeDialog())
            .catch(err => {
                console.error(err);
        });
    }
    
    const handleSave = (arg) => { 
        if(
            activeSession.sessionType == undefined ||
            (studentId == undefined && activeSession.sessionType != 2 ) ||
            coachId == undefined ||
            activeSession.locationId == undefined
        ) {
            alert('Fill in all required fields:Session Type, Student, Coach, and ')
            return;
        }
        var coach = props.coachList.find(obj => {
            return obj.id == coachId;
        });
        var student = props.studentList.find(obj => {
            return obj.id == studentId;
        });


        console.log('coach: ' + coach);

        const sess = {
            sessId: activeSession.sessId, 
            sessionType: activeSession.sessionType, 
            start:activeSession.start, 
            end:activeSession.end,
            student: activeSession.sessionType == 2 ? {id:0} : student, //{id:student.id, name:student.name},
            coach:coach, //{id:coach.id, name:coach.name},
            locationId:activeSession.locationId,
            cancelledBilled:activeSession.cancelledBilled,
            cancelledUnbilled:activeSession.cancelledUnbilled,
            cancelNotes:activeSession.cancelNotes
        };
        //return;
        if(props.edit) {
            axios
                .post('http://localhost:5000/api/session', sess)
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
        
    }, [props.activeSession]);

    React.useEffect(() => {
        setStudentId(props.student.id);
    }, [props.student]);

    React.useEffect(() => {
        setCoachId(props.coach.id);
    }, [props.coach]);


    const StudentViewer = () => {
        return (
          <Form.Group>
              <Form.Label>Student: </Form.Label>
              <Form.Control type="text" placeholder={props.activeSession.student.name} disabled />
              <br/>
          </Form.Group>
        );  
    }

    const StudentSelector = (props) => {
        return (
        <Form.Group>
            <Form.Label>Student: </Form.Label>
            <Form.Control as="select" defaultValue={studentId} onChange={e => setStudentId(e.target.value)}> 
            <option className="text-muted">Select . . .</option>                
                        {
                            props.studentList.map((student, idx) => {
                                return (
                                    <option 
                                        value={student.id}
                                        key={idx}
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

    const setCoach2 = (val) => {
        console.log(val);
    }

    const CoachSelector = (props) => {
        return (
        <Form.Group>
            <Form.Label>Coach: </Form.Label>
            <Form.Control as="select" defaultValue={coachId} onChange={e => setCoachId(e.target.value)}>
            <option className="text-muted">Select . . .</option>                
            {
                props.coachList.map((coach, idx) => {
                    return (
                        <option 
                            value={coach.id}
                            key={idx}
                        >{coach.name}</option>
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
                                    key={idx} 
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
                                    key={idx} 
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
                        <Form.Check
                            style={{ display:'flex', flexDirection:'column'}}
                            type='checkbox'
                            key={1}
                            label='Cancelled - billed'
                            onChange={e => setActiveSession({...activeSession, cancelledBilled:e.currentTarget.checked})}
                            checked={activeSession.cancelledBilled}
                        /> 
                        <Form.Check
                            style={{ display:'flex', flexDirection:'column'}}
                            type='checkbox'
                            key={2}
                            label='Cancelled - unbilled'
                            onChange={e => setActiveSession({...activeSession, cancelledUnbilled:e.currentTarget.checked})}
                            checked={activeSession.cancelledUnbilled}
                        /> 
                        <Form.Label>Cancellation notes: </Form.Label>
                        <Form.Control 
                            name="cancelNotes"
                            type="text" 
                            defaultValue={props.activeSession.cancelNotes} 
                            onChange={e => setActiveSession({...activeSession, cancelNotes:e.currentTarget.value})}
                        />
                    </Form.Group>
                    
                    </Form>
                </Modal.Body>
    
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.closeDialog}>Cancel</Button>
                    <Button variant="primary" onClick={handleDelete}>Delete</Button>
                    <Button variant="primary" onClick={handleSave}>Save</Button>
                </Modal.Footer>
            </Modal>
        );
    }


}