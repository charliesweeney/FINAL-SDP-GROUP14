import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { REF_SEMINARS, REF_ROOMS, REF_USERS } from './listSeminars';

class Attendees extends Component {
  
  constructor() {
    super();
    this.state= {
      loggedIn: false,
      userType: '',
      userKey: '',
      userName: '',
      attendees: []
    };
  }

  componentDidMount() {
  }

  renderAttendees() {
    const $ = window.$;
    const { handleSubmit } = this.props;
    REF_SEMINARS.child('-LNu78gsGLhCSRrAct2F/attendees').on('child_added', snap => {
      var name =  snap.val().givenName + ' ' + snap.val().surname;
      var email =  snap.val().email;
      var key =  snap.key;

      this.state.attendees.push({
        userName: snap.val().givenName,
        key: snap.key
      });
    });
    var count = 0;
    while(count <= 10) {
      count++;
    }
    return (
      <div>
        <li id="users-dropdown" name="key">ASDASD</li>
        <button className="btn btn-danger">delete</button>
      </div>
    );
  }
  
  render() {
    return (
      <div className="nav-menu-wrap">
          {this.renderAttendees()}
      </div>
    );
  }
}

export default Attendees;