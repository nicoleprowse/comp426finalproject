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
        panel_heading.innerHTML = "Resources";
        root.appendChild(panel_heading);
            for(var i = 0;i<courses.length;i++){
                db.collection("courses").doc(courses[i]).get().then(function(doc) {
                    var a = document.createElement("A");
                        a.className = "panel-block is-active title is-4";
                        a.innerHTML = doc.data().DEPARTMENT + " " + doc.data().NUMBER + " --- " + doc.data().SECTION;
                        root.appendChild(a);
                });
                db.collection("documents").doc(courses[i]).get().then( function(doc){
                    try{
                        var docsArray = doc.data().DOCUMENTS;
                        for(var j = 0; j<docsArray.length;j++){
                            var a = document.createElement("A");
                            a.className = "panel-block is-active";
                            a.innerHTML = docsArray[j];
                            root.appendChild(a);
                            var button = document.createElement("BUTTON");
                            button.innerHTML = "Download";
                            button.id = docsArray[j];
                            root.appendChild(button);
                            //TODO Fix downloads
                            button.onclick = function(){
                                storage.child(doc.id+'/'+button.id).getDownloadURL().then(function(url) {
                                    url = "https://firebasestorage.googleapis.com/v0/b/comp426-final.appspot.com/o/Course0%2FCOMP426%20Final%20Project%20Proposal.pdf?alt=media&token=2aa4b51e-ad68-43eb-9b9f-62ed817d304a"
                                    window.open(url, '_blank');
                                   console.log(url);
                                  }).catch(function(error) {
                                    console.log(error);
                                  });
                            };
                            console.log(root);
                        }
                    }catch(e){
                        console.log("No Documents For "+doc.id);
                        console.log(e)
                    }
                });
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