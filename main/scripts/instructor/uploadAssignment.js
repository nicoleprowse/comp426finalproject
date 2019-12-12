
const firebaseConfig = {
    apiKey: "AIzaSyDJ_OfBO9oiI8iFbE83mtYQnmanIGItOWI",
    authDomain: "comp426-final.firebaseapp.com",
    databaseURL: "https://comp426-final.firebaseio.com",
    projectId: "comp426-final",
    storageBucket:'gs://comp426-final.appspot.com'
  };
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
var storage = firebase.storage().ref();


const submit_new_exam = function(number_questions){
  console.log(number_questions)
}




const register_user_listener = function(){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        var info_root = document.getElementById("info-root");
        var examName = document.createElement("TEXTAREA");
        examName.className = "input is-large"
        var text  = document.createElement("TEXTAREA");
        text.className = "input is-large"
        text.innerHTML = "Enter Assignment Details Here";
        var examTime = document.createElement("INPUT");
        var file = document.createElement("INPUT");
        file.type = "file";
        file.innerHTML = "Select a File";
        file.id = 'file-input';
        examTime.type = 'datetime-local';
        examName.innerHTML = "Enter Assignment Name Here";
        examName.id = "examName";
        var name_label = document.createElement("LABEL");
        name_label.className = "label";
        name_label.innerHTML = "Assignment Name"
        info_root.appendChild(name_label)
        info_root.appendChild(examName);
        info_root.appendChild(document.createElement("BR"));
        var text_label = document.createElement("LABEL");
        text_label.className = "label";
        text_label.innerHTML = "Assignment Details"
        info_root.appendChild(text_label)
        info_root.appendChild(text);
        info_root.appendChild(document.createElement("BR"));
        var file_label = document.createElement("LABEL");
        file_label.className = "label";
        file_label.innerHTML = "File"
        info_root.appendChild(file_label)
        info_root.appendChild(file);
        info_root.appendChild(document.createElement("BR"));
        var time_label = document.createElement("LABEL");
        time_label.className = "label";
        time_label.innerHTML = "Assignment Time"
        info_root.appendChild(time_label)
        info_root.appendChild(examTime);
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
        var course_div = document.createElement("DIV");
        course_div.className = "select is-dark is-rounded"
        course_div.appendChild(courseSelect)
        info_root.appendChild(course_div);
        var button = document.createElement("BUTTON");
        button.innerHTML = "Upload Assignment";
        button.className = "button is-round is-info is-medium"
        info_root.appendChild(document.createElement("BR"));
        info_root.appendChild(document.createElement("BR"));
        info_root.appendChild(button);
        button.onclick = function(){
            var tail = Math.floor(Math.random()*1000000000000000000);
            var assignmentName = 'Assignment'+tail;
            var assignmentRef = db.collection("assignments").doc(assignmentName);
            assignmentRef.set({
              ASSIGNMENT_NAME:examName.value,
              DATE: examTime,
              COURSE_ID: courseSelect.value,
              TEXT: text.value,
            }, { merge: true });
            var fileToUpload = $('#file-input').prop('files')[0];
            storage.child('Assignments_'+courseSelect.value+'/'+assignmentName).put(fileToUpload).then(function(e){
                console.log("Success!")
            }).catch(function(e){
                console.log(e)
            });
        };
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