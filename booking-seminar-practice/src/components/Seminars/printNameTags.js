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

class PrintNameTags extends Component {

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
          speakerName: snap.val().speakerName,
          speakerBio: snap.val().speakerBio
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
       "speakerName": this.state.speakerName,
       "speakerBio": this.state.speakerBio,
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
    const $ = window.$;
    if(values.key) {
      $('.selectEdit').addClass("hide");
      $('.nameCards').removeClass("hide");
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

  showSeminarAttendees(){ 
    const $ = window.$;
    $('.ENSeminarAttendees').removeClass("hide");
    $('.infoOrAttendee').addClass("hide");
  }

  getAttendees(key) { 
    const $ = window.$;
    var $listUsers = $('.nameCards');
    const { handleSubmit } = this.props;
    REF_SEMINARS.child(key + '/attendees').on('child_added', snap => {
      var name =  snap.val().givenName + ' ' + snap.val().surname;
      var email =  snap.val().email;
      var mobile =  snap.val().mobile;
      var key =  snap.key;
      $listUsers.prepend(
        '<div class="col-md-5 name-card">'
          + name
        + '</div>'
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
        <div className="selectEdit">
          <App />
        </div>
        <div className="custom-wrap" id="edit-sem">
          <div className="selectEdit">
            <h2>Choose Seminar to Print Name Tags</h2>
            <h5>Select a seminar:</h5>
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

          <div className="nameCards hide">

          </div>
        </div>
      </div>
    );
  }
}

export default reduxForm({
  form: 'editSeminarViewForm'
})(
  connect(null,{ editSeminar })(PrintNameTags)
);