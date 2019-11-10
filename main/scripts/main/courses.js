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

export const renderCurrentUserCourses = function(user){
    var courses_promise = db.collection("users").doc(user.uid).get().then((doc) => {
        courses_promise = db.collection(doc.data().TYPE).doc(user.uid).get().then((inner_doc) => {
          return inner_doc.data().COURSES;
       }).catch( error => {
        return "error";
       });
       return courses_promise.then((courses) => {
        var str = ' <p class="panel-heading">My Courses</p><div class="panel-block"><p class="control has-icons-left"><span class="icon is-left"><i class="fas fa-search" aria-hidden="true"></i></span></p></div>';
            for(var i = 0;i<courses.length;i++){
              console.log(courses[i])
                courses_promise = db.collection("courses").doc(courses[i]).get().then((inner_doc) => {
                    str = '<a class="panel-block is-active"><span class="panel-icon"><i class="fas fa-book" aria-hidden="true"></i></span>';
                    str+=inner_doc.data().DEPARTMENT + ' '+inner_doc.data().NUMBER+' --- '+inner_doc.data().SECTION+'</a>';
                    $('#root').append(str);
                 })
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