
const firebaseConfig = {
    apiKey: "AIzaSyDJ_OfBO9oiI8iFbE83mtYQnmanIGItOWI",
    authDomain: "comp426-final.firebaseapp.com",
    databaseURL: "https://comp426-final.firebaseio.com",
    projectId: "comp426-final",
  };
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();


const render_question_input = function(index){
  var root = document.getElementById("question-root");
  var container = document.createElement("DIV");
  container.id = "container"+index;
  var question = document.createElement("TEXTAREA");
  question.innerHTML = "Enter Question "+ index + " here"
  question.id = "q"+index;
  container.appendChild(question);
  container.appendChild(document.createElement("BR"));
  var type = document.createElement("SELECT");
  type.id = "t"+index;
  type.append(new Option("Short Answer", "sa"));
  type.append(new Option("Multiple Choice", "mc"));
  type.append(new Option("True/False", "tf"));
  type.onchange = function(e){
    if(e.target.value == 'mc'){
      var div = document.createElement("DIV");
      div.id = "answers"+index;
      var a = document.createElement("TEXTAREA")
      a.innerHTML = "Enter Answer Choice A Here";
      a.id = "a"+index;
      div.appendChild(a);
      div.appendChild(document.createElement("BR"));
      var b = document.createElement("TEXTAREA")
      b.innerHTML = "Enter Answer Choice B Here";
      b.id = "b"+index;
      div.appendChild(b);
      div.appendChild(document.createElement("BR"));
      var c = document.createElement("TEXTAREA")
      c.innerHTML = "Enter Answer Choice C Here";
      c.id = "c"+index;
      div.appendChild(c);
      div.appendChild(document.createElement("BR"));
      var d = document.createElement("TEXTAREA")
      d.innerHTML = "Enter Answer Choice D Here";
      d.id = "d"+index;
      div.appendChild(d);
      container.appendChild(div);
    }else{
      var div = document.getElementById("answers"+index);
      container.removeChild(div);
    }
  };
  container.appendChild(type);
  root.appendChild(container);
}


const register_user_listener = function(){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        var info_root = document.getElementById("info-root");
        var examName = document.createElement("TEXTAREA");
        examName.innerHTML = "Enter Exam Name Here"
        examName.id = "examName";
        info_root.appendChild(examName);
        info_root.appendChild(document.createElement("BR"));
        var courseSelect = document.createElement("SELECT");
        courseSelect.id = "course";
        db.collection("instructors").doc(user.uid).get().then((doc) => {
          for(var i = 0; i<doc.data().COURSES.length; i++){
            db.collection("courses").doc(doc.data().COURSES[i]).get().then((inner_doc)=>{
              courseSelect.append(new Option(inner_doc.data().DEPARTMENT + " - " + inner_doc.data().NUMBER + " --- " + inner_doc.data().SECTION, inner_doc.id));
            })
          };
        });
        info_root.appendChild(courseSelect);
        var root = document.getElementById("button-root");
        var i = 1;
        render_question_input(0);
        var addQuestionButton = document.createElement("BUTTON");
        addQuestionButton.innerHTML = "Add Question";
        addQuestionButton.onclick = function(){
          render_question_input(i++);
        }
        root.appendChild(addQuestionButton)
        var deleteQuestionButton = document.createElement("BUTTON");
        deleteQuestionButton.innerHTML = "Delete Question";
        deleteQuestionButton.onclick = function(){
          var q_root = document.getElementById("question-root");
          i--;
          q_root.removeChild(document.getElementById("container"+i));
        }
        root.appendChild(deleteQuestionButton);
    } else {
      console.log("Successful Sign Out!");
    }
  });

}






export const loadIntoDOM = function() {
    // Grab a jQuery reference to the root HTML element
    register_user_listener();
};


$(function() {
    loadIntoDOM();
});