import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";
import {
  getDatabase,
  ref,
  get,
  child,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-database.js";

let btn = document.getElementById("btn-login");
btn.addEventListener("click", (e) => {
  e.preventDefault();
  loginWithCred();
});

function loginWithCred() {
  let email = document.getElementById("input-user-mail-login").value;
  let password = document.getElementById("input-user-password-login").value;
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      // const user = userCredential.user;
      let userID = userCredential.user.uid;
      console.log(userCredential);
      localStorage.setItem("UserUid", JSON.stringify({id: userID}))
      readUserData(userID);
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("Something went wrong while Logging In")
    });
}

function readUserData(userId) {
  const dbRef = ref(getDatabase());
  get(child(dbRef, `users/${userId}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        let userdata = snapshot.val();
        // console.log(userdata)
        localStorage.setItem("UserInfo",JSON.stringify(userdata));
        alert(
          `name : ${userdata.fullName}, phone: ${userdata.phone}, username: ${userdata.username}, email: ${userdata.email}`
        );
        let loginPath = window.location.origin+"/index.html";
        window.location.replace(loginPath);
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
