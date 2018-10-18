import React, { Component } from 'react';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Link, Redirect } from 'react-router-dom';
import { login } from '../../actions';
import _ from 'lodash';
import UTS_DB from '../../UTSConfig';
import OUR_DB from '../../config';
import App from '../../App';

// DATABASE REFERENCES
const REF_UTS_DB = UTS_DB.ref('user');
const REF_OUR_DB = OUR_DB.ref('user');

class AddUsers extends Component {

  constructor() {
    super();

    this.state = {
      email: '',
      givenName: '',
      surname: '',
      type: ''
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

  getUserType() {
    const $ = window.$;
    var $listTypes = $('#type');
    $listTypes.prepend(
      '<option id="type-dropdown" value="Administrator">Administrator</option>',
      '<option id="type-dropdown" value="Organiser">Organiser</option>',
      '<option id="type-dropdown" value="Host">Host</option>'
    );
    $listTypes.prepend(
      '<option id="type-dropdown" Selected value="">Select A User Type</option>'
    );
    this.setState({count: this.state.count += 1})
  }

  componentDidMount() {
    this.getUserType()
  }

  returnHome() {
    window.location.replace("/");
  }
 
  onSubmit(values) {
    var found = false;
    var exists = false;
    REF_UTS_DB.on('child_added', snap => {
      if(values.email == snap.val().email) {
        found = true;
        REF_OUR_DB.on('child_added', user => {
          if(values.email == user.val().email) {
            const $ = window.$;
            $('.existing-user').removeClass("hide");
            $('.login-failure').addClass("hide");
            found = false;
            exists = true;
          }
        });
      }
      if(found == true) {
        var newPostKey = firebase.database().ref().child('user').push().key;
        REF_OUR_DB.child(newPostKey).set(values);
        this.returnHome();
        found = false;
      }
    });
    if(found == false && exists == false) {
      const $ = window.$;
      $('.login-failure').removeClass("hide");
      $('.existing-user').addClass("hide");
    }
  }


  render() {
    const { handleSubmit } = this.props;
    return (
      <div>
        <div className="">
          <App />
        </div>
        <div className="custom-wrap" id="edit-sem">
          <h2>Adding A New User</h2>
          <div className="seminarFields">
            <div className="login-failure hide btn-danger">The user you have tried to add, was not found in the UTS Database. Please try again...</div>
            <div className="existing-user hide btn-danger">The user you have tried to add, already exists.</div>
            <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
              <div className="">
                <div className="col-md-3"></div>
                <div className="col-md-6">
                  <label>Users Given Name</label>
                  <Field
                    placeholder="Given Name"
                    name="givenName"
                    type="text"
                    component={this.renderField}
                  />
                  <label>Users Surname</label>
                  <Field
                    placeholder="Surname"
                    name="surname"
                    type="text"
                    component={this.renderField}
                  />
                  <label>Users UTS Email</label>
                  <Field
                    placeholder="Email"
                    name="email"
                    type="text"
                    component={this.renderField}
                  />
                  <label>Users Mobile</label>
                  <Field
                    placeholder="Mobile"
                    name="mobile"
                    type="text"
                    component={this.renderField}
                  />
                  <label>User Type</label>
                  <Field
                    // label="Room"
                    id="type"
                    name="type"
                    type="text"
                    component={this.renderSelect}
                  >
                  </Field>
                  <div className="button-wrap">
                    <a className="btn" onClick={this.returnHome}>Cancel</a>
                    <button type="submit" className="btn btn-primary">Add User</button>
                  </div>
                </div>
                <div className="col-md-3"></div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };
}

function validate(values) {
  // Values -> {Post Object}
  const errors = {};

  // Validate the inputs from 'values'
  if (!values.givenName) {
    errors.name = "Enter a Given Name for the User";
  }
  if (!values.surname) {
    errors.name = "Enter a Surname for the User";
  }
  if (!values.email) {
    errors.name = "Enter an Email for the User";
  }
  if (!values.mobile) {
    errors.name = "Enter a mobile for the User";
  }
  if (!values.type) {
    errors.name = "Enter a user type for the User";
  }
  
  // If errors is empty, the form is fine to submit
  // If errors has *any* properties, redux form assumes form is invalid
  return errors;
}

export default reduxForm({
  validate,
  form: 'addUserForm'
})(
  connect(null,{ login })(AddUsers)
);