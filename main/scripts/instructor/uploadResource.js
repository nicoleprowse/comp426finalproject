
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


const render_question_input = function(index){
  var root = document.getElementById("question-root");
  var container = document.createElement("DIV");
  container.id = "container"+index;
  var question = document.createElement("TEXTAREA");
  question.innerHTML = "Enter Question "+ index + " here"
  question.id = "q"+index;
  container.appendChild(question);
  container.appendChild(document.createElement("BR"));
  root.appendChild(container);
}


const register_user_listener = function(){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        var info_root = document.getElementById("info-root");
        var examName = document.createElement("TEXTAREA");
        var file = document.createElement("INPUT");
        file.type = "file";
        file.innerHTML = "Select a File";
        file.id = 'file-input';
        examName.innerHTML = "Enter Resource Name Here";
        examName.id = "resourceName";
        info_root.appendChild(examName);
        info_root.appendChild(document.createElement("BR"));
        info_root.appendChild(file);
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
        var button = document.createElement("BUTTON");
        button.innerHTML = "Upload Resource";
        info_root.appendChild(document.createElement("BR"));
        info_root.appendChild(button);
        button.onclick = function(){
            var fileToUpload = $('#file-input').prop('files')[0];
            storage.child(courseSelect.value+'/'+examName.value).put(fileToUpload).then(function(e){
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