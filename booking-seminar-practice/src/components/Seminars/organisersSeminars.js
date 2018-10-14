import React, { Component } from 'react';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import { fetchSeminars, seminarsy } from '../../actions';
import _ from 'lodash';

// DATABASE REFERENCES
const REF_DB = firebase.database().ref().child('seminar-booking-database');
export const REF_SEMINARS = firebase.database().ref('seminar');
// const REF_SEMINARS = REF_DB.child('sdp-seminar-booking');
// Rooms
export const REF_ROOMS = firebase.database().ref('room');
const REF_ROOM = REF_ROOMS.child('CB01_04_006');
const REF_CAPACITY = REF_ROOM.child('capacity');
// Seminars 
// const REF_SEMINAR = REF_SEMINARS.child('seminar');

class ListSeminars extends Component {

    constructor() {
        super();

        this.state = {
            seminars: [],
            rooms: []
        }
    }

    componentDidMount() {
        this.getRooms();
    }
    
    returnSeminars() {
        REF_SEMINARS.on('child_added', snap => {
            this.state.seminars.push({
                name: snap.val().name,
                _key: snap.key
            });

            const $ = window.$;

            var $listSeminars = $('#list-seminars');
            var name = snap.val().name;
            var room = snap.val().room;
            var date = snap.val().date;
            $listSeminars.prepend(
                '<div class="col-md-4 seminar-card">'
                +
                    '<li id="list-seminars' + name + '">' 
                        + '<div class="seminar-prev-wrap">'
                        + name 
                        + ' </br>' 
                        +  '<p> Date: ' + date + '</br> Location: ' + room + '</p>'
                        + '</div>' 
                    + '</li>'
                    + '<div class="seminar-btn-link">'
                        + '<a>View Event</a>'
                    + '</div>' +
                '</div>'
            );

            // console.log(this.state.seminars);
        });
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
    
      getRooms() {
        var count = 0;
        REF_ROOMS.on('child_added', snap => {
          this.state.rooms.push({
              room: snap.key
          });
    
          const $ = window.$;
    
          var $listSeminars = $('#rooms');
          var room = snap.key;
            if(count == 0) {
              $listSeminars.prepend(
                count = 1,
                '<option id="room-dropdown" Selected>Select a Seminar</option>'
              );
            } else {
              $listSeminars.prepend(
                '<option id="room-dropdown" value=' + snap.key + '>' + snap.key + '</option>'
              );
            }
    
          // console.log(snap.key);
        });
      }

    render() {
        return (
            <div className="custom-wrap seminars org-seminars">
                <h3>Seminars</h3>
                <a href="#" className="help-btn">System Help</a>
                <a href="#" className="help-btn btn-standard">Add Seminar</a>
                <ul>
                    {this.returnSeminars()}
                </ul>
                <ul className="seminar-list organiser-seminars" id="list-seminars"></ul>
            </div>
        );
    };
}

function mapStateToProps(state) {
    return { seminars: state.seminars };
}

export default connect(mapStateToProps, { fetchSeminars })(ListSeminars); 