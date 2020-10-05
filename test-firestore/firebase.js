// try this file out by running this in bash CLI: node firebase.js

// import firebase from "firebase/app";
// import "firebase/firestore";

const firebase = require("firebase/app");
require("firebase/firestore");

require("dotenv").config(); // create a .env file with the other info you need
var firebaseConfig = {
  // apiKey: process.env.apiKey,
  // authDomain: process.env.authDomain,
  // databaseURL: process.env.databaseURL,
  projectId: process.env.projectId,
  // storageBucket: process.env.storageBucket,
  // messagingSenderId: process.env.messagingSenderId,
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const collection = db.collection("books");
collection.get().then((snapshot) => {
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  console.log(data);
});
