import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { createSeminar } from '../../actions';
import { REF_SEMINARS, REF_ROOMS, REF_USERS } from './listSeminars';
import App from '../../App';

import OUR_DB from '../../config';
const REF_OUR_DB = OUR_DB.ref('user/');

class AddSeminar extends Component {

  constructor() {
      super();

      this.state = {
        count: 0,
        newCapacity: 0,
        currentCapacity:0,
        name: '',
        room: '',
        rooms: [],
        abstract: '',
        date: '',
        startTime: '',
        endTime: '',
        host: '',
        organiser: '', //USER WHO CREATES THE SEMINAR
        speakers: [{
          speakerName:'',
          speakerBio: ''
        }],
        loggedIn: false,
        userType: '',
        userKey: '',
        userName: '',
        todaysDate: ''
      }
  }

  checkLoggedIn() {
    REF_OUR_DB.on('child_added', snap => {
      if(snap.val().active == 'true') {    
        this.setState({
          userType: snap.val().type,
          loggedIn: true,
          userKey: snap.key,
          userName: snap.val().givenName,
          userSurname: snap.val().surname
        });
      }
    });
  }

  getOrganisers() {
    var userKey = '';
    REF_OUR_DB.on('child_added', snap => {
      if(snap.val().active == 'true') {    
        userKey = snap.key;
      }
    });
    var count = 0;
    const $ = window.$;
    var $listOrganisers = $('#organisers');
    REF_USERS.on('child_added', snap => {
      var name = snap.val().givenName + " " + snap.val().surname;
      if(snap.val().type == 'Organiser') {
        if(userKey == snap.key) {
          $listOrganisers.append(
            '<option id="organiser-dropdown" Selected value=' + userKey + '>Organiser - ' + name + '</option>'
          );
        }
      }
    });
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
          {...field.input}
        />
        <div className="text-help">
          {touched ? error : ''}
        </div>
      </div>
    );
  }
  // Creates the template for an input field
  renderOrganiserField(field) {
    const { meta: { touched, error } } = field;
    const className = `form-group ${touched && error ? 'has-danger' : ''}`;
    return (
      <div className={className + " " + "hide"}>
        {/* <label>{field.label}</label> */}
        <input
          placeholder={field.placeholder}
          className="form-control"
          type={field.type}
          value={field.value}
          {...field.value}
        />
        <div className="text-help">
          {touched ? error : ''}
        </div>
      </div>
    );
  }
  // Creates the template for an TextArea
  renderTextArea(field) {
    const { meta: { touched, error } } = field;
    const className = `form-group ${touched && error ? 'has-danger' : ''}`;
    return (
      <div className={className}>
        {/* <label>{field.label}</label> */}
        <textarea
          placeholder={field.placeholder}
          className="form-control"
          type={field.type}
          {...field.input}
        />
        <div className="text-help">
          {touched ? error : ''}
        </div>
      </div>
    );
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

  refreshPage(){ 
    window.location.reload(); 
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
      $listSeminars.append(
        '<option id="room-dropdown" value=' + snap.key + '>' + snap.key + '</option>'
      );
      // console.log(snap.key);
    });
    $listSeminars.prepend(
      count = 1,
      '<option id="room-dropdown" Selected Disabled>Select a Room</option>'
    );
  }

  getHosts() {
    const $ = window.$;
    var $listHosts = $('#hosts');
    REF_USERS.on('child_added', snap => {
      if(snap.val().type == 'Host') {
        var name = snap.val().givenName + " " + snap.val().surname;
        $listHosts.append(
          '<option id="host-dropdown" value=' + snap.key + '>' + name + '</option>'
        );
      }
    });
    $listHosts.prepend(
      '<option id="host-dropdown" value="" Selected Disabled>Select a Host</option>'
    );
  }


  addSpeakers() {
    const $ = window.$;
    var updateCount = 2;
    var $listSeminars = $('#add-speakers');
    $listSeminars.append(
      '<li>' +
        '<div class="form-group">' +
            '<input placeholder="Speaker Name" name="speakerBio' + updateCount + '" class="form-control" type="text"' + 
            '/>' +
        '</div>' +

        '<div class="form-group">' +
            '<textarea placeholder="Speaker Bio" name="speakerName' + updateCount + '" class="form-control" type="text"' + 
            '/>' +
          '<div class="text-help">' + 
          '</div>' +
        '</div>' +
      '</li>'
    );
  }  

  componentDidMount() {
    this.getRooms();
    this.getOrganisers();
    this.getHosts();
    this.checkLoggedIn();
    this.renderTodaysDate();
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

  onSubmit(values) {
    this.props.createSeminar(values, () => {
      this.props.history.push('/seminars');
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
        <div className="custom-wrap">
            <h1>Create a Seminar</h1>
            <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
              <div className="">
                {/* <div className="col-md-6"> */}
                  <Field
                    // label="Seminar Name"
                    placeholder="Seminar Name"
                    name="name"
                    type="text"
                    component={this.renderField}
                  />
                  <Field
                    id="rooms"
                    name="room"
                    type="text"
                    component={this.renderSelect}
                  >
                  </Field>
                  <div className="col-md-6 left">
                    <label>Start Time</label>
                    <Field
                      placeholder="Start Time"
                      name="startTime"
                      type="time"
                      component={this.renderField}
                    />
                  </div>
                  <div className="col-md-6">
                    <label>End Time</label>
                    <Field
                      // label="End Time"
                      placeholder="End Time"
                      name="endTime"
                      type="time"
                      component={this.renderField}
                    />
                  </div>
                  <div className="col-md-6 left">
                  <label>Date of Event</label>
                  <Field
                    // label="Date"
                    placeholder="Date"
                    name="date"
                    type="date"
                    min={this.state.todaysDate} 
                    component={this.renderDatePicker}
                  />
                  </div>
                  {/* <div className="col-md-6">
                    <label>Events Image</label>
                    <div class="custom-file">
                      <input type="file" name ="image" class="custom-file-input" id="validatedCustomFile" required />
                    </div>
                  </div> */}
                  <Field
                    // label="Seminar Description"
                    placeholder="Seminar Description"
                    name="abstract"
                    type="text"
                    component={this.renderTextArea}
                  />
                  <Field
                    // label="Host"
                    placeholder="Host"
                    name="host"
                    id="hosts"
                    type="text"
                    component={this.renderSelect}
                  />
                  <Field
                    // label="Room"
                    id="organisers"
                    name="organiser"
                    type="text"
                    component={this.renderSelect}
                  ></Field>
                  <br></br>
                  <h3>Speakers</h3>
                  <div>
                    <ul id="add-speakers">
                      <li>
                        <Field
                          // label="Speaker(s)"
                          placeholder="Speaker Name"
                          name="speakerName1"
                          type="text"
                          component={this.renderField}
                        />
                        <Field
                          // label="Speaker(s)"
                          placeholder="Speaker Bio"
                          name="speakerBio1"
                          type="text"
                          component={this.renderTextArea}
                        />
                      </li>
                    </ul>
                  </div>
                  <a onClick={this.addSpeakers} className="btn">add another speaker</a>
                  <br></br>
                {/* </div> */}
                <div className="button-wrap">
                  <Link to="/" className="btn btn-danger">Cancel</Link>
                  <button type="submit" className="btn btn-primary">Submit</button>
                </div>
              </div>
            </form>
        </div>
      </div>
    );
  }
}

function validate(values) {
  // Values -> {Post Object}
  const errors = {};

  // Validate the inputs from 'values'
  if (!values.name) {
    errors.name = "Enter a Name for your Seminar";
  }
  if (!values.room) {
    errors.room = "Assign your Seminar a Room";
  }
  if (!values.abstract) {
    errors.abstract = "Enter a Description for the Seminar";
  }
  if (!values.startTime) {
    errors.startTime = "Assign your Seminar a Start Time";
  }
  if (!values.date) {
    errors.date = "Assign your Seminar a Date";
  }
  if (!values.endTime) {
    errors.endTime = "Enter the End Time of the Seminar";
  }
  if (!values.host) {
    errors.host = "Assign your Seminar a Host";
  }
  if (!values.organiser) {
    errors.organiser = "Assign your Seminar a Organiser";
  }
  if (!values.speakerName) {
    errors.speakerName = "Assign Speaker a name";
  }
  if (!values.speakerBio) {
    errors.speakerBio = "Assign Speaker a description";
  }

  // If errors is empty, the form is fine to submit
  // If errors has *any* properties, redux form assumes form is invalid
  return errors;
}

export default reduxForm({
  validate,
  form: 'addSeminarForm'
})(
  connect(null,{ createSeminar })(AddSeminar)
);