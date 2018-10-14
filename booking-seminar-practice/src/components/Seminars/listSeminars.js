import React, { Component } from 'react';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import { fetchSeminars, seminarsy } from '../../actions';
import _ from 'lodash';

// DATABASE REFERENCES
const REF_DB = firebase.database().ref().child('seminar-booking-database');
export const REF_SEMINARS = firebase.database().ref('seminar');
// const REF_SEMINARS = REF_DB.child('sdp-seminar-booking');
// USERS
export const REF_USERS = firebase.database().ref('user');
// Rooms
export const REF_ROOMS = firebase.database().ref('room');
const REF_ROOM = REF_ROOMS.child('CB01_04_006');
const REF_CAPACITY = REF_ROOM.child('capacity');
// Seminars 
// const REF_SEMINAR = REF_SEMINARS.child('seminar');

class ListSeminars extends Component {

  constructor() {
      super();

      this.state = {
          seminars: [],
          rooms: [],
          counter: 0,
          todaysDate: '',
          fromDate: ''
      }
      this.renderFromDate = this.renderFromDate.bind(this);
  }

  componentDidMount() {
      this.getRooms();
      this.returnSeminars(null);
      const $ = window.$;
      this.renderTodaysDate();
      // this.props.fetchSeminars();
  }
  
  returnSeminars(values) {
    const $ = window.$;
    var $listSeminars = $('#list-seminars');
    
    if(this.state.counter == 0 || values == null) {
      REF_SEMINARS.on('child_added', snap => {
        this.state.seminars.push({
          name: snap.val().name,
          _key: snap.key
        });
        
        var name = snap.val().name;
        var room = snap.val().room;
        var date = snap.val().date;
        var key = snap.key;
        
        // else if(values.room != room && (values.fromDate > date || values.fromDate == null) && (values.toDate < date  || values.toDate == null)) {
          
        $listSeminars.prepend(
          '<div class="col-md-4 seminar-card ' + key +  '">'
          + '<li id="list-seminars">' 
          + '<div class="seminar-prev-wrap">'
          + name 
          + ' </br>' 
          +  '<p> Date: ' + date + '</br> Location: ' + room + '</p>'
          + '</div>' 
          + '</li>'
          + '<div class="seminar-btn-link">'
          + '<a href="" id="btn" class="view-seminar-btn">View Event</a>'
          + '</div>' +
          '</div>'
          );
      });
      this.setState({counter: 2});
    } else {
      REF_SEMINARS.on('child_added', snap => {
        var name = snap.val().name;
        var room = snap.val().room;
        var date = snap.val().date;
        var key = snap.key;
        console.log('COMPARING: ' + (values.toDate < date));
        if (values.room == null && values.fromDate == null && values.toDate == null) {
          console.log('Invalid Search...');
          $('.' + key).removeClass('hide');
        } else if((values.room != room || values.room == null) && (values.fromDate < date || values.fromDate == null) && (values.toDate > date  || values.toDate == null)) {
            $('.' + key).addClass('hide');
        }
      });
    }
  }
  

  renderSelect(field) {
    const { meta: { touched, error } } = field;
    const className = `form-group ${touched && error ? 'has-danger' : ''}`;
    return (
      <div className={className}>
      {/* <label>{field.label}</label> */}
      <select
          className="form-control"
          id={field.id}
          value={field.value}
          {...field.input}
      />
      <div className="text-help">
          {touched ? error : ''}
      </div>
      </div>
    );
  }

  renderFromDate() {
    // var date = document.getElementById("fromDate");
    // if(!date) {
    //   var selectedDate = date.val();
    //   console.log(selectedDate);
    //   this.setState({fromDate: selectedDate});
    // }

    const $ = window.$;
    var date = new Date($('#fromDate').val());
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    date = year + '-' + month + '-' + day;
    var dateString = date.toString();
    console.log(dateString);
    this.setState({fromDate: dateString});
  }

  renderTodaysDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd = '0'+dd
    } 
    if(mm<10) {
        mm = '0'+mm
    } 
    today = yyyy + '-' + mm + '-' + dd;

    this.setState({todaysDate: today});
  }
  
  renderDatePicker(field) {
    const { meta: { touched, error } } = field;
    const className = `form-group ${touched && error ? 'has-danger' : ''}`;
    return (
      <div className={className}>
      {/* <label>{field.label}</label> */}
      <input
          className="form-control"
          id={field.id}
          type='date'
          min={field.min}
          max={field.max}
          value={field.value}
          {...field.input}
      />
      <div className="text-help">
          {touched ? error : ''}
      </div>
      </div>
    );
  }
    
  getRooms() {
    var count = 0;
    const $ = window.$;
    var $listSeminars = $('#rooms');
    REF_ROOMS.on('child_added', snap => {
      this.state.rooms.push({
          room: snap.key
      });

      var room = snap.key;
      $listSeminars.prepend(
      '<option id="room-dropdown" value=' + snap.key + '>' + snap.key + '</option>'
      );
      // console.log(snap.key);
    });
    $listSeminars.prepend(
      '<option id="room-dropdown" value="" Selected>Select a Room</option>'
    );
  }


  onSearchSubmit(values) {
      console.log("SEARCHING");
      console.log('Room: ' + values.room);
      console.log('From Date: ' + values.fromDate);
      console.log('To Date: ' + values.toDate);
      var room = values.room;
      var fromDate = values.fromDate;
      var toDate = values.toDate;
      this.returnSeminars(values);
  }

  render() {
    const { handleSubmit } = this.props;
    const $ = window.$;
    return (
      <div className="custom-wrap seminars">
        <h3>Seminars</h3>
        <a href="#" className="help-btn">System Help</a>
        <div className="filter-search">
          <form onSubmit={handleSubmit(this.onSearchSubmit.bind(this))}>
            <div className='col-md-4'>
              <label>Search by Room:</label>
              {/* <select
                className="form-control"
                name='room'
                id='rooms'
              /> */}
              <Field 
                id="rooms"
                name="room"
                component={this.renderSelect}
              >
              </Field>
            </div>
            <div className='col-md-3'>
              <label>Between the Dates:</label>
              <Field 
                id="fromDate"
                className="fromDate"
                name="fromDate"
                // min={this.state.todaysDate}
                min={this.state.todaysDate} 
                component={this.renderDatePicker}
                onChange={this.renderFromDate}
              />
            </div>
            <div className='col-md-3 sec-date'>
              <Field 
                id="datePicker"
                name="toDate"
                min={this.state.fromDate}
                component={this.renderDatePicker}
              />
            </div>
            <div className='col-md-2 sec-date'>
              <button
                className="btn search-button"
                type="submit"
                id=''
              >Search</button>
            </div>
          </form> 
        </div>
        <ul className="seminar-list" id="list-seminars"></ul>
        <ul className="searched-seminar-list hide" id="searched-list-seminars"></ul>
      </div>
    );
  };
}


function mapStateToProps(state) {
    return { seminars: state.seminars };
}

export default reduxForm({
  form: 'editSeminarViewForm'
})(
  connect(mapStateToProps, { fetchSeminars })(ListSeminars)
);