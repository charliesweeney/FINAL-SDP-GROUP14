import React, { Component } from 'react';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
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
            seminars: []
        }
    }

    componentDidMount() {
        // this.props.fetchSeminars();
        // this.returnSeminars();
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
                + '<div class="seminar-prev-img">'
                + '</div>' +
                    '<li id="list-seminars' + name + '">' 
                        + '<div class="seminar-prev-wrap">'
                        + name 
                        + ': </br>' 
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

    render() {
        return (
            <div className="custom-wrap seminars">
                <h3>Seminars</h3>
                <ul>
                    {this.returnSeminars()}
                </ul>
                <ul className="seminar-list" id="list-seminars"></ul>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { posts: state.posts };
}

export default connect(mapStateToProps, { fetchSeminars })(ListSeminars); 