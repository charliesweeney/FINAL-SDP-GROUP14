import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { editSeminar } from '../../actions';
import * as firebase from 'firebase';
import { REF_SEMINARS, REF_ROOMS, REF_USERS } from './listSeminars';
import _ from 'lodash';
import App from '../../App';
import Attendees from './attendees';

import OUR_DB from '../../config';
const REF_OUR_DB = OUR_DB.ref('user/');

class EditSeminar extends Component {

  constructor() {
      super();

      this.state = {
        seminarKey: 'null',
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
        userType: '',
        userKey: '',
        userName: ''
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

  getSeminars() {
    var count = 0;
    const $ = window.$;
    var $listSeminars = $('#seminars');
    var organiser = '';
    REF_OUR_DB.on('child_added', snap => {
      if(snap.val().active == 'true') {    
        organiser = snap.key;
      }
    });
    REF_SEMINARS.on('child_added', snap => {
      if(organiser == snap.val().organiser) {
        this.state.seminars.push({
            name: snap.val().name
        });
        var name =  snap.val().name;
        $listSeminars.prepend(
          '<option id="seminar-dropdown" value=' + snap.key + '>' + name + '</option>'
        );
      }
    });
    $listSeminars.prepend(
      '<option id="seminar-dropdown" value="" disabled selected>Select A Seminar to Edit </option>'
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
          seminarKey: snap.key,
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
      }
    });
    this.handleInitialize();
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
      '<option id="room-dropdown" value=' + this.state.room + '>' + this.state.room + '</option>'
    );
  }

  getOrganisers() {
    var count = 0;
    const $ = window.$;
    var $listOrganisers = $('#organisers');
    REF_USERS.on('child_added', snap => {
      if(snap.val().type == 'Organiser') {
        var name = snap.val().givenName + " " + snap.val().surname;
        // console.log('OTHER: ' + name);
        $listOrganisers.append(
          '<option id="organiser-dropdown" value=' + snap.key + '>' + name + '</option>'
        );
      }
    });
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
  }

   // Set Values of input fields to seminar information
  handleInitialize() {
     const initData = {
       "name": this.state.name,
       "room": this.state.room,
       "startTime": this.state.startTime,
       "endTime": this.state.endTime,
       "date": this.state.date,
       "abstract": this.state.abstract,
       "host": this.state.host,
       "organiser": this.state.organiser,
       "speakerName1": this.state.speakerName,
       "speakerBio1": this.state.speakerBio,
       //ATTENDEES
      };
      this.props.initialize(initData);
  }

  componentDidMount() {
    this.getSeminars();
    this.getRooms();
    this.getOrganisers();
    this.getHosts();
    // this.renderAttendees();
  }

  refreshPage(){ 
    window.location.reload(); 
  }
  
  showSeminarInfo(){ 
    const $ = window.$;
    $('.seminarFields').removeClass("hide");
    $('.infoOrAttendee').addClass("hide");
  }

  onSelectSubmit(values) {
    this.getSeminar(values.key);
    this.getAttendees(values.key);
    this.handleInitialize();
    const $ = window.$;
    if(values.key) {
      $('.selectEdit').addClass("hide");
      $('.infoOrAttendee').removeClass("hide");
    }
  }

  refreshPage(){ 
    window.location.reload(); 
  }
 
  onSubmit(values) {
    REF_SEMINARS.child(this.state.seminarKey).update(values);
    const $ = window.$;
    $('.confirmUpdate').removeClass("hide");
    // this.callfunction();
    // console.log(this.state.key);
  }

  confirmDeleteSeminar() {
    const $ = window.$;
    $('.edit-gateway').addClass("hide");
    $('.confirmDelete').removeClass("hide");
  }
  deleteSeminar() {
    REF_SEMINARS.child(this.state.seminarKey).remove();
    window.location.replace("/");
  }

  showSeminarAttendees(){ 
    const $ = window.$;
    $('.ENSeminarAttendees').removeClass("hide");
    $('.infoOrAttendee').addClass("hide");
  }

  addAttendee(values) {
    var newPostKey = firebase.database().ref().child(this.state.seminarKey + '/attendees/').push().key;
    REF_SEMINARS.child(this.state.seminarKey + '/attendees/' + newPostKey).set({
      'givenName' : values.givenName, 
      'surname' : values.surname,
      'email' : values.email,
      'attendance' : 'interested'

    });
  }

  deleteAttendee(values) {
    const $ = window.$;
    // do whatever you want with the checked radio
      REF_SEMINARS.child(this.state.seminarKey + '/attendees/').on('child_added', snap => {
        if(values.email == snap.val().email) {
          REF_SEMINARS.child(this.state.seminarKey + '/attendees/' + snap.key).remove();
        }
      });
    // window.location.replace("/");
  }

  getAttendees(key) { 
    const $ = window.$;
    var $listUsers = $('.attendees');
    const { handleSubmit } = this.props;
    REF_SEMINARS.child(key + '/attendees').on('child_added', snap => {
      var name =  snap.val().givenName + ' ' + snap.val().surname;
      var email =  snap.val().email;
      var key =  snap.key;
      $listUsers.prepend(
        '<li>' +
        '<input type="checkbox" id="users-dropdown" name="key" value=' + key + '/>' 
          + name + '</br>'
          + email
        + '</li>'
      )
    });
  }

  // renderAttendees() {
  //   const $ = window.$;
  //   REF_SEMINARS.child('-LNu78gsGLhCSRrAct2F/attendees').on('child_added', snap => {
  //     var name =  snap.val().givenName + ' ' + snap.val().surname;
  //     var email =  snap.val().email;
  //     var key =  snap.key;
  //     return (
  //       <div>
  //         <input id="users-dropdown" name="key" value={key}/>{name}
  //         <a class="btn btn-danger">delete</a>
  //       </div>
  //     )
  //   });
  // }
  
  render() {
    const { handleSubmit } = this.props;
    return (
      <div className="">
        <div className="">
          <App />
        </div>
        <div className="custom-wrap" id="edit-sem">
          <div className="selectEdit">
            <h2>Choose Seminar to Edit</h2>
            <h5>Select a seminar to edit:</h5>
            <form onSubmit={handleSubmit(this.onSelectSubmit.bind(this))}>
              <Field 
                id="seminars"
                name="key"
                type="text"
                component={this.renderSelect}
              >
              </Field>
              <div className="button-wrap">
                <Link to="/seminars" className="btn">Cancel</Link>
                <button type="submit" className="btn btn-primary">Edit Seminar</button>
              </div>
            </form>
          </div>

          <div className="infoOrAttendee hide">
            <h2 className="" id="edit-fields">Edit Seminar ~ {this.state.name}</h2>
            <form onSubmit={handleSubmit(this.onSelectSubmit.bind(this))}>
              <div className="button-wrap">
                <a className="btn" onClick={this.refreshPage}>Cancel</a>
                <button type="submit" className="btn btn-primary" onClick={this.showSeminarAttendees}>Edit/View Attendees</button>
                <button type="submit" className="btn btn-primary" onClick={this.showSeminarInfo}>Edit/View Seminar</button>
              </div>
            </form>
          </div>

          <div className="seminarAttendees hide">
            <h2 className="" id="edit-fields">Edit Seminar Attendees for ~ {this.state.name}</h2>
            <form onSubmit={handleSubmit(this.onSelectSubmit.bind(this))}>
              <div className="button-wrap">
                <a className="btn" onClick={this.refreshPage}>Cancel</a>
                <button type="submit" className="btn btn-primary">Update Attendees</button>
              </div>
            </form>
          </div>

          <div className="seminarFields hide edit-gateway">
            <h2 className="" id="edit-fields">Edit Seminar Information ~ {this.state.name}</h2>
            <div className="confirmUpdate hide btn-primary">Seminar has been succesfully updated!</div>
            <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
              <div className="">
                <div className="col-md-6">
                  <label>Seminar Name</label>
                  <Field
                    // label="Seminar Name"
                    placeholder="Seminar Name"
                    name="name"
                    type="text"
                    component={this.renderField}
                  />
                  <label>Seminar Room</label>
                  <Field
                    // label="Room"
                    id="rooms"
                    name="room"
                    type="text"
                    component={this.renderSelect}
                  >
                  </Field>
                  <label>Start Time</label>
                  <Field 
                    // label="Start Time"
                    placeholder="Start Time"
                    name="startTime"
                    type="time"
                    component={this.renderField}
                  />
                  <label>End Time</label>
                  <Field 
                    // label="Start Time"
                    placeholder="End Time"
                    name="endTime"
                    type="time"
                    component={this.renderField}
                  />
                  <label>Date of Seminar</label>
                  <Field
                    // label="Date"
                    placeholder="Date"
                    name="date"
                    type="date"
                    component={this.renderField}
                  />
                  <label>Seminar Host</label>
                  <Field
                    // label="Room"
                    id="hosts"
                    name="host"
                    type="text"
                    component={this.renderSelect}
                  >
                  </Field>
                </div>
                <div className="col-md-6">
                  <label>Seminar Description</label>
                  <Field
                    // label="Seminar Description"
                    placeholder="Seminar Description"
                    name="abstract"
                    type="text"
                    component={this.renderTextArea}
                  />                 
                  <label>Seminar Organiser</label>
                  <Field
                    // label="Room"
                    id="organisers"
                    name="organiser"
                    type="text"
                    component={this.renderSelect}
                  >
                  </Field>
                  <label>Seminar Speaker Name</label>
                  <Field
                    // label="Speaker(s)"
                    placeholder="Speaker(s)"
                    name="speakerName1"
                    type="text"
                    component={this.renderField}
                    />
                  <label>Seminar Speaker Bio</label>
                  <Field
                    // label="Speaker(s)"
                    placeholder="Speaker Bio"
                    name="speakerBio1"
                    type="text"
                    component={this.renderTextArea}
                  />
                </div>
              </div>
              <div className="button-wrap">
                <a className="btn" onClick={this.refreshPage}>Cancel</a>
                <button className="btn btn-danger" onClick={this.confirmDeleteSeminar}>Delete Seminar</button>
                <button type="submit" className="btn btn-primary">Update</button>
              </div>
            </form>
          </div>

          <div className="confirmDelete hide">
            <h2 className="" id="edit-fields">Deleting Seminar ~ {this.state.name}</h2>
            <form onSubmit={handleSubmit(this.deleteSeminar.bind(this))}>
              <div className="button-wrap">
                <a className="btn" onClick={this.refreshPage}>Cancel</a>
                <button type="submit" className="btn btn-primary" onClick={this.confirmDeleteSeminar}>Confirm Delete</button>
              </div>
            </form>
          </div>

          {/* <div className="SeminarAttendees hide">
          <h2>List Attendees</h2>
            <form>
              <div className="">
                <div className="col-md-6">
                  <ul id="attendees"></ul>
                  <div>
                    {this.renderAttendees()}
                  </div>
                </div>
              </div>
            </form>
          </div> */}

          <div className="ENSeminarAttendees hide">
            <div className="col-md-6">
              <h2>Deleting Attendees</h2>
              <form onSubmit={handleSubmit(this.deleteAttendee.bind(this))}>
                <ul className="attendees" id="attendees">

                </ul>
                <button className="btn btn-danger" type="submit">delete</button>
              </form>
            </div>
            <div className="col-md-6">
              <h2>Adding A New Attendee</h2>
              <form onSubmit={handleSubmit(this.addAttendee.bind(this))}>
              <div className="">
                <div>
                  <label>Attendees Given Name</label>
                  <Field
                    placeholder="Given Name"
                    name="givenName"
                    type="text"
                    component={this.renderField}
                  />
                  <label>Attendees Surname</label>
                  <Field
                    placeholder="Surname"
                    name="surname"
                    type="text"
                    component={this.renderField}
                  />
                  <label>Attendees Email</label>
                  <Field
                    placeholder="Email"
                    name="email"
                    type="text"
                    component={this.renderField}
                  />
                <div className="button-wrap">
                  <a className="btn" onClick={this.refreshPage}>Cancel</a>
                  <button type="submit" className="btn btn-primary">Add Attendee</button>
                </div>
                </div>
              </div>
            </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default reduxForm({
  form: 'editSeminarViewForm'
})(
  connect(null,{ editSeminar })(EditSeminar)
);