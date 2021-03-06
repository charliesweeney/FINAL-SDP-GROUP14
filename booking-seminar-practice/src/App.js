import React, { Component } from 'react';
import './App.css';
import { Link } from 'react-router-dom';

import OUR_DB from './config';
const REF_OUR_DB = OUR_DB.ref('user/');

class App extends Component {
  
  constructor() {
    super();
    this.state= {
      loggedIn: false,
      userType: '',
      userKey: '',
      userName: ''
    };
  }

  componentDidMount() {
    this.checkLoggedIn();
  }

  checkLoggedIn() {
    REF_OUR_DB.on('child_added', snap => {
      if(snap.val().active == 'true') {    
        this.setState({
          userType: snap.val().type,
          loggedIn: true,
          userKey: snap.key,
          userName: snap.val().givenName
        });
      }
    });
  }
  
  renderFields() {
    if(this.state.loggedIn == false) {   
      return (
        <div className="nav-menu">
          <Link to="/seminars" className="btn">View Seminars</Link>
          <Link to="/login" className="btn">Login</Link>
        </div>
      );
    } else if(this.state.loggedIn == true && this.state.userType == 'Organiser') {
      return (
        <div className="nav-menu">
          <Link to="/seminars" className="btn">View Seminars</Link>
          <Link to="/seminars/print-name-tags" className="btn">Print Name Tags</Link>
          <Link to="/seminars/your-seminars" className="btn">View Your Seminars</Link>
          <Link to="/seminars/new" className="btn">Add a Seminar</Link>
          <Link to="/seminars/edit" className="btn">Edit a Seminar</Link>
          <Link to="/seminars" onClick={this.logoutUser} className="btn">{this.state.userName}, Logout</Link>
          <a className="btn" href="https://drive.google.com/file/d/1apknn6qdvUt3iqDlTHzrT-GN90jB1cj-/view?usp=sharing" target="_blank">Help</a>
        </div>
      );
    } else if(this.state.loggedIn == true && this.state.userType == 'Administrator') {
      return (
        <div className="nav-menu">
          <Link to="/users/edit" className="btn">Edit Users</Link>
          <Link to="/users/addNew" className="btn">Add User</Link>
          <Link to="/seminars" className="btn">View Seminars</Link>
          <Link to="/seminars" onClick={this.logoutUser} className="btn">{this.state.userName}, Logout</Link>
          <a className="btn" href="https://drive.google.com/file/d/1apknn6qdvUt3iqDlTHzrT-GN90jB1cj-/view?usp=sharing" target="_blank">Help</a>
        </div>
      );
    } else if(this.state.loggedIn == true && this.state.userType == 'Host') {
      return (
        <div className="nav-menu">
          <Link to="/seminars" className="btn">View Seminars</Link>
          <Link to="/seminars/your-seminars" className="btn">View your Hosted Seminars</Link>
          <Link to="/seminars" onClick={this.logoutUser} className="btn">{this.state.userName}, Logout</Link>
          <a className="btn" href="https://drive.google.com/file/d/1apknn6qdvUt3iqDlTHzrT-GN90jB1cj-/view?usp=sharing" target="_blank">Help</a>
        </div>
      );
    }
  }


  logoutUser() {
    REF_OUR_DB.on('child_added', snap => {
      if(snap.val().active == 'true') {
        REF_OUR_DB.child(snap.key + '/active').remove();
      }
    });
    this.renderFields();
  }
  
  render() {
    return (
      <div className="nav-menu-wrap">
          {this.renderFields()}
      </div>
    );
  }
}

export default App;