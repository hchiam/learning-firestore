// this this file out by running this in bash CLI: node firebase.js

// import firebase from "firebase/app";
// import "firebase/firestore";

const firebase = require("firebase/app");
require("firebase/firestore");

var firebaseConfig = {
  // (fill in necessary data as per notes)
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
