import React, { Component } from 'react';
import './App.css';
import { Link } from 'react-router-dom';

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