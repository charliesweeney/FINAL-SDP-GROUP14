import React, { Component } from 'react';
import * as firebase from 'firebase';


// DATABASE REFERENCES
const REF_SEMINARS = firebase.database().ref().child('seminar-booking-database');
// Rooms
const REF_ROOMS = REF_SEMINARS.child('room');
const REF_ROOM = REF_ROOMS.child('CB01_04_006');
const REF_CAPACITY = REF_ROOM.child('capacity');
// Seminars 
const REF_SEMINAR = REF_SEMINARS.child('seminar');

class Capacity extends Component {

    constructor() {
      super();
    }

    componentDidMount() {

    }
    
    render() {
      return (
        <div className="Capacity">
          <form type="get">
              <input placeholder={this.state.currentCapacity} name="capacity" type="number" />
              <button type="submit">UPDATE</button>
          </form>
  
        </div>
      );
    }
  }
  
  export default Capacity;