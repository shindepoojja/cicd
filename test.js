// Import the functions you need from the SDKs you need
// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-analytics.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
  } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";
  import {
    getDatabase,
    ref,
    set,
  } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-database.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries
  
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  // const firebaseConfig = {
  //   apiKey: "AIzaSyAAMr92WWIxBuAYMo_0v59U0JRiaXO3lfY",
  //   authDomain: "tasks-8d83f.firebaseapp.com",
  //   projectId: "tasks-8d83f",
  //   storageBucket: "tasks-8d83f.appspot.com",
  //   messagingSenderId: "291079448941",
  //   appId: "1:291079448941:web:e92c05f865bf8c2b231264",
  //   measurementId: "G-YEXDF17LCH",
  // };
  
  // Initialize Firebase
  // const app = initializeApp(firebaseConfig);
  // const analytics = getAnalytics(app);
  
  const auth = getAuth();
  const db = getDatabase();
  
  let btn = document.getElementsByClassName("btn-submit-register")[0];
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    registerUser();
  });
  
  //Register Function
  function registerUser() {
    alert("Called");
    let fullName = document.getElementById("input-user-full-name-register").value;
    let email = document.getElementById("input-user-email-register").value;
    let username = document.getElementById("input-user-name-register").value;
    let phone = document.getElementById("input-user-phone-no-register").value;
    let password = document.getElementById("password").value;
    let projectName = document.getElementById("input-user-project-name-register").value;

  
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCred) => {
        let userId = userCred.user.uid;
        set(ref(db, `projects/${projectName}/users/` + userId), {
          username,
          email,
          fullName,
          phone,
          lastLogin: Date.now(),
        });
  
        alert("User registerd Successfully.")
        
      })
      .catch((err) => {
        console.log(err);
        alert("Something Went Wrong while registering User.")
      });
  }
  