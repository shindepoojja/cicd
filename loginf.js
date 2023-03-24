
let STATUS_LOGGED_IN = 1;

var loginForm = document.getElementById("LoginForm");
if (loginForm) {
  loginForm.addEventListener("submit", handleForm);
}
var logoutBtn = document.getElementById("logout");
if (logoutBtn) {
  logoutBtn.addEventListener("click", logoutData);
}

windowonload();

function handleForm(event) {
  event.preventDefault();
  var inputsLogin = document.getElementsByClassName("checkinputp-login");
  var inValid = false;
  for (var i = 0; i < inputsLogin.length; i++) {
    if (inputsLogin[i] && inputsLogin[i].value.length == 0) {
      if (!inputsLogin[i].classList.contains("requierd-login-details")) {
        inputsLogin[i].classList.add("requierd-login-details");
      }
      var isLoginError = document.getElementById("error-login" + i);

      if (!isLoginError) {
        var loginErrorMessageAlert = document.createElement("span");
        loginErrorMessageAlert.setAttribute("id", "error-login" + i);
        loginErrorMessageAlert.setAttribute("class", "error-span-msg");
        loginErrorMessageAlert.innerHTML = "This field is required";
        var userEmailInputId = document.getElementById(inputsLogin[i].id);
        userEmailInputId.parentNode.append(loginErrorMessageAlert);
      }
      inValid = true;
    } else {
      inputsLogin[i].classList.remove("requierd-login-details");
      var removeLoginErrorMessageAlert = document.getElementById(
        "error-login" + i
      );
      if (removeLoginErrorMessageAlert) {
        removeLoginErrorMessageAlert.remove();
      }
    }
  }
  if (!inValid) {
    setLocalValue();
  }
}
var localValue = document.getElementById("btn-login");
function setLocalValue() {
  localStorage.setItem("loginLocalValue", STATUS_LOGGED_IN);
  window.location.href = "welcome.html";
}

function windowonload() {
  if (screen.width < 1024) {
    document.getElementsByClassName("sidebar")[0].classList.add("hidden");
  }

  if (
    localStorage.getItem("loginLocalValue") == STATUS_LOGGED_IN &&
    window.location.pathname.toLocaleLowerCase().indexOf("login") > 0
  ) {
    window.location.href = "welcome.html";
  } else if (
    localStorage.getItem("loginLocalValue") != STATUS_LOGGED_IN &&
    window.location.pathname.toLocaleLowerCase().indexOf("login") < 0
  ) {
    window.location.href = "login.html";
  }
}

function logoutData(event) {
  event.preventDefault();
  localStorage.removeItem("loginLocalValue");
  window.location.href = "login.html";
}
makeActive();

function makeActive() {
  var heighLighth = document.getElementsByClassName("link");

  for (let i = 0; i < heighLighth.length; i++) {
    if (heighLighth[i].href == window.location.href) {
      heighLighth[i].classList.add("activeLink");
    }
  }
}

var collapsibleBtn = document.getElementsByClassName("collapsible");

collapsibleBtn[0].addEventListener("click", function () {
  var sidebar = document.getElementById("sidebar-toggle");
  if (sidebar.classList.contains("active")) {
    sidebar.classList.remove("active");
  } else {
    sidebar.classList.add("active");
  }
});

var Btnsubmenu = document.getElementsByClassName("submenu-trigger");
for (var i = 0; i < Btnsubmenu.length; i++) {
  Btnsubmenu[i].addEventListener("click", function (event) {
    event.preventDefault();
    var submenu = this.parentNode.nextSibling.nextSibling;
    if (submenu.classList.contains("close")) {
      submenu.classList.remove("close");
    } else {
      submenu.classList.add("close");
    }
  });
}

var wordpressBtn = document.getElementsByClassName("bx bxl-wordpress");

wordpressBtn[0].addEventListener("click", function () {
  var sidebar = document.getElementById("sidebar-toggle");
  if (sidebar.classList.contains("hidden")) {
    sidebar.classList.remove("hidden");
  } else {
    sidebar.classList.add("hidden");
  }
});