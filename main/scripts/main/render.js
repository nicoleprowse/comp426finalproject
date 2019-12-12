
const firebaseConfig = {
  apiKey: "AIzaSyDJ_OfBO9oiI8iFbE83mtYQnmanIGItOWI",
  authDomain: "comp426-final.firebaseapp.com",
  databaseURL: "https://comp426-final.firebaseio.com",
  projectId: "comp426-final",
};
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();




export const renderMCQuestionEntry = function() {
  var str = '';
  str+='<form class = "form" id = "form1" onsubmit = "save.disabled = true">';
  str+='Question: <input type="text" id = "question" value =""></br>';
  str+='Answer A): <input type="text" id = "A" value =""></br>';
  str+='Answer B): <input type="text" id = "B" value =""></br>';
  str+='Answer C): <input type="text" id = "C" value =""></br>';
  str+='Answer D): <input type="text" id = "D" value =""></br>';
  str+='Correct Answer: </br>'
  str+='<select name="answer" id = "answer"><option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option></select>';
  str+='</br><button class = "submit"  id = "0" type="submit"> Save </button> </br>';
  str+='</form>';
  $(".submit").on("click",handleMCQuestionSubmit);;
  return str;
};


const register_user_listener = function(){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      $("#root").empty();
      
      console.log("Successful Sign In: "+user.email);
      console.log("With an uid of: "+user.uid);
    } else {
      $("#root").empty();
      console.log("Successful Sign Out!");
    }
  });
  

}

export const handleMCQuestionSubmit = function(event) {
  var j = {};
  event.preventDefault();
  const $root = $('#root');
  j.question = $("#question").val();
  j.A = $("#A").val();
  j.B = $("#B").val();
  j.C = $("#C").val();
  j.D = $("#D").val();
  j.answer = $("#answer").val();
  data.push(j);
  console.log(j);
  $(".form").detach();
  displayUserData(firebase.auth().currentUser);
  $root.append("<h1>"+j.A+j.B+j.C+j.D+j.answer+"</h1>");
};


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
    register_user_listener();
  //  $root.append("<h1>Dynamic Content Here</h1>");
};


/**
 * Use jQuery to execute the loadHeroesIntoDOM function after the page loads
 */
$(function() {
    loadIntoDOM();
});
