
const firebaseConfig = {
    apiKey: "AIzaSyDJ_OfBO9oiI8iFbE83mtYQnmanIGItOWI",
    authDomain: "comp426-final.firebaseapp.com",
    databaseURL: "https://comp426-final.firebaseio.com",
    projectId: "comp426-final",
  };
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();


const submit_new_exam = function(number_questions){
  console.log(number_questions)
}


const render_question_input = function(index){
  var root = document.getElementById("question-root");
  var container = document.createElement("DIV");
  if(index>0)container.appendChild(document.createElement("BR"))
  if(index>0)container.appendChild(document.createElement("BR"))
  container.id = "container"+index;
  var question_label = document.createElement("LABEL");
  question_label.className = "label";
  question_label.innerHTML = "Question " + index
  container.appendChild(question_label)
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
      try{
        var div = document.getElementById("answers"+index);
        container.removeChild(div);
        var k = document.getElementById("cor"+index);
        container.removeChild(k);
        }catch(e){
          console.log(e);
        }
      var div = document.createElement("DIV");
      div.id = "answers"+index;
      div.appendChild(document.createElement("BR"))
      div.appendChild(document.createElement("BR"))
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
      var cont = document.createElement("DIV");
      cont.id = 'cor'+index;
      cont.className = "select is-dark is-rounded"
      var correct = document.createElement("SELECT");
      correct.id = "correct"+index;
      correct.append(new Option("A", "a"));
      correct.append(new Option("B", "b"));
      correct.append(new Option("C", "c"));
      correct.append(new Option("D", "d"));
      var correct_label = document.createElement("LABEL")
      correct_label.className ="label"
      correct_label.innerHTML = "Correct:"
      cont.appendChild(correct_label);
      cont.appendChild(correct);
      container.appendChild(cont);
    }else if(e.target.value=='tf'){
      try{
      var div = document.getElementById("answers"+index);
      container.removeChild(div);
      var k = document.getElementById("cor"+index);
      container.removeChild(cont);
      }catch(e){
        console.log(e);
      }
      container.appendChild(document.createElement("BR"))
      container.appendChild(document.createElement("BR"))
      container.appendChild(document.createElement("BR"))
      var cont = document.createElement("DIV");
      cont.id = 'cor'+index;
      cont.className = "select is-dark is-rounded"
      var correct = document.createElement("SELECT");
      correct.id = "correct"+index;
      correct.append(new Option("T", "t"));
      correct.append(new Option("F", "f"));
      var correct_label = document.createElement("LABEL")
      correct_label.className ="label"
      correct_label.innerHTML = "Correct:"
      cont.appendChild(correct_label);
      cont.appendChild(correct);
      container.appendChild(cont);
    }else{
      try{
        var div = document.getElementById("answers"+index);
        container.removeChild(div);
        var k = document.getElementById("cor"+index);
        container.removeChild(k);
        }catch(e){
          console.log(e);
        }
    }
  };
  var type_div = document.createElement("DIV");
  type_div.className = "select is-dark is-rounded"
  var type_label = document.createElement("DIV")
  type_label.className = "label"
  type_label.innerHTML = "Question Type"
  type_div.appendChild(type_label)
  type_div.appendChild(type)
  container.appendChild(type_div);
  root.appendChild(container);
}


const register_user_listener = function(){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        var info_root = document.getElementById("info-root");
        var examName = document.createElement("TEXTAREA");
        var examTime = document.createElement("INPUT");
        examTime.type = 'datetime-local';
        examName.innerHTML = "Enter Exam Name Here";
        examName.id = "examName";
        var exam_label = document.createElement("LABEL");
        exam_label.className = "label";
        exam_label.innerHTML = "Exam Name"
        info_root.appendChild(exam_label)
        info_root.appendChild(examName);
        info_root.appendChild(document.createElement("BR"));
        var time_label = document.createElement("LABEL");
        time_label.className = "label";
        time_label.innerHTML = "Exam Time"
        info_root.appendChild(time_label);
        info_root.appendChild(examTime);
        var course_label = document.createElement("LABEL");
        course_label.className = "label";
        course_label.innerHTML = "Course"
        info_root.appendChild(course_label)
        var courseSelect = document.createElement("SELECT");
        courseSelect.id = "course";
        db.collection("instructors").doc(user.uid).get().then((doc) => {
          for(var i = 0; i<doc.data().COURSES.length; i++){
            db.collection("courses").doc(doc.data().COURSES[i]).get().then((inner_doc)=>{
              courseSelect.append(new Option(inner_doc.data().DEPARTMENT + " - " + inner_doc.data().NUMBER + " --- " + inner_doc.data().SECTION, inner_doc.id));
            })
          };
        });
        var course_div = document.createElement("DIV");
        course_div.className = "select is-dark is-rounded"
        course_div.appendChild(courseSelect)
        info_root.appendChild(course_div);
        var root = document.getElementById("button-root");
        var i = 1;
        render_question_input(0);
        var submitButton = document.createElement("BUTTON");
        submitButton.innerHTML = "Submit Exam";
        submitButton.onclick = function(){
          var tail = Math.floor(Math.random()*1000000000000000000);
          var aName = 'Assessment'+tail
          var examRef = db.collection("assessments").doc(aName);
          examRef.set({
            COURSE: courseSelect.value,
            DATE: examTime.value,
            NAME: examName.value,
          });
          for(var j = 0; j<i;j++){
            var question = document.getElementById('q'+j).innerHTML;
            var type = document.getElementById('t'+j).value;
            var tail = Math.floor(Math.random()*1000000000000000000);
            var questionRef = db.collection("questions").doc('Question'+tail);
            questionRef.set({
              ASSESSMENT: aName,
              QUESTION: question,
              TYPE: type,
            }, { merge: true });
            if(type!='sa'){
              var correct = document.getElementById('correct'+j).value;
              if(type=='mc'){
                var a = document.getElementById('a'+j).value;
                var b = document.getElementById('b'+j).value;
                var c = document.getElementById('c'+j).value;
                var d = document.getElementById('d'+j).value;
                questionRef.set({
                  A: a,
                  B: b,
                  C: c,
                  D: d,
                }, { merge: true });
              }
              questionRef.set({
                CORRECT: correct,
              }, { merge: true });
            }
          }
        }
        var addQuestionButton = document.createElement("BUTTON");
        addQuestionButton.innerHTML = "Add Question";
        addQuestionButton.onclick = function(){
          render_question_input(i++);
        }
        root.appendChild(document.createElement("BR"))
        root.appendChild(document.createElement("BR"))
        root.appendChild(addQuestionButton)
        var deleteQuestionButton = document.createElement("BUTTON");
        deleteQuestionButton.innerHTML = "Delete Question";
        deleteQuestionButton.onclick = function(){
          var q_root = document.getElementById("question-root");
          i--;
          q_root.removeChild(document.getElementById("container"+i));
        }
        root.appendChild(deleteQuestionButton);
        root.appendChild(submitButton);
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