
const firebaseConfig = {
    apiKey: "AIzaSyDJ_OfBO9oiI8iFbE83mtYQnmanIGItOWI",
    authDomain: "comp426-final.firebaseapp.com",
    databaseURL: "https://comp426-final.firebaseio.com",
    projectId: "comp426-final",
  };
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();


export const renderMessageField = function(event) {
  var str = '';
  str+='<form class = "form" id = "form1" onsubmit = "save.disabled = true">';
  str+='Email: <input type="text" id = "email" value =""></br>';
  str+='Password: <input type="text" id = "password" value =""></br>';
  str+='Course: <select name="course" id = "course"><option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option></select>';
  str+='</br><button class = "submit"  id = "0" type="submit"> Submit </button> </br>';
  str+='</form>';
  return str;
};


export const handleMessageSubmit = function(event){
  event.preventDefault();
  var tail = Math.floor(Math.random()*1000000000000000);
  db.collection("messages").doc("Message"+tail).set({
    COURSE_ID: $("#course").val(),
    TEXT: $("#message").val(),
    TYPE: $("#type").val(),
    DATE: $("#time").val()
})
.then(function() {
    console.log("Document successfully written!");
    document.location.pathname = '/app/instructor/instructorView.html'
})
.catch(function(error) {
    console.error("Error writing document: ", error);
    alert("Error Submitting Message");
});
};


const register_user_listener = function(){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        var str = '';
        str+='<form class = "form" id = "form1" onsubmit = "save.disabled" = true>';
        str+='<div class="field">';
        str+='<div class="control">';
        str+='<label class="label">New Message</label>';
        str+='<input class ="input is-large" type="text" id = "message" value ="" placeholder = "Enter Message"></br>';
        str+='</div>';
        str+='</div>';
        str+='<div class="field">';
        str+='<div class="control" id = "last-div">';
        str+='<label class="label">Day and Time</label>';
        str+='<input class = "input is-large" type="datetime-local" id = "time" placeholder = "Date and Time"></br>';
        str+='<label class="label">Course </label>';
        str+='<div class="select is-dark is-rounded">';
        str+='<select name="type" id = "course"></select>';
        str+='</div>';
        str+='<label class="label">Message Type </label>';
        str+='<div class="select is-dark is-rounded">';
        str+='<select name="type" id = "type"><option value="announcement">Announcement</option><option value="memo">Memo</option></select>';
        str+='</div>';
        str+='</br></br><button class = "reg button is-block is-dark is-medium is-fullwidth"  id = "reg" type="reg"> Submit </button> </br>';
        str+='</form>';
        $('#root').append(str);
        var course_select = document.getElementById("course")
        var k = db.collection("instructors").doc(user.uid).get().then((inner_doc) => {
          for(var i = 0; i<inner_doc.data().COURSES.length; i++){
            course_select.appendChild(new Option(inner_doc.data().COURSES[i],inner_doc.data().COURSES[i]))
          };
          }).catch(function(error){
        console.log(error);
        });
        $(".reg").on("click",handleMessageSubmit);
    } else {
      console.log("Successful Sign Out!");
    }
  });

}





/**
 * 
 * Given an array of hero objects, this function converts the data into HTML,
 *     loads it into the DOM, and adds event handlers.
 * @param  heroes  An array of hero objects to load (see data.js)
 */

export const loadIntoDOM = function() {
    // Grab a jQuery reference to the root HTML element
    const $root = $('#root');
    register_user_listener();
    
  //  $root.append("<h1>Dynamic Content Here</h1>");
};


$(function() {
    loadIntoDOM();
});