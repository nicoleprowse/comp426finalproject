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
                  break;
                default:
                  break;
              }
        });
    });
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