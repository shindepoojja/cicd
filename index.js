import {
  getDatabase,
  ref,
  get,
  child,
  set,
  update,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-database.js";

const db = getDatabase();

let newTasks = [];
let holdTasks = [];
let activeTasks = [];
let closedTasks = [];
let projectMembers =[];
const input_name = document.getElementById("name_input");
const input_description = document.getElementById("description_input");
const input_endDate = document.getElementById("input-date");
let selectedId;
let selectedTask;
let localContent = { new: [], hold: [], active: [], closed: [] };


window.addEventListener("DOMContentLoaded", async () => {
  let localUserid = JSON.parse(localStorage.getItem("UserUid"));
  let localUserInfo = JSON.parse(localStorage.getItem("UserInfo"));
  if(localUserid && localUserInfo){
    await getUserTasks();
    console.log(localContent);
    let flag = 0;
    Object.keys(localContent).map((k, i) => {
      if (localContent[`${k}`] && localContent[`${k}`].length > 0) {
        switch (k) {
          case "new":
            newTasks = localContent[`${k}`];
            break;
          case "hold":
            holdTasks = localContent[`${k}`];
            break;
          case "active":
            activeTasks = localContent[`${k}`];
            break;
          case "closed":
            closedTasks = localContent[`${k}`];
            break;
          default:
            break;
        }
      } else {
        flag += 1;
      }
    });
    if (flag < 4) {
      // console.log("called");
      LoadUI(localContent);
    }
    addEventListeners();
  }else{

    alert("No User Found. Please Login.")
    let loginPath = window.location.origin+"/login.html";
    window.location.replace(loginPath);
  }
});

function LoadUI(obj) {
  Object.keys(obj).map((e) => {
    if (obj[`${e}`] && obj[`${e}`].length > 0) {
      obj[`${e}`].forEach((el) => {
        //     var d = document.createElement('div')
        //     d.innerHTML = el
        //     console.log(el);
        //    console.log(d.firstChild);
        //     document.getElementsByClassName(e+"-list")[0]
        //     .appendChild(d.firstChild);
        addUIElement(el, true);
      });
    }
  });
}


function getUID() {
  return Date.now().toString() + window.performance.now().toString();
}

function addUIElement(obj, isAdd = false) {
  const newCard = document.createElement("li");
  newCard.setAttribute("data-id", obj.id);
  newCard.setAttribute("class", "list-item");
  newCard.setAttribute("draggable", true);
  newCard.innerHTML = `
        <div class="taskcard"  >
            <div class="taskcard_details">
            <span class="task_name" >${obj.name}</span>
            <span class="task_description">${obj.description}</span>
            <span class="task_status">${obj.status}</span>
            <span class="task_createdAt">${new Date(
              obj.endDate
            ).toDateString()}</span>
            </div>
            <div class="taskcard_actions">
            <i onclick="onEdit" class="fas fa-pencil"></i>
            <i onclick="onDelete" class="fas fa-trash"></i>
            </div>
        </div>
        
    `;

  switch (obj.status) {
    case "new":
      !isAdd && newTasks.push(obj);
      document.getElementsByClassName("new-list")[0].appendChild(newCard);
      !isAdd && updateUserTasks();
      break;
    case "hold":
      !isAdd && holdTasks.push(obj);
      document.getElementsByClassName("hold-list")[0].appendChild(newCard);
      break;
    case "active":
      !isAdd && activeTasks.push(obj);
      document.getElementsByClassName("active-list")[0].appendChild(newCard);
      break;
    case "closed":
      !isAdd && closedTasks.push(obj);
      document.getElementsByClassName("closed-list")[0].appendChild(newCard);
      break;
    default:
      break;
  }

  addEventListeners();
  // storeLocal()
}

function dragStart() {
  selectedTask = this;
  console.log(this);
}
function dragOver(e) {
  // console.log("dragOver");
  e.preventDefault();
}

function dragLeave() {
  // console.log("dragLeave");
}

function dragEnter() {
  // console.log("dragEnter");
}

function dropTrigger() {
  if (this.tagName == "UL") {
    let status = this.classList[0].replace("-list", "");
    searchTask(this, status, true);
  } else {
    console.log("dropTrigger");
    const dragEndIndex = +this.getAttribute("data-id");
    console.log(this.tagName);
    let droppedStatus = this.getElementsByClassName("task_status")[0].innerHTML;
    searchTask(this, droppedStatus, false);
  }
}

function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function insertInList(listNode, newNode) {
  listNode.appendChild(newNode);
}

function updateUIStatus(el, status) {
  el.getElementsByClassName("task_status")[0].innerHTML = status;
  return el;
}

function searchTask(belm, s, isList) {
  var currentStatus =
    selectedTask.getElementsByClassName("task_status")[0].innerHTML;
  let id = selectedTask.getAttribute("data-id");

  let result;
  switch (currentStatus) {
    case "new":
      result = [...newTasks].filter((n) => n.id == id)[0];
      newTasks = newTasks.filter((n) => n.id != id);
      break;

    case "hold":
      result = [...holdTasks].filter((n) => n.id == id)[0];
      holdTasks = holdTasks.filter((n) => n.id != id);
      break;

    case "active":
      result = [...activeTasks].filter((n) => n.id == id)[0];
      activeTasks = activeTasks.filter((n) => n.id != id);
      break;

    case "closed":
      result = [...closedTasks].filter((n) => n.id == id)[0];
      closedTasks = closedTasks.filter((n) => n.id != id);
      break;
    default:
      break;
  }
  let g;
  switch (s) {
    case "new":
      newTasks.push({ ...result, status: "new", modifiedAt: Date.now() });
      g = updateUIStatus(selectedTask, "new");
      isList ? insertInList(belm, g) : insertAfter(belm, g);
      break;

    case "hold":
      holdTasks.push({ ...result, status: "hold", modifiedAt: Date.now() });
      g = updateUIStatus(selectedTask, "hold");
      isList ? insertInList(belm, g) : insertAfter(belm, g);
      break;

    case "active":
      activeTasks.push({ ...result, status: "active", modifiedAt: Date.now() });
      g = updateUIStatus(selectedTask, "active");
      isList ? insertInList(belm, g) : insertAfter(belm, g);
      break;

    case "closed":
      closedTasks.push({ ...result, status: "closed", modifiedAt: Date.now() });
      g = updateUIStatus(selectedTask, "closed");
      isList ? insertInList(belm, g) : insertAfter(belm, g);
      break;

    default:
      break;
  }
  ("Called");
  updateUserTasks();
  // storeLocal()
}

function addEventListeners() {
  let elms = document.getElementsByClassName("list-item");
  let uls = document.getElementsByTagName("ul");
  let trashicon = document.getElementsByClassName("fa-trash");
  let pencilIcon = document.getElementsByClassName("fa-pencil");
  let addbtn = document.getElementsByClassName("addbtn");

  document.getElementById("logout_user").addEventListener('click', logout)

  if (trashicon && trashicon.length > 0) {
    for (let i = 0; i < trashicon.length; i++) {
      trashicon[i].onclick = onDelete;
    }
  }

  if (addbtn[0]) addbtn[0].addEventListener("click", addNewTask);

  if (pencilIcon && pencilIcon.length > 0) {
    for (let i = 0; i < pencilIcon.length; i++) {
      pencilIcon[i].onclick = onEdit;
    }
  }

  if (elms && elms.length > 0) {
    for (let i = 0; i < elms.length; i++) {
      elms[i].addEventListener("dragstart", dragStart);
      elms[i].addEventListener("dragover", dragOver);
      elms[i].addEventListener("dragleave", dragLeave);
      elms[i].addEventListener("dragenter", dragEnter);
      elms[i].addEventListener("drop", dropTrigger);
      elms[i].addEventListener("click", getTaskInfo);
    }
  }

  if (uls && uls.length > 0) {
    for (let i = 0; i < uls.length; i++) {
      // uls[i].addEventListener('dragstart', dragStart)
      uls[i].addEventListener("dragover", dragOver);
      uls[i].addEventListener("dragleave", dragLeave);
      uls[i].addEventListener("dragenter", dragEnter);
      uls[i].addEventListener("drop", dropTrigger);
      uls[i].addEventListener("ondragover", (e) => {
        e.preventDefault();
      });
    }
  }
}
// console.log(newTasks);

//  for addd new tasks//
function addNewTask() {

  let endDateVal = input_endDate.value;
  let endDateTime = new Date(endDateVal).getTime();
  let localUserInfo = JSON.parse(localStorage.getItem("UserInfo"));
  var newTask = {
    id: getUID(),
    name: input_name.value,
    description: input_description.value,
    status: "new",
    assignedTo: localUserInfo.username,
    createdAt: Date.now(),
    modifiedBy: localUserInfo.username,
    modifiedAt: Date.now(),
    endDate: endDateTime,
  };
  addUIElement(newTask);
  input_name.value = ""
  input_endDate = ""
  input_description = ""
}

// LoadUI({new:newTasks,
//     hold: holdTasks,
//     active:activeTasks,
//     closed: closedTasks});

function updateNameDescription(name, description) {
  selectedTask.getElementsByClassName("task_name")[0].innerHTML =
    name;
  selectedTask.getElementsByClassName("task_description")[0].innerHTML =
    description;
}

function deleteTask() {
  selectedTask.closest("ul").removeChild(selectedTask);
}

function onEdit() {
  // selectedTask = this.closest("li");
  
  let localUserInfo = JSON.parse(localStorage.getItem("UserInfo"));
  let id = selectedTask.getAttribute("data-id");
  let result, updatedTask;
  let currentStatus = selectedTask.closest("ul").classList[0].replace("-list", "");
  let modifiedName = document.getElementById("modify-name").value;
  let modifiedDescription = document.getElementById("modify-description").value;
  let med = document.getElementById("modify-end-date").value
  let modifiedEndDate = new Date(med).getTime();
  let modifiedAssignedTo = document.getElementById("modify-assignedto").value;
  let modifiedTask =  {
    name: modifiedName,
    description: modifiedDescription,
    assignedTo: modifiedAssignedTo,
    modifiedBy: localUserInfo.username,
    status: currentStatus,
    modifiedAt: Date.now(),
    endDate: modifiedEndDate,
  };
  
  switch (currentStatus) {
    case "new":
      result = [...newTasks].map((n) => {
        if (n.id == id) {
          currentStatus = n.status;
          updatedTask = {...modifiedTask, createdAt: n.createdAt, id: n.id}
          return updatedTask;
        } else {
          return n;
        }
      });
      newTasks = result;
      break;

    case "hold":
      result = [...holdTasks].map((n) => {
        if (n.id == id) {
          currentStatus = n.status;
          updatedTask = {...modifiedTask, createdAt: n.createdAt, id: n.id}
          return updatedTask;
        } else {
          return n;
        }
      });
      holdTasks = result;
      break;

    case "active":
      result = [...activeTasks].map((n) => {
        if (n.id == id) {
          currentStatus = n.status;
          updatedTask = {...modifiedTask, createdAt: n.createdAt, id: n.id}
          return updatedTask;
        } else {
          return n;
        }
      });
      activeTasks = result;
      break;

    case "closed":
      result = [...closedTasks].map((n) => {
        if (n.id == id) {
          currentStatus = n.status;
          updatedTask = {...modifiedTask,  createdAt: n.createdAt, id: n.id}
          return updatedTask;
        } else {
          return n;
        }
      });
      closedTasks = result;
      break;
    default:
      break;
  }
  // storeLocal()
  updateNameDescription(modifiedName, modifiedDescription);
 
  updateUserTasks();
}

function onDelete() {
  let text = "Are you sure to delete the task?";
  if (confirm(text) == true) {
    // selectedTask = this.closest("li");
    let id = selectedTask.getAttribute("data-id");

    let result;
    let status = selectedTask.closest("ul").classList[0].replace("-list", "");
    switch (status) {
      case "new":
        result = [...newTasks].filter((n) => n.id != id);
        newTasks = result;
        deleteTask();
        break;

      case "hold":
        result = [...holdTasks].filter((n) => n.id != id);
        holdTasks = result;
        deleteTask();
        break;

      case "active":
        result = [...activeTasks].filter((n) => n.id != id);
        activeTasks = result;
        deleteTask();
        break;

      case "closed":
        result = [...closedTasks].filter((n) => n.id != id);
        closedTasks = result;
        deleteTask();
        break;
      default:
        break;
    }
    document.getElementById("modify-delete-btn").removeEventListener("click", onDelete)
    document.getElementById("modify-update-btn").removeEventListener("click", onEdit)

    document.getElementById("description-container").innerHTML = ""
  }

  // storeLocal()
  updateUserTasks();
}

function getTaskInfo(e) {
  selectedTask = e.target.closest("li");
  let selectedId = e.target.closest("li").getAttribute("data-id");
   
  let selectedInfo = [
    ...newTasks,
    ...activeTasks,
    ...holdTasks,
    ...closedTasks,
  ].filter((i) => i.id === selectedId)[0];

  // descriptioon  //

  document.getElementById("description-container").innerHTML = `
    <h1>Description</h1>
        <div class="info-group">
        <label>Name:</label>
        <input type="text" id="modify-name" value="${selectedInfo.name}"></input>
        </div>
        <div class="info-group">
            <label>Status:</label>
            <span>${selectedInfo.status}</span>
        </div>
        <div class="info-group">
            <label>Assigned To:</label>
            <select id="modify-assignedto" >
            ${projectMembers.map((m) => `<option class="modify-member-${m}" value='${m}' >${m}</option>`)}
            </select>
        </div>
        <div class="info-group">
            <label for="">Modified by: </label> <span>${
              selectedInfo.modifiedBy
            }</span> <span>at ${new Date(
         selectedInfo.modifiedAt
        ).toDateString()}</span>
        </div>
        <label id="label-heading">Description</label>
        <textarea id="modify-description"  rows="9" style="width: 20rem; overflow:scroll; overflow-x:hidden" >${
          selectedInfo.description
        }</textarea>
        <div class="info-group">
            <label id="end-date">End Date:</label>
            <input id="modify-end-date" type="date"></input>
        </div>
        <div class="info-group">
          <button id="modify-update-btn" type="button" >Update</button>
          <button id="modify-delete-btn" type="button" >Delete</button>
        </div>
    `;
  document.getElementsByClassName(`modify-member-${selectedInfo.assignedTo}`)[0].setAttribute("selected", true);
  document.getElementById("modify-delete-btn").addEventListener("click", onDelete)
  document.getElementById("modify-update-btn").addEventListener("click", onEdit)

  let endMonth = new Date(selectedInfo.endDate).getMonth() + 1;
  if (endMonth < 10) endMonth = "0" + endMonth;
  document.getElementById("modify-end-date").value =
    new Date(selectedInfo.endDate).getFullYear() +
    "-" +
    endMonth +
    "-" +
    new Date(selectedInfo.endDate).getDate();
}


function logout(){
  let isLogout = window.confirm("Do you want to logout?")
  if(isLogout){
  localStorage.removeItem("UserUid");
  localStorage.removeItem("UserInfo");}
  localStorage.removeItem("")
  let loginPath = window.location.origin+"/login.html";
   window.location.replace(loginPath);
}










// Firebase Functionality

async function getUserTasks() {
  //   localStorage.setItem(
  //     "UserUid",
  //     JSON.stringify({ id: "WqSQdxJvk4XLmRLD5u9u91gtav42" })
  //   );
  //   console.log(localStorage.getItem("UserUid"));
  let { id: userId } = JSON.parse(localStorage.getItem("UserUid"));
  let localUserInfo = JSON.parse(localStorage.getItem("UserInfo"));
  //   alert(UserId);
  const dbRef = ref(getDatabase());
  await get(child(dbRef, `projects/${localUserInfo.project}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        let userdata = snapshot.val();
        
        console.log(userdata.tasks);
        projectMembers = Object.keys(userdata.members).map(m=> userdata.members[m].username);
        if (userdata.tasks) localContent = userdata.tasks;
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function updateUserTasks() {
  let alltasks = [...newTasks, ...activeTasks, ...holdTasks, ...closedTasks];
  let tasks = {
    new: alltasks.filter((i) => i.status === "new"),
    hold: alltasks.filter((i) => i.status === "hold"),
    active: alltasks.filter((i) => i.status === "active"),
    closed: alltasks.filter((i) => i.status === "closed"),
  };

  console.log("NEw");
  console.log(newTasks);
  console.log("hold");
  console.log(holdTasks);
  console.log("active");
  console.log(activeTasks);
  console.log("closed");
  console.log(closedTasks);

  let { id: userId } = JSON.parse(localStorage.getItem("UserUid"));
  let localUserInfo = JSON.parse(localStorage.getItem("UserInfo"));
  try {
    update(ref(db, `projects/${localUserInfo.project}/`), {
      tasks: tasks,
    });
  } catch (err) {
    console.log(err);
  }
}
