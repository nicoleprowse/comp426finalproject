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
    
    } else {
      console.log("Successful Sign Out!");
    }
  });

}

export const renderCourses = function(event){
    event.preventDefault();
    $("#root").append(' <p class="panel-heading">Courses</p><div class="panel-block"><p class="control has-icons-left"><span class="icon is-left"><i class="fas fa-search" aria-hidden="true"></i></span></p></div>');
    db.collection("courses").where("DEPARTMENT", "==", $("#dept").val()).where("NUMBER", ">=", $("#num").val()).get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            var str = '<a class="panel-block is-active"><span class="panel-icon"><i class="fas fa-book" aria-hidden="true"></i></span>';
            str+=doc.data().DEPARTMENT+' '+doc.data().NUMBER+' --- '+doc.data().SECTION+'</a>';
            str+='</br><button class = "add"  id = "'+doc.id+'" type="add"> Add </button> </br>';
            $(".add").on("click",handleAddButtonPress);
            $('#root').append(str);
            console.log(doc.id, " => ", doc.data());
        });
    }).catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}

export const handleAddButtonPress = function(event){
    var e = event;
    e = e || window.event;
    e = e.target || e.srcElement;
    var studentRef = db.collection("students").doc(firebase.auth().currentUser.uid);
    studentRef.get().then((outer_doc)=>{
    var classes = outer_doc.data().COURSES;
    classes.push(e.id);
    console.log(classes);
    console.log(studentRef.update({
        COURSES: classes
    }).then(function() {
        console.log("Document successfully updated!");
    }).catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    }))
});
};

export const renderCurrentUserCourses = function(user){
    var courses_promise = db.collection("users").doc(user.uid).get().then((doc) => {
        courses_promise = db.collection(doc.data().TYPE).doc(doc.id).get().then((inner_doc) => {
          return inner_doc.data().COURSES;
       }).catch( error => {
        return "error";
       });
       return courses_promise.then((courses) => {
        var str = ' <p class="panel-heading">My Courses</p><div class="panel-block"><p class="control has-icons-left"><span class="icon is-left"><i class="fas fa-search" aria-hidden="true"></i></span></p></div>';
            for(var i = 0;i<courses.length;i++){
                courses_promise = db.collection("courses").doc(courses[i]).get().then((inner_doc) => {
                    str = '<a class="panel-block is-active"><span class="panel-icon"><i class="fas fa-book" aria-hidden="true"></i></span>';
                    str+='COMP 301</a>';
                    $('#root').append(str);
                 })
            }
            $('#root').append(str+'</nav>');    
       })
    });
}

export const renderSearchField = function() {
    var str = '';
    str+='<form class = "form" id = "form1" onsubmit = "save.disabled" = true>';
    str+='Department: <input type="text" id = "dept" value =""></br>';
    str+='Greater Than: <input type="number" id = "num" value =""></br>';
    str+='</br><button class = "reg"  id = "reg" type="reg"> Submit </button> </br>';
    str+='</form>';
    $('#root').append(str);
    $(".reg").on("click",renderCourses);
  };

/**
 * Given an array of hero objects, this function converts the data into HTML,
 *     loads it into the DOM, and adds event handlers.
 * @param  heroes  An array of hero objects to load (see data.js)
 */
export const loadIntoDOM = function() {
    // Grab a jQuery reference to the root HTML element
   renderSearchField();
    register_user_listener();
  //  $root.append("<h1>Dynamic Content Here</h1>");
};


/**
 * Use jQuery to execute the loadHeroesIntoDOM function after the page loads
 */
$(function() {
    loadIntoDOM();
});