import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { editSeminar } from '../../actions';
import * as firebase from 'firebase';
import { REF_SEMINARS, REF_ROOMS, REF_USERS } from './listSeminars';
import _ from 'lodash';
import App from '../../App';
import UTS_DB from '../../UTSConfig';
import OUR_DB from '../../config';
import { exists } from 'fs';

// DATABASE REFERENCES
const REF_UTS_DB = UTS_DB.ref('user');
const REF_OUR_DB = OUR_DB.ref('user');

class SeminarView extends Component {

  constructor() {
      super();

      this.state = {
        key: '',
        name: '',
        room: '',
        rooms: [],
        abstract: '',
        date: '',
        startTime: '',
        endTime: '',
        host: '',
        organiser: '', //USER WHO CREATES THE SEMINAR
        speakerName: '',
        speakerBio: '',
        seminars: [],
        loggedIn: false,
        userType: '',
        userKey: '',
        userName: '',
        userEmail: '',
        userMobile: ''
      }
  }

  // Creates the template for an input field
  renderField(field) {
    const { meta: { touched, error } } = field;
    const className = `form-group ${touched && error ? 'has-danger' : ''}`;
    return (
      <div className={className}>
        {/* <label>{field.label}</label> */}
        <input
          placeholder={field.placeholder}
          className="form-control"
          type={field.type}
          value={field.value}
          {...field.input}
        />
        <div className="text-help">
          {touched ? error : ''}
        </div>
      </div>
    );
  }

  getSeminar(key) {
    var count = 0;
    REF_SEMINARS.on('child_added', snap => {
      // console.log("Passed In: " + key);
      if(snap.key == key) {
        // console.log("MATCHED");        
        // console.log(snap.val().name);        
        this.setState({
          key: snap.key,
          name: snap.val().name,
          room: snap.val().room,
          startTime: snap.val().startTime,
          date: snap.val().date,
          endTime: snap.val().endTime,
          abstract: snap.val().abstract,
          host: snap.val().host,
          organiser: snap.val().organiser,
          speakerName: snap.val().speakerName1,
          speakerBio: snap.val().speakerBio1
        });

        REF_OUR_DB.on('child_added', user => {
          if(user.key == snap.val().organiser) {    
            this.setState({
              userName: user.val().givenName + " " + user.val().surname,
              userEmail: user.val().email,
              userMobile: user.val().mobile
            });
          }
        });

      }
    });
  }

  getOrganiser() {
    
  }
  
  getSeminars() {
    // console.log(window.location.href);
    var str = window.location.href;
    var key = str.split("seminar/").pop();
    this.getSeminar(key);
    this.setState({seminarKey: key});
  }

  componentDidMount() {
    this.getSeminars();
  }

  refreshPage(){ 
    window.location.reload(); 
  }
  
  onSubmit(values) {
    const $ = window.$;
    var updated = false;
    var i = 0;

      REF_SEMINARS.child(this.state.seminarKey + '/attendees').on('child_added', data => {
        console.log(values.email);
        if(values.email == data.val().email) {
          $('.attendee-interest-form').removeClass("hide");
          $('.add-attendee').addClass("hide");
          REF_SEMINARS.child(this.state.seminarKey + '/attendees/' + data.key).update({
            'givenName' : values.givenName, 
            'surname' : values.surname,
            'email' : values.email
          });
          updated = true;
        } else if(updated == false) {
          if(i == 0) {
            i = 20;
            var found = false;
            REF_UTS_DB.on('child_added', uts => {
              if(values.email == uts.val().email) {
                var newPostKey = firebase.database().ref().child(this.state.seminarKey + '/attendees/').push().key;
                REF_SEMINARS.child(this.state.seminarKey + '/attendees/' + newPostKey).set({
                  'givenName' : values.givenName, 
                  'surname' : values.surname,
                  'email' : values.email,
                  'attendance' : 'interested' 
                });
                found = true;
              }
              if(found == false){
                $('.wrong-email').removeClass("hide");
              }
            });
          }
        }
    });  
    // REF_SEMINARS.child(this.state.key).set(values);
  }
  updateInterest(values) {
    var key = '';
    REF_SEMINARS.child(this.state.seminarKey + '/attendees').on('child_added', snap => {
      if(values.email == snap.val().email) {
        key = snap.key;
      }
    });

    REF_SEMINARS.child(this.state.seminarKey + '/attendees/' + key).set({
      'givenName' : values.givenName, 
      'surname' : values.surname,
      'email' : values.email,
      'attendance' : values.attendance
    });
    this.refreshPage();
  }
  
  render() {
    const { handleSubmit } = this.props;
    return (
      <div className="">
        <div className="">
          <App />
        </div>
        <div className="custom-wrap" id="edit-sem">
          <div className="seminar-display">
            <h2>{this.state.name}</h2>
            <div className="seminar-body">
              <h4>SEMINAR DESCRIPTION</h4>
              <p>{this.state.abstract}</p>
              <p>Location: {this.state.room}</p>
              <p>Date of Seminar: {this.state.date}</p>
              <p>Time of Seminar: {this.state.startTime} - {this.state.endTime}</p>
            </div>
            <div className="seminar-body">
              <h4>SEMINAR SPEAKERS</h4>
              <p>Speaker Name: {this.state.speakerName}</p>
              <p>Speaker Biography: {this.state.speakerBio}</p>
            </div>
            <div className="seminar-body">
              <h4>SEMINAR ORGANISER</h4>
              <p>{this.state.userName}</p>
              <p>If you are not a UTS staff member or student, and would like to attend the seminar. Contact the organiser on: {this.state.userEmail} or {this.state.userMobile}</p>
            </div>
            <div className="button-wrap">
              <form className="add-attendee" onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                <div className="wrong-email hide btn-danger">The email which was entered was not a UTS email.</div>
                <div className="col-md-6">
                  <label>First Name</label>
                  <Field
                    placeholder="givenName"
                    name="givenName"
                    type="text"
                    component={this.renderField}
                  />
                </div>
                <div className="col-md-6">
                  <label>Last Name</label>
                  <Field
                    placeholder="Last Name"
                    name="surname"
                    type="text"
                    component={this.renderField}
                  />
                  <label>Email</label>
                  <Field
                    placeholder="Email"
                    name="email"
                    type="text"
                    component={this.renderField}
                  />
                  <button type="submit" className="btn btn-primary">Register</button>
                </div>
              </form>
            </div>
              <form className="attendee-interest-form hide" onSubmit={handleSubmit(this.updateInterest.bind(this))}>
                <h4>Attendee is registered. Update Your Attendance</h4>
                <div className="col-md-6 radio">
                  <Field
                    placeholder=""
                    name="attendance"
                    value="interested"
                    type="radio"
                    checked="checked"
                    component={this.renderField}
                  />Interested
                </div>
                <div className="col-md-6 radio">
                  <Field
                    placeholder=""
                    name="attendance"
                    type="radio"
                    value="attending"
                    component={this.renderField}
                  />Attending
                </div>
                <button type="submit" className="btn btn-primary">Update Attendance</button>
              </form>
          </div>
        </div>
      </div>
    );
  }
}

export default reduxForm({
  form: 'organisersSeminar'
})(
  connect(null,{ editSeminar })(SeminarView)
);