import React, { Component } from 'react';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Link, Redirect } from 'react-router-dom';
import { login } from '../../actions';
import _ from 'lodash';
import OUR_DB from '../../config';
import { REF_SEMINARS, REF_ROOMS, REF_USERS } from '../Seminars/listSeminars';
import App from '../../App';

// DATABASE REFERENCES
const REF_OUR_DB = OUR_DB.ref('user');

class EditUsers extends Component {

  constructor() {
    super();

    this.state = {
      email: '',
      givenName: '',
      surname: '',
      type: '',
      mobile: '',
      key: '',
      count: 0
    }
  }

  componentDidMount() {
    
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

  refreshPage(){ 
    window.location.reload(); 
  }

  getUser(email) {
    var count = 0;
    REF_OUR_DB.on('child_added', snap => {
      // console.log("Passed In: " + key);
      if(snap.val().email == email) {    
        // console.log("MADEIT");
        this.setState({
          key: snap.key,
          givenName: snap.val().givenName,
          surname: snap.val().surname,
          email: snap.val().email,
          type: snap.val().type
        });
      }
    });
    this.handleInitialize();
  }

  getUserType() {
    const $ = window.$;
    var $listTypes = $('#type');
    if(this.state.count == 1) {
      $listTypes.prepend(
        '<option id="type-dropdown" value="Administrator">Administrator</option>',
        '<option id="type-dropdown" value="Organiser">Organiser</option>',
        '<option id="type-dropdown" value="Host">Host</option>'
        );
        $listTypes.prepend(
          '<option id="type-dropdown" Selected value=' + this.state.type + '>' + this.state.type + '</option>'
        );
    }
    this.setState({count: this.state.count += 1})
  }

   // Set Values of input fields to User information
  handleInitialize() {
    const initData = {
      "givenName": this.state.givenName,
      "surname": this.state.surname,
      "email": this.state.email,
      "type": this.state.type
    };
    this.props.initialize(initData);
  }

  componentDidMount() {
    this.getUsers();
  }

  refreshPage(){ 
    window.location.reload(); 
  }
  
  showUserInfo(){ 
    const $ = window.$;
    $('.seminarFields').removeClass("hide");
    $('.infoOrDelete').addClass("hide");
  }

  showSeminarAttendees(){ 
    const $ = window.$;
    $('.seminarAttendees').removeClass("hide");
  }

  onSelectSubmit(values) {
    this.getUser(values.email);
    this.handleInitialize();
    const $ = window.$;
    if(values.email) {
      $('.selectEdit').addClass("hide");
      $('.infoOrDelete').removeClass("hide");
    }
    this.getUserType();
  }
 
  onSubmit(values) {
    REF_OUR_DB.child(this.state.key).update(values);
    // console.log(this.state.key);
    this.refreshPage();
  }

  getUsers() {
    var count = 0;
    const $ = window.$;
    var $listUsers = $('#users');
    REF_OUR_DB.on('child_added', snap => {
      var name =  snap.val().email;
      $listUsers.prepend(
        '<option id="users-dropdown" value=' + name + '>' + name + '</option>'
      );
    });
    $listUsers.prepend(
      '<option id="users-dropdown" value="" disabled selected>Select A User to Edit </option>'
    );
  }
  
  confirmDeleteUser() {
    const $ = window.$;
    $('.edit-gateway').addClass("hide");
    $('.confirmDelete').removeClass("hide");
  }

  deleteUser() {
    REF_OUR_DB.child(this.state.key).remove();

    REF_SEMINARS.on('child_added', snap => {
      if(snap.val().organiser == this.state.key) {
        REF_SEMINARS.child(snap.key).remove();
      }
    });
    window.location.replace("/");
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <div>
        <div className="">
          <App />
        </div>
        <div className="custom-wrap" id="edit-sem">
          <div className="selectEdit">
            <h2>Choose a User to Edit</h2>
            <h5>Select a user to edit:</h5>
            <form onSubmit={handleSubmit(this.onSelectSubmit.bind(this))}>
              <Field 
                id="users"
                name="email"
                type="text"
                component={this.renderSelect}
              >
              </Field>
              <div className="button-wrap">
                <Link to="/" className="btn">Cancel</Link>
                <button type="submit" className="btn btn-primary">Edit User</button>
              </div>
            </form>
          </div>

          <div className="infoOrDelete hide edit-gateway">
            <h2 className="" id="edit-fields">Edit User ~ {this.state.givenName}</h2>
            <form onSubmit={handleSubmit(this.onSelectSubmit.bind(this))}>
              <div className="button-wrap">
                <a className="btn" onClick={this.refreshPage}>Cancel</a>
                <button type="submit" className="btn btn-primary" onClick={this.confirmDeleteUser}>Delete User</button>
                <button type="submit" className="btn btn-primary" onClick={this.showUserInfo}>Edit/View User</button>
              </div>
            </form>
          </div>
          
          <div className="confirmDelete hide">
            <h2 className="" id="edit-fields">Deleting User ~ {this.state.givenName}</h2>
            <form onSubmit={handleSubmit(this.deleteUser.bind(this))}>
              <div className="button-wrap">
                <a className="btn" onClick={this.refreshPage}>Cancel</a>
                <button type="submit" className="btn btn-primary" onClick={this.confirmDeleteUser}>Confirm Delete</button>
              </div>
            </form>
          </div>

          <div className="seminarAttendees hide">
            <h2 className="" id="edit-fields">User {this.state.givenName} Deleted</h2>
            <form onSubmit={handleSubmit(this.onSelectSubmit.bind(this))}>
              
              <div className="button-wrap">
                <a className="btn" onClick={this.refreshPage}>Cancel</a>
                <button type="submit" className="btn btn-primary">Update Attendees</button>
              </div>
            </form>
          </div>

          <div className="seminarFields hide">
            <h2 className="" id="edit-fields">Edit User Information ~ {this.state.name}</h2>
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
                  <label>Users Email</label>
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
                </div>
              </div>
              <div className="button-wrap">
                <a className="btn" onClick={this.refreshPage}>Cancel</a>
                <button type="submit" className="btn btn-primary">Update</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };
}

export default reduxForm({
  form: 'editForm'
})(
  connect(null,{ login })(EditUsers)
);