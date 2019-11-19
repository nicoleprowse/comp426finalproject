const firebaseConfig = {
    apiKey: "AIzaSyDJ_OfBO9oiI8iFbE83mtYQnmanIGItOWI",
    authDomain: "comp426-final.firebaseapp.com",
    databaseURL: "https://comp426-final.firebaseio.com",
    projectId: "comp426-final",
  };
  firebase.initializeApp(firebaseConfig);
  var db = firebase.firestore();




const register_user_listener = function(){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
    renderCurrentUserCourses(user);
    } else {
      console.log("Successful Sign Out!");
    }
  });

}

const renderExam = function(examID){
  db.collection("assessments").doc(examID).get().then(function(doc) {
    var root = document.getElementById("root");
    var a = document.createElement("A");
    a.className = "panel-block is-active";
    a.innerHTML = doc.data().NAME;
    root.appendChild(a);
    db.collection("questions").where("ASSESSMENT","==",doc.id).get().then(function(querySnapshot) {
        querySnapshot.forEach(function(inner_doc) {
            var str = '<a class="panel-block is-active"><span class="panel-icon"><i class="fas fa-book" aria-hidden="true"></i></span>';
            str+=inner_doc.data().QUESTION+'</a>';
            $('#root').append(str);
            switch(inner_doc.data().TYPE) {
                case 'mc':
                str = '<a class="panel-block is-active"><span class="panel-icon"><i class="fas fa-book" aria-hidden="true"></i></span>';
                str+='A) '+inner_doc.data().A+'</a>';
                str += '<a class="panel-block is-active"><span class="panel-icon"><i class="fas fa-book" aria-hidden="true"></i></span>';
                str+='B) '+inner_doc.data().B+'</a>';
                str += '<a class="panel-block is-active"><span class="panel-icon"><i class="fas fa-book" aria-hidden="true"></i></span>';
                str+='C) '+inner_doc.data().C+'</a>';
                str += '<a class="panel-block is-active"><span class="panel-icon"><i class="fas fa-book" aria-hidden="true"></i></span>';
                str+='D) '+inner_doc.data().D+'</a>';
                 $('#root').append(str);
                 var select = document.createElement("SELECT");
                 select.append(new Option("A", "A"));
                 select.append(new Option("B", "B"));
                 select.append(new Option("C", "C"));
                 select.append(new Option("D", "D"));
                 select.id = inner_doc.id;
                 $('#root').append(select);
                  break;
                case 'tf':
                  var root = document.getElementById("root");
                  var select = document.createElement("SELECT");
                  select.append(new Option("True", "T"));
                  select.append(new Option("False", "F"));
                  select.id = inner_doc.id;
                  root.appendChild(select);
                  break;
                case 'sa':
                  var root = document.getElementById("root");
                  var textArea = document.createElement("TEXTAREA");
                  textArea.id = inner_doc.id;
                  root.appendChild(textArea);
                  break;
                default:
                  console.log("Error with Question");
                  break;
              }
        });
    });
    setTimeout(function(){
      var root = document.getElementById("root");
      var submit = document.createElement("BUTTON");
      submit.innerHTML = "Submit Exam";
      $("#root").append("</br>");
      root.appendChild(submit);
      var tail = Math.floor(Math.random()*1000000000000000);
      var ref =  db.collection("assessment_submissions").doc("Submission"+tail);
      submit.onclick = function(){
       ref.set({
          STUDENT: firebase.auth().currentUser.uid,
          ASSESSMENT: examID,
      })
      .then(function() {

      })
      .catch(function(error) {
          console.error("Error writing document: ", error);
      });
        db.collection("questions").where("ASSESSMENT","==",examID).get().then(function(querySnapshot) {
          querySnapshot.forEach(function(inner_doc) {
            var answer = document.getElementById(inner_doc.id).value;
            if(inner_doc.data().TYPE == 'mc'||inner_doc.data().TYPE=='tf'){
              var q = inner_doc.id + "_score";
              var MC_DATA = new Object();
              MC_DATA[q] = Number(inner_doc.data().CORRECT == answer);
              ref.set({MC_DATA}, { merge: true });
              console.log(Number(inner_doc.data().CORRECT == answer));
            }else{
              var q = inner_doc.data().QUESTION;
              var SA_DATA = new Object();
              SA_DATA[q] = answer
              ref.set({SA_DATA}, { merge: true });
              console.log("Left to Grade: "+inner_doc.data().QUESTION);
            }
          });
        });
      }
  }, 2000);
});
}

export const renderCurrentUserCourses = function(user){
    var courses_promise = db.collection("users").doc(user.uid).get().then((doc) => {
        courses_promise = db.collection(doc.data().TYPE).doc(user.uid).get().then((inner_doc) => {
          return inner_doc.data().COURSES;
       }).catch( error => {
        return "error";
       });
       return courses_promise.then((courses) => {
        var str = ' <p class="panel-heading">Exams</p><div class="panel-block"><p class="control has-icons-left"><span class="icon is-left"><i class="fas fa-search" aria-hidden="true"></i></span></p></div>';
            for(var i = 0;i<courses.length;i++){
                db.collection("assessments").where("COURSE","==",courses[i]).get().then(function(querySnapshot) {
                  querySnapshot.forEach(function(doc) {
                    str = '<a class="panel-block is-active" id = "'+doc.data().NAME+'"><span class="panel-icon"><i class="fas fa-book" aria-hidden="true"></i></span>';
                    str+=doc.data().NAME+'</a>';
                    $('#root').append(str);
                    var a = document.getElementById(doc.data().NAME);
                    var button = document.createElement("BUTTON");
                    button.innerHTML = "Take Exam";
                    button.setAttribute("value", doc.id);
                    button.onclick = (e) => {
                      var root = document.getElementById("root");
                      $("#root").empty();
                      renderExam(e.target.value);
                    };
                    a.appendChild(button);
                });
                });
            }
            $('#root').append(str+'</nav>');    
       })
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
    register_user_listener();
  //  $root.append("<h1>Dynamic Content Here</h1>");
};


/**
 * Use jQuery to execute the loadHeroesIntoDOM function after the page loads
 */
$(function() {
    loadIntoDOM();
});