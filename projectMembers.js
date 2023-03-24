import {
    getDatabase,
    ref,
    get,
    child,
  } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-database.js";

  let projectMembers=[];
  const membersContainer = document.getElementById("members-container");

  window.addEventListener("DOMContentLoaded", async () => {
    let localUserid = JSON.parse(localStorage.getItem("UserUid"));
    let localUserInfo = JSON.parse(localStorage.getItem("UserInfo"));
    if(localUserInfo && localUserid){
      await getAllMembers();
    }else{
      alert("No User Found. Please Login.")
      let loginPath = window.location.origin+"/login.html";
      window.location.replace(loginPath);
    }
  })

  async function getAllMembers(){
    let localUserInfo = JSON.parse(localStorage.getItem("UserInfo"));
    //   alert(UserId);
    const dbRef = ref(getDatabase());
    await get(child(dbRef, `projects/${localUserInfo.project}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          let userdata = snapshot.val();
          
          projectMembers = Object.keys(userdata.members).map(m=> userdata.members[m]);
        //   if (userdata.tasks) localContent = userdata.tasks;
        renderMembers();
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function renderMembers(){

    membersContainer.innerHTML = `
    <table>
  <tr>
    <th>Username</th>
    <th>Full Name</th>
    <th>Email</th>
  </tr>
    ${projectMembers.map(m => `
    <tr>
    <td>${m.username}</td>
    <td>${m.fullName}</td>
    <td>${m.email}</td>
    </tr>
    `)
    }
</table>
    
    `
  }