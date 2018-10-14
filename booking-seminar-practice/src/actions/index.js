import database from '../config';
import * as firebase from 'firebase';
import axios from 'axios';

// DATABASE REFERENCES
const REF_DB = firebase.database().ref().child('seminar-booking-database');
const REF_SEMINARS = firebase.database().ref().child('sdp-seminar-booking');
// Rooms
const REF_ROOMS = REF_SEMINARS.child('room');
const REF_ROOM = REF_ROOMS.child('CB01_04_006');
const REF_CAPACITY = REF_ROOM.child('capacity');
// Seminars 
const REF_SEMINAR = firebase.database().ref().child('seminar');

export const CREATE_SEMINAR = 'create-seminar';
export const FETCH_SEMINARS = 'fetch-seminars';
export const EDIT_SEMINAR = 'edit-seminars';
export const FETCH_SEMINAR = 'fetch-seminar';

export function createSeminar(values, callback) {
  const request = REF_SEMINAR.push(values)
  .then(() => callback());

  return {
      type: CREATE_SEMINAR,
      payload: request
  }
}

export function editSeminar(values, callback) {
  const request = REF_SEMINAR.set(values)
  .then(() => callback());

  return {
      type: EDIT_SEMINAR,
      payload: request
  }
}

export function fetchSeminars() {
    const request = REF_SEMINARS.on('child_added', seminar => {
        this.state.seminars.push({
            name: seminar.val().name,
            key: seminar.key
        });
    });
        
//   var seminars = [];
//   const request = REF_SEMINAR.on('child_added', seminar => {
//            seminars.push({
//                name: seminar.val().name,
//                _key: seminar.key
//        });
//    });

//    console.log(seminars);
  
      return {
          type: FETCH_SEMINARS,
          payload: request
      };
}

export function fetchSeminar(key) {
    const request = axios.get(`seminar/` + REF_SEMINAR.ref().child(key));
    

    return {
        type: FETCH_SEMINAR,
        payload: request
    };
}