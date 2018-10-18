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

  getUsers(email) {
    REF_OUR_DB.on('child_added', snap => {
      var name = snap.val().givenName + " " + snap.val().surname;
      var type = snap.val().type;
      if(email == snap.val().email) {
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
  
  // preLoginUser(values) {
  //   this.loginUser(values);
  // }

  loginUser(values) {
    var found = 'null';
    REF_UTS_DB.on('child_added', snap => {
      if(values.email == snap.val().email && values.password == snap.val().password) {
        this.setState({userEmail: values.email});
        found = true;
      } else {
        found = false;
      }
      const $ = window.$;
      if(found == true) {
        this.getUsers(values.email);
        $('.login-failure').addClass("hide");
      } else if(found == false) {
        $('.login-failure').removeClass("hide");
      }
    });
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <div>
        <div className="">
          <App />
        </div>
        <div className="login-form">
          <h4 className="text-center">
            Log in 
          </h4>
          <form onSubmit={handleSubmit(this.loginUser.bind(this))}>
          <div className="login-failure hide btn-danger">Incorrect UTS email or password. Please try again...</div>
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
      </div>
    );
  };
}

export default reduxForm({
  form: 'loginForm'
})(
  connect(null,{ login })(Login)
);