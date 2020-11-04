import React, {useState} from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ToggleButton from 'react-bootstrap/ToggleButton'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Form from 'react-bootstrap/Form'
import 'bootstrap/dist/css/bootstrap.min.css'
import DatePicker from 'react-datepicker'
import axios from 'axios';

import * as Constants from '../constants'

export default function QueryPanel(props) {

    const [locationFilter, setLocationFilter] = useState([]);
    const [coachFilter, setCoachFilter] = useState([]);
    const [studentFilter, setStudentFilter] = useState([]);
 
    const setLocation = (id, e) => {
        props.updateFilter({field:'location', id:id, value:e.currentTarget.checked});
    }

    const RenderLocations = (props) => {
        return (
            Constants.LOCATIONS.map((location, idx) => {
                return (
                    <Form.Check
                        style={{ display:'flex', flexDirection:'column'}}
                        type='checkbox'
                        label={location.display}
                        onChange={e => setLocation(location.id, e)}
                        key={idx}
                        checked={props.locationFilter.includes(location.id)}
                    /> 
                )    
            }
        ))   
    }

    const setCoach = (id, e) => {
        props.updateFilter({field:'coach', id:id, value:e.currentTarget.checked});
    }
    const RenderCoaches = (props) => {
        return (
            props.coachList.map((coach, idx) => {
                return (
                    <Form.Check
                        style={{ display:'flex', flexDirection:'column'}}
                        type='checkbox'
                        label={coach.name}
                        onChange={e => setCoach(coach.id, e)}
                        key={idx}
                        checked={props.coachFilter.includes(coach.id)}
                    /> 
                )    
            }
        ))   
    } 
    
    const setStudent = (id, e) => {
        props.updateFilter({field:'student', id:id, value:e.currentTarget.checked});
    }
    const RenderStudents = (props) => {
        return (
            props.studentList.map((student, idx) => {
                return (
                    <Form.Check
                        style={{ display:'flex', flexDirection:'column'}}
                        type='checkbox'
                        label={student.name}
                        onChange={e => setStudent(student.id, e)}
                        key={idx}
                        checked={props.studentFilter.includes(student.id)}
                    /> 
                )    
            }
        ))   
    } 

    if(props.user.userType >= 3) {
        return (
            <Col xs={3}>
                <Container>
                    <h5>Locations</h5>
                    <RenderLocations 
                        locationFilter={props.locationFilter}    
                    />
                    <h5>Coaches</h5>
                    <RenderCoaches 
                        coachFilter={props.coachFilter}
                        coachList={props.coachList}
                    />
                    <h5>Students</h5>
                    <RenderStudents 
                        studentFilter={props.studentFilter}
                        studentList={props.studentList}
                    />
                </Container>
            </Col>
        )  
    }
    else {
        return '';
    }
}