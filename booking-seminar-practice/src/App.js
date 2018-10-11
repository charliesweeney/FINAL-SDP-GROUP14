import React, { Component } from 'react';
import './App.css';
import { Link } from 'react-router-dom';

// const preObject = document.getElementById('seminar-booking-database');
// const ulList = document.getElementById('list');

// const REF_SEMINARS = firebase.database().ref().child('seminar-booking-database');
// const REF_ROOMS = REF_SEMINARS.child('room');
// const REF_ROOM = REF_SEMINARS.child('CB01_04_006');

// REF_SEMINARS.on('value', snap => {
//   preObject.innerText = JSON.stringify(snap.val(), null, 3);
// });

// REF_ROOM.on('child_added', snap => console.log(snap.val()));

class App extends Component {
  
  constructor() {
    super();
    this.state= {
    };
  }

  componentDidMount() {
  
  }
  
  render() {
    return (
      <div className="nav-menu-wrap">
        <div className="nav-menu">
          <Link to="/seminars" className="btn">View Seminars</Link>
          <Link to="/seminars/organiser" className="btn">View Organisers Seminars</Link>
          <Link to="/seminars/new" className="btn">Add Seminar</Link>
          <Link to="/seminars/edit" className="btn">Edit Seminar</Link>
          <Link to="/room/capacity" className="btn btn-danger">Update Capcity</Link>
        </div>
      </div>
    );
  }
}

export default App;