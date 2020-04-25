import firebase from 'firebase'
// Reference: https://css-tricks.com/intro-firebase-react/#article-header-id-4

const firebaseConfig = {
  apiKey: "AIzaSyBM-6yZ6U1aeC0GLBwECjoivaxS5bh0apo",
  authDomain: "fate-character-codex.firebaseapp.com",
  databaseURL: "https://fate-character-codex.firebaseio.com",
  projectId: "fate-character-codex",
  storageBucket: "fate-character-codex.appspot.com",
  messagingSenderId: "668687735980",
  appId: "1:668687735980:web:1fbd68ba1afbd8c2d19309",
  measurementId: "G-82VJ4244MK"
};

firebase.initializeApp(firebaseConfig);
export default firebase;