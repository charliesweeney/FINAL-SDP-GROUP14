import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { createSeminar } from '../../actions';
import { REF_SEMINARS, REF_ROOMS } from './listSeminars';

class AddSeminar extends Component {

  constructor() {
      super();

      this.state = {
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
          speakers: []
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
            '<option id="room-dropdown" Selected>Select a Room</option>'
          );
        } else {
          $listSeminars.prepend(
            '<option id="room-dropdown" value=' + snap.key + '>' + snap.key + '</option>'
          );
        }

      // console.log(snap.key);
    });
  }


  addSpeakers() {
    const $ = window.$;

    var $listSeminars = $('#add-speakers');
    $listSeminars.append(
      '<li>' +
        '<div class="form-group">' +
            '<input placeholder="Speaker Name" class="form-control" type="text"' + 
            '/>' +
        '</div>' +

        '<div class="form-group">' +
            '<textarea placeholder="Speaker Bio" class="form-control" type="text"' + 
            '/>' +
          '<div class="text-help">' + 
          '</div>' +
        '</div>' +
      '</li>'
    );
  }  

  componentDidMount() {
    this.getRooms();
  }

  onSubmit(values) {
    this.props.createSeminar(values, () => {
      this.props.history.push('/');
    });
  }

  render() {
    const { handleSubmit } = this.props;
    return (
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
                  // label="Room"
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
                  component={this.renderField}
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
                  type="text"
                  component={this.renderField}
                />
                <Field
                  // label="Organiser"
                  placeholder="Organiser"
                  name="organiser"
                  type="text"
                  component={this.renderField}
                />
                <br></br>
                <h3>Speakers</h3>
                <div>
                  <ul id="add-speakers">
                    <li>
                      <Field
                        // label="Speaker(s)"
                        placeholder="Speaker Name"
                        name="speakerName"
                        type="text"
                        component={this.renderField}
                      />
                      <Field
                        // label="Speaker(s)"
                        placeholder="Speaker Bio"
                        name="speakerBio"
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
  form: 'addSeminarForm'
})(
  connect(null,{ createSeminar })(AddSeminar)
);