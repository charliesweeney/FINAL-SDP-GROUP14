import * as UTSFirebase from 'firebase';

// Initialize Firebase
var UTSConfig = {
    apiKey: "AIzaSyBotGjTPo84Ak-MTTzHxmZG60rBahWDHfQ",
    authDomain: "uts-dummy-database.firebaseapp.com",
    databaseURL: "https://uts-dummy-database.firebaseio.com",
    projectId: "uts-dummy-database",
    storageBucket: "uts-dummy-database.appspot.com",
    messagingSenderId: "454655610210"
};

var uts = UTSFirebase.initializeApp(UTSConfig, "uts");
// try {
//     UTSFirebase.initializeApp(UTSConfig);
// } catch (err) {
//     // we skip the "already exists" message which is
//     // not an actual error when we're hot-reloading
//     if (!/already exists/.test(err.message)) {
//     console.error('Firebase initialization error', err.stack)
//     }
// }

var UTS_DB = uts.database();

export default UTS_DB;