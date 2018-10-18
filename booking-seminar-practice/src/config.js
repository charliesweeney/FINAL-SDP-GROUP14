import * as firebase from 'firebase';

// Initialize Firebase
var config = {
    apiKey: "AIzaSyAJuqSUJjoWEbfh8gOtEkqaiwQ3LeXCLME",
    authDomain: "sdp-seminar-booking.firebaseapp.com",
    databaseURL: "https://sdp-seminar-booking.firebaseio.com",
    projectId: "sdp-seminar-booking",
    storageBucket: "sdp-seminar-booking.appspot.com",
    messagingSenderId: "125542536172"
};

firebase.initializeApp(config);

var database = firebase.database();

export default database;