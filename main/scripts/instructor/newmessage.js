
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
    TYPE: $("#type").val()
})
.then(function() {
    console.log("Document successfully written!");
})
.catch(function(error) {
    console.error("Error writing document: ", error);
});
};


const register_user_listener = function(){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        var str = '';
        str+='<form class = "form" id = "form1" onsubmit = "save.disabled" = true>';
        str+='Message: <input type="text" id = "message" value =""></br>';
        str+='Day and Time: <input type="datetime-local" id = "time"></br>';
        var k = db.collection("instructors").doc(user.uid).get().then((inner_doc) => {
            var str = 'Course: <select name="course" id = "course">';
              for(var i = 0; i<inner_doc.data().COURSES.length; i++){
                str+='<option value="'+inner_doc.data().COURSES[i]+'">'+inner_doc.data().COURSES[i]+'</option>'
              };
              str +='</select>';
              $('#root').append(str);
        }).catch(function(error){
            console.log(error);
        });
        str+='Type: <select name="type" id = "type"><option value="announcement">Announcement</option><option value="memo">Memo</option></select>';
        str+='</br><button class = "reg"  id = "reg" type="reg"> Submit </button> </br>';
        str+='</form>';
        $('#root').append(str);
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
    $(".0").on("click",handleMessageSubmit);
    register_user_listener();
    
  //  $root.append("<h1>Dynamic Content Here</h1>");
};


$(function() {
    loadIntoDOM();
});