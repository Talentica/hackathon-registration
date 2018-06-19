import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

// Initalize and export Firebase.
const config = {
  apiKey: "AIzaSyBt9OC8cT6F8uovSI-e9c2tBw7fhwIoct4",
  authDomain: "talentica-hakathon-reg.firebaseapp.com",
  databaseURL: "https://talentica-hakathon-reg.firebaseio.com",
  projectId: "talentica-hakathon-reg",
  storageBucket: "talentica-hakathon-reg.appspot.com",
  messagingSenderId: "587953173997"
};
export default firebase.initializeApp(config);
