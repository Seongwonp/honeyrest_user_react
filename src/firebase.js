// firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyDsoru_UeUzepWk1Q4U7QkRS9stT4ADN1U",
    authDomain: "honeyrest-7fb60.firebaseapp.com",
    projectId: "honeyrest-7fb60",
    storageBucket: "honeyrest-7fb60.appspot.app",
    messagingSenderId: "528218900523",
    appId: "1:528218900523:web:16ca4cb9eac20a21c4826e",
    measurementId: "G-87KBCDT0V1"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;