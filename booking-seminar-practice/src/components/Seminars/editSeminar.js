import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { editSeminar } from '../../actions';
import { REF_SEMINARS, REF_ROOMS } from './listSeminars';

class EditSeminar extends Component {

  constructor() {
      super();

      this.state = {
        name: '',
        room: '',
        rooms: [],
        abstract: '',
        date: '',
        startTime: '',
        endTime: '',
        host: '',
        organiser: '', //USER WHO CREATES THE SEMINAR
        speaker: '',
        speakerBio: '',
        seminars: []
      }
  }

  getSeminars() {
    var count = 0;
    REF_SEMINARS.on('child_added', snap => {
      this.state.seminars.push({
          name: snap.val().name
      });

      const $ = window.$;

      var $listSeminars = $('#seminars');
      var name =  snap.val().name;
      $listSeminars.prepend(
        '<option id="seminar-dropdown" value=' + snap.key + '>' + name + '</option>'
      );

      // console.log(snap.key);
    });
  }

  getSeminar(key) {
    var count = 0;
    REF_SEMINARS.on('child_added', snap => {
      console.log('yes');
      if(snap.key == key) {
        this.state.seminars.push({
            name: snap.val().name,
            _key: snap.key
        });
        
        this.setState({
          name: snap.val().name,
          room: snap.val().room,
          startTime: snap.val().startTime,
          date: snap.val().date,
          endTime: snap.val().endTime,
          abstract: snap.val().abstract,
          host: snap.val().host,
          organiser: snap.val().organiser,
          speaker: snap.val().speaker,
          speakerBio: "Maecenas sed diam eget risus varius blandit sit amet non magna. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
        });

        this.handleInitialize();

      }
    });
  }

  getRooms() {
    var count = 0;
    REF_ROOMS.on('child_added', snap => {
      this.state.rooms.push({
          room: snap.key
      });

      const $ = window.$;

      var $listSeminars = $('#rooms');
      var room = snap.key;
        if(count == 0) {
          $listSeminars.prepend(
            count = 1,
            '<option id="room-dropdown" value=' + this.state.room + '>' + this.state.room + '</option>'
          );
        } else {
          $listSeminars.prepend(
            '<option id="room-dropdown" value=' + snap.key + '>' + snap.key + '</option>'
          );
        }

      // console.log(snap.key);
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
      "speaker": this.state.speaker,
      "speakerBio": this.state.speakerBio
    };
    this.props.initialize(initData);
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

  removeSeminar() {
    
  }

  componentDidMount() {
    // this.getSeminar('-LNx5p5TsNVlBe6D_ree');
    this.getRooms();
    this.getSeminars();
  }

  onSubmit(values) {
    REF_SEMINARS.child('-LNu78gsGLhCSRrAct2F').update(values);
    // this.props.editSeminar(values, () => {
    //   this.props.history.push('/');
    // });
  }
  onSemSubmit(values) {
    this.getSeminar(values);
  }
  
  render() {
    const { handleSubmit } = this.props;
    const { handleSemSubmit } = this.props;
    return (
      <div className="custom-wrap" id="edit-sem">
          <h1>Edit Seminar</h1>
          <div>
            <h5>Select a seminar to edit:</h5>
            <form>
              <Field
                id="seminars"
                name="seminar"
                type="text"
                component={this.renderSelect}
              >
              </Field>
              <button>Edit Seminar</button>
            </form>
          </div>
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
                  // label="Host"
                  placeholder="Host"
                  name="host"
                  type="text"
                  component={this.renderField}
                />
              </div>
              <div className="col-md-6">
              {/* <label>Seminar Length</label>
                <Field
                  // label="Length"
                  placeholder="Length"
                  name="length"
                  type="number"
                  component={this.renderField}
                /> */}
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
                  // label="Organiser"
                  placeholder="Organiser"
                  name="organiser"
                  type="text"
                  component={this.renderField}
                />
                <label>Seminar Speaker Name</label>
                <Field
                  // label="Speaker(s)"
                  placeholder="Speaker(s)"
                  name="speaker"
                  type="text"
                  component={this.renderField}
                  />
                <label>Seminar Speaker Bio</label>
                <Field
                  // label="Speaker(s)"
                  placeholder="Speaker Bio"
                  name="speakerBio"
                  type="text"
                  component={this.renderTextArea}
                />
              </div>
            </div>
            <div className="button-wrap">
              <Link to="/seminars" className="btn">Cancel</Link>
              <button className="btn btn-danger">Delete Seminar</button>
              <button type="submit" className="btn btn-primary">Update</button>
            </div>
          </form>
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
  if (!values.speaker) {
    errors.speaker = "Assign Speaker(s) to your Seminar";
  }

  // If errors is empty, the form is fine to submit
  // If errors has *any* properties, redux form assumes form is invalid
  return errors;
}

export default reduxForm({
  validate,
  form: 'editSeminarForm'
})(
  connect(null,{ editSeminar })(EditSeminar)
);