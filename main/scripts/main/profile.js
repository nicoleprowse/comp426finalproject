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
    renderCurrentUserProfile(user);
    } else {
      console.log("Successful Sign Out!");
    }
  });

}


export const renderCurrentUserProfile = function(user){
    var root = document.getElementById("root");
    db.collection("users").doc(user.uid).get().then((doc)=> {
        var header = document.createElement("A");
        header.className = "panel-block is-active";
        if (doc.data().TYPE == "students"){
            header.innerHTML = "Student Profile";
        }else{
            header.innerHTML = "Instructor Profile";
        }
        root.appendChild(header);
        db.collection(doc.data().TYPE).doc(user.uid).get().then((inner_doc)=> {
            var email = document.createElement("A");
            email.className = "panel-block is-active";
            email.innerHTML = "Email: "+user.email;
            root.appendChild(email);
            var onyen = document.createElement("A");
            onyen.className = "panel-block is-active";
            onyen.innerHTML = "Onyen: "+inner_doc.data().ONYEN;
            root.appendChild(onyen);
            var pid = document.createElement("A");
            pid.className = "panel-block is-active";
            pid.innerHTML = "PID: "+inner_doc.data().PID;
            root.appendChild(pid);
        })
    })
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