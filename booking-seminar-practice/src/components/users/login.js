import React, { Component } from 'react';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Link, Redirect } from 'react-router-dom';
import { login } from '../../actions';
import _ from 'lodash';
import UTS_DB from '../../UTSConfig';
import OUR_DB from '../../config';

// DATABASE REFERENCES
const REF_UTS_DB = UTS_DB.ref('user');
const REF_OUR_DB = OUR_DB.ref('user');

class Login extends Component {

  constructor() {
    super();

    this.state = {
      userEmail: '',
      userType: '',
      userName: ''
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

  getUserName() {

  }

  getUsers() {
    REF_OUR_DB.on('child_added', snap => {
      var name = snap.val().givenName + " " + snap.val().surname;
      var type = snap.val().type;
      if(this.state.userEmail == snap.val().email) {
        console.log('LOGGED IN:' + name);
        OUR_DB.ref(`user/` + snap.key).update({active: 'true'});
        this.setState({
          userName: name,
          userType: type
        })
        var loc = window.location.hostname;
        window.location.replace("/");
      }
    });
  }
  
  preLoginUser(values) {
    while(values.email == '') {
      // Waiting to retrieve email input
    }
    this.loginUser(values);
  }
  loginUser(values) {
    REF_UTS_DB.on('child_added', snap => {
      if(values.email == snap.val().email) {
        this.setState({userEmail: values.email});
      }
    });
    this.getUsers();
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <div>
        <div>
          Log in 
        </div> 
        <form onSubmit={handleSubmit(this.preLoginUser.bind(this))}>
          <div className="form-group">
            <label> Email address </label> 
            <Field
              placeholder="Your UTS Email"
              className="form-control"
              name="email"
              type="text"
              component={this.renderField}
            />
            <label> Password </label> 
            <Field
              placeholder="Your UTS Password"
              name="password"
              type="password"
              component={this.renderField}
            />
          </div>
          <button type="submit" className="btn btn-primary">Login</button>
        </form> 
      </div>
    );
  };
}

export default reduxForm({
  form: 'loginForm'
})(
  connect(null,{ login })(Login)
);