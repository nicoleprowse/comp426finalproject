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
    renderCurrentUserMessages(user);
    } else {
      console.log("Successful Sign Out!");
    }
  });

}

export const renderCurrentUserMessages = function(user){
    var courses_promise = db.collection("users").doc(user.uid).get().then((doc) => {
        courses_promise = db.collection(doc.data().TYPE).doc(user.uid).get().then((inner_doc) => {
          return inner_doc.data().COURSES;
       }).catch( error => {
        return "error";
       });
       return courses_promise.then((courses) => {
        var root = document.getElementById("root");
        var panel_heading = document.createElement("P")
        panel_heading.className = "panel-heading";
        panel_heading.innerHTML = "Grades";
        root.appendChild(panel_heading);
            for(var i = 0;i<courses.length;i++){
                setTimeout(db.collection("courses").doc(courses[i]).get().then(function(doc) {
                    var courseDiv = document.createElement("DIV");
                    var a = document.createElement("A");
                        a.className = "panel-block is-active title is-4";
                        a.innerHTML = doc.data().DEPARTMENT + " " + doc.data().NUMBER + " --- " + doc.data().SECTION;
                    courseDiv.appendChild(a);
                    try{
                    db.collection("students").doc(user.uid).get().then((inner_doc)=>{
                            var grades_string_array = inner_doc.data()[doc.id+'_grades']
                            console.log(grades_string_array);
                            var b = document.createElement("A");
                            b.className = "panel-block is-active";
                            courseDiv.appendChild(b);
                            var totalPoints = 0;
                            var possiblePoints = 0;
                            for(var j = 0; j<grades_string_array.length; j++){
                                var str = grades_string_array[j];
                                var gradeString = str.split(" ")[0]
                                totalPoints += parseInt(gradeString.split("/")[0])
                                possiblePoints += parseInt(gradeString.split("/")[1])
                                var assignmentName = str.substring(gradeString.length)
                                var a = document.createElement("A");
                                a.className = "panel-block";
                                a.innerHTML = assignmentName + ": " +gradeString
                                courseDiv.appendChild(a);
                            }
                            b.innerHTML = "Course Grade: "+(100*totalPoints/possiblePoints)+"%"
                        });   
                    }catch(e){
                        console.log(e);
                    }
                    root.appendChild(courseDiv);
                }))
            }  
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