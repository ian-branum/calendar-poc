import React from 'react';
import FullCalendar from '@fullcalendar/react'
import Calendar from '@fullcalendar/core'
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from "@fullcalendar/interaction";
import axios from 'axios';

import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
  }

  callAPI() {
      fetch("http://localhost:5000/api/student")
          .then(res => res.json())
          .then(res => this.formatEventList(res))
          .then(res => this.setState({ sess: res }));
  }

  formatEventList(json) {
    var ret = [];
    json.forEach(elem => {
      var sess = {title:elem.title, start:elem.start, end:elem.end, extendedProps:{sessId:elem.sessId}}
      ret.push(sess);
    });

    return ret;
  }


  componentDidMount() {
      this.callAPI(); 
  }

    handleDateClick = (arg) => { 
    var title = prompt('Title', 'New session');
    var start = arg.date;
    var end = arg.date;
    //end.setHours(end.getHours()+1);
    const sess = {title:title, start:start, end:end};
    axios
      .put('http://localhost:5000/api/student', sess)
      .then(() => this.callAPI())
      .catch(err => {
        console.error(err);
      });

  }
  
  handleEventClick = (arg) => { 
    var title = prompt('New title', arg.event.title);
    const sess = {sessId: arg.event.extendedProps.sessId, title:title, start:arg.event.start, end:arg.event.end};
    axios
      .post('http://localhost:5000/api/student', sess)
      .then(() => console.log('Sess modified'))
      .catch(err => {
        console.error(err);
      });
  }

  handleEventDrop = (arg) => {
    const sess = {sessId: arg.event.extendedProps.sessId, title:arg.event.title, start:arg.event.start, end:arg.event.end};
    axios
      .post('http://localhost:5000/api/student', sess)
      .catch(err => {
        console.error(err);
      });
  }

  /** 
  render() {
    return (
      <div className="App">
        <Calendar
          plugins={[timeGridPlugin, interactionPlugin, googleCalendarPlugin]}
          googleCalendarApiKey='AIzaSyDcnW6WejpTOCffshGDDb4neIrXVUA1EAE'
          events={
            googleCalendarId='en.usa#holiday@group.v.calendar.google.com'
            }
          initialView="timeGridWeek"
          editable = {true}
          dateClick={this.handleDateClick}
         
      />  
       </div>
    )
  }
*/

  render() {
    return (
      <div className="App">
        <FullCalendar
          plugins={[ timeGridPlugin, interactionPlugin ]}
          initialView="timeGridWeek"
          editable = {true}
          snapDuration = '00:15:00'
          dateClick={this.handleDateClick}
          eventClick={this.handleEventClick}
          eventDrop={this.handleEventDrop}
          events={this.state.sess}
      />  
       </div>
    )
  }
}

export default App;