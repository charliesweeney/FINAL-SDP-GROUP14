import database from '../config';
import * as firebase from 'firebase';

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
  var seminarsy = [];
  const request = REF_SEMINAR.on('child_added', seminarsy => {
           seminarsy.push({
               name: seminarsy.val().name,
               _key: seminarsy.key
       });
   });

   console.log(seminarsy);
  
      return {
          type: FETCH_SEMINARS,
          payload: request
      };
}