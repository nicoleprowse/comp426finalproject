
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
        var root = document.getElementById("side-panel");
        var panel_heading = document.createElement("P")
        panel_heading.className = "panel-heading";
        panel_heading.innerHTML = "Upcoming";
        root.appendChild(panel_heading);
            for(var i = 0;i<courses.length;i++){
                    db.collection("assignments").where("COURSE_ID","==",courses[i]).get().then((query)=>{
                        query.forEach(element => {
                            var a = document.createElement("A");
                            a.className = "panel-block is-active";
                            a.innerHTML = element.data().ASSIGNMENT_NAME;
                            root.appendChild(a);
                            var b = document.createElement("A");
                            b.className = "panel-block is-active";
                            var date = element.data().DATE.toDate();
                            b.innerHTML = date.toLocaleString();
                            root.appendChild(b);
                        });
                    })
                    db.collection("assessments").where("COURSE","==",courses[i]).get().then((query)=>{
                      query.forEach(element => {
                          var a = document.createElement("A");
                          a.className = "panel-block is-active";
                          a.innerHTML = element.data().NAME;
                          root.appendChild(a);
                          var b = document.createElement("A");
                          b.className = "panel-block is-active";
                          root.appendChild(b);
                          try{
                            var date = element.data().DATE.toDate();
                            b.innerHTML = date.toLocaleString();
                          }catch(e){
                            var date = new Date(Date.parse(element.data().DATE))
                            b.innerHTML = date.toLocaleString();
                          }

                      });
                  })
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