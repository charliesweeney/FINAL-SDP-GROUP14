import React, { Component } from 'react';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Link, Redirect } from 'react-router-dom';
import { login } from '../../actions';
import _ from 'lodash';
import OUR_DB from '../../config';

// DATABASE REFERENCES
const REF_OUR_DB = OUR_DB.ref('user/');

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
    // Get a key for a new Post.
    var newPostKey = firebase.database().ref().child('user').push().key;
    REF_OUR_DB.child(newPostKey).set(values);
    this.returnHome();
  }


  render() {
    const { handleSubmit } = this.props;
    return (
      <div className="custom-wrap" id="edit-sem">
        <h2>Adding A New User</h2>
        <div className="seminarFields">
          <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
            <div className="">
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
                <label>User Type</label>
                <Field
                  // label="Room"
                  id="type"
                  name="type"
                  type="text"
                  component={this.renderSelect}
                >
                </Field>
              </div>
            </div>
            <div className="button-wrap">
              <a className="btn" onClick={this.returnHome}>Cancel</a>
              <button type="submit" className="btn btn-primary">Add User</button>
            </div>
          </form>
        </div>
      </div>
    );
  };
}

export default reduxForm({
  form: 'addUserForm'
})(
  connect(null,{ login })(AddUsers)
);