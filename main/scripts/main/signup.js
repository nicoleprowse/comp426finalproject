const firebaseConfig = {
    apiKey: "AIzaSyDJ_OfBO9oiI8iFbE83mtYQnmanIGItOWI",
    authDomain: "comp426-final.firebaseapp.com",
    databaseURL: "https://comp426-final.firebaseio.com",
    projectId: "comp426-final",
  };
  firebase.initializeApp(firebaseConfig);
  var db = firebase.firestore();


export const signUpUser = function(email, password){
  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorMessage);
  });
}


export const signInUser = function(email, password){
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorMessage);
  });
}


export const renderSignUpField = function(event) {
  var str = '';
  str+='<form class = "form" id = "form1" onsubmit = "save.disabled = true">';
  str+='</br> <p class = "subtitle has-text-black">Enter the following information:</p>';
  str+='<input class = "input is-medium" type="text" id = "new-email" placeholder = "Email" value =""></br></br>';
  str+='<input class = "input is-medium" type="text" id = "new-password" placeholder = "Password" value =""></br></br>';
  str+='<input class = "input is-medium" type="text" id = "new-name" placeholder = "Name" value =""></br></br>';
  str+='<input class = "input is-medium" type="text" id = "new-onyen" placeholder = "Onyen" value =""></br></br>';
  str+='<input class = "input is-medium" type="text" id = "new-pid" placeholder = "PID" value =""></br></br>';
  str+='<div class="select is-info is-rounded">';
  str+='<select name="type" id = "type"><option value="student">Student</option><option value="instructor">Instructor</option></select>';
  str+='</div>';
  str+='</br></br><button class = "signup button is-block is-info is-medium is-fullwidth"  id = "0" type="signup"> Sign Up </button> </br>';
  str+='</form>';
  return str;
};

export const renderSignInField = function(event) {
  var str = '';
  str+='<form class = "form" id = "form1" onsubmit = "save.disabled = true">';
  str+='Email: <input type="text" id = "email" value =""></br>';
  str+='Password: <input type="text" id = "password" value =""></br>';
  str+='</br><button class = "signin"  id = "0" type="signin"> Sign In </button> </br>';
  str+='</form>';
  return str;
};


export const renderSignOutButton = function(event) {
  var str = '';
  str+='</br><button class = "signout"  id = "0" type="signout"> Sign Out </button> </br>';
  return str;
};

export const handleUserSignin = function(event){
  event.preventDefault();
  signInUser($("#email").val(), $("#password").val());
  console.log("Sign In: " + $("#email").val());
}

export const handleUserSignup = function(event){
  event.preventDefault();
  signUpUser($("#new-email").val(), $("#new-password").val());
  console.log("Registration: " + $("#new-email").val());
  console.log($("#type").val())
}

export const handleUserSignout = function(event){
  firebase.auth().signOut().then(function() {
    //Success
  }).catch(function(error) {
    // An error happened.
  });
}

const register_user_listener = function(){
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
      } else {
        console.log("Successful Sign Out!");
      }
    });
  
  }



/**
 * Given an array of hero objects, this function converts the data into HTML,
 *     loads it into the DOM, and adds event handlers.
 * @param  heroes  An array of hero objects to load (see data.js)
 */
export const loadIntoDOM = function() {
    // Grab a jQuery reference to the root HTML element
    const $root = $('#root');
    $root.append(renderSignUpField());
    $(".signup").on("click",handleUserSignup);
    handleUserSignout();
    register_user_listener();
  //  $root.append("<h1>Dynamic Content Here</h1>");
};


/**
 * Use jQuery to execute the loadHeroesIntoDOM function after the page loads
 */
$(function() {
    loadIntoDOM();
});