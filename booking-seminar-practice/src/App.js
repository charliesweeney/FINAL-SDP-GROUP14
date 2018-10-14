import React, { Component } from 'react';
import './App.css';
import { Link } from 'react-router-dom';

import userEmail from './components/users/login';

class App extends Component {
  
  constructor() {
    super();
    this.state= {
    };
  }

  componentDidMount() {
    console.log(userEmail);
  }
  
  render() {
    return (
      <div className="nav-menu-wrap">
        <div className="nav-menu">
          <Link to="/login" className="btn">Login</Link>
          <Link to="/users/edit" className="btn">Edit Users</Link>
          <Link to="/users/addNew" className="btn">Add User</Link>
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