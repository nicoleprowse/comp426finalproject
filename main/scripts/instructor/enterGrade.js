
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


const render_students = function(course){
    $("#students").empty()
    var root = document.getElementById("students")
    var students_div = document.getElementById("students")
    var students_label = document.createElement("LABEL")
    students_label.className = "label"
    students_label.innerHTML = "Students"
    students_div.appendChild(students_label)
    db.collection("students").where("COURSES","array-contains",course).get().then(query=>{
        query.docs.forEach((doc)=>{
            var student_label = document.createElement("LABEL")
            student_label.className = "label"
            student_label.innerHTML = doc.data().NAME
            students_div.appendChild(student_label)
            var grade = document.createElement("INPUT")
            grade.type = "number"
            students_div.appendChild(grade)
            grade.setAttribute("value", doc.id)
            grade.className = "grade";
        })
    })
}


const register_user_listener = function(){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        var info_root = document.getElementById("info-root");
        var examName = document.createElement("TEXTAREA");
        examName.innerHTML = "Enter Assignment Name Here";
        examName.id = "examName";
        var exam_label = document.createElement("LABEL");
        exam_label.className = "label";
        exam_label.innerHTML = "Assignment Name"
        info_root.appendChild(exam_label)
        info_root.appendChild(examName);
        info_root.appendChild(document.createElement("BR"));
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
        courseSelect.onchange = function(e){
            render_students(e.target.value)
        }
        var course_div = document.createElement("DIV");
        course_div.className = "select is-dark is-rounded"
        course_div.appendChild(courseSelect)
        info_root.appendChild(course_div);
        var points_label = document.createElement("LABEL");
        points_label.className = "label";
        points_label.innerHTML = "Total Points"
        info_root.appendChild(points_label)
        var grade = document.createElement("INPUT")
        grade.type = "number"
        info_root.appendChild(grade)
        grade.id = "points"
        var root = document.getElementById("button-root");
        var submitButton = document.createElement("BUTTON");
        submitButton.innerHTML = "Submit Grades";
        submitButton.className = "button is-info is-medium"
        submitButton.onclick = function(){
          var grades = document.getElementsByClassName("grade");
          for(var z=0;z<grades.length;z++){
              var add_string=grades[z].value+'/'+grade.value+" "+examName.value;
              var student_id = grades[z].getAttribute("value");
              db.collection("students").doc(student_id).get().then((doc)=>{
                  var add_array = [add_string];
                  try{
                    add_array = add_array.concat(doc.data()[courseSelect.value+'_grades'])
                  }catch(e){
                    console.log(e)
                  }
                  var studentRef = db.collection("students").doc(student_id);
                  studentRef.update({
                    Course0_grades : add_array
                  });
              })
              console.log(add_string)
          }
        }
        var students_div = document.createElement("DIV");
        students_div.id = "students";
        root.appendChild(students_div);
        var students_label = document.createElement("LABEL")
        students_label.className = "label"
        students_label.innerHTML = "Students"
        students_div.appendChild(students_label)
        root.appendChild(document.createElement("BR"))
        root.appendChild(document.createElement("BR"))
        root.appendChild(submitButton);
        db.collection("instructors").doc(user.uid).get().then((doc) => {
            render_students(doc.data().COURSES[0])
        });
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