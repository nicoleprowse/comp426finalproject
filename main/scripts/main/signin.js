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
    alert(errorMessage);
    console.log(errorMessage);
  });
}


export const renderSignUpField = function(event) {
  var str = '';
  str+='<form class = "form" id = "form1" onsubmit = "save.disabled = true">';
  str+='New Email: <input type="text" id = "new-email" value =""></br>';
  str+='New Password: <input type="text" id = "new-password" value =""></br>';
  str+='</br><button class = "signup"  id = "0" type="signup"> Sign Up </button> </br>';
  str+='</form>';
  return str;
};

export const renderSignInField = function(event) {
  var str = '';
  str+='<form class = "form" id = "form1" onsubmit = "save.disabled = true">';
  str+='<div class="field">';
  str+='<div class="control">';
  str+='<input class ="input is-large" type="text" id = "email" placeholder= "Your Email" value ="">';
  str+='</div>';
  str+='</div>';
  str+='<div class="field">';
  str+='<div class="control">';
  str+='<input class ="input is-large" type="text" id = "password" placeholder= "Password" value ="">';
  str+='</div>';
  str+='</div><br>';
  str+='<div>';
  str+='<button class = "signin button is-block is-info is-medium is-fullwidth"  id = "0" type="signin"> Sign In </button><br>';
  str+='</div>';
  str+='</form>';
  return str;
};


export const renderSignOutButton = function(event) {
  var str = '';
  str+='<button class = "button is-block is-outlined is-medium is-fullwidth"  id = "0" type="signout"> Sign Out </button>';
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
      console.log("Successful Sign In: "+user.email);
      console.log("With an uid of: "+user.uid);
      window.location.pathname = '/'
    } else {
      console.log("Successful Sign Out!");
    }
  });

}


function displayUserData(user) {
  db.collection("users").doc(user.uid).get().then((doc) => {
        console.log(`${doc.id} => ${doc.data().DATA.id}`);
        console.log(doc.data().TYPE)
        db.collection(doc.data().TYPE).doc(doc.data().DATA.id).get().then((inner_doc) => {
          console.log(`${inner_doc.id} => ${inner_doc.data().PID}`);
          console.log(inner_doc.data().ONYEN)
       });
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
    $root.append(renderSignInField());
    $root.append(renderSignOutButton());
    $(".signin").on("click",handleUserSignin);
    $(".signout").on("click", handleUserSignout);
    register_user_listener();
  //  $root.append("<h1>Dynamic Content Here</h1>");
};


/**
 * Use jQuery to execute the loadHeroesIntoDOM function after the page loads
 */
$(function() {
    loadIntoDOM();
});