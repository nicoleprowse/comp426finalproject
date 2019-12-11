
var db = firebase.firestore();
const register_user_listener = function(){
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        renderCurrentUserInfo(user).then((str) => {
          $('#userInfo').append(str);
        });
      } else {
        
      }
    });
  }

export const renderCurrentUserInfo = function(user){
    var str = db.collection("users").doc(user.uid).get().then((doc) => {
        var str = db.collection(doc.data().TYPE).doc(user.uid).get().then((inner_doc) => {
         var str= "<h1> ONYEN: "+inner_doc.data().ONYEN+" Name: "+inner_doc.data().NAME+" PID: "+inner_doc.data().PID+"</h1>";
          return str;
       });
       return str;
    });
    return str;
}

  export const loadIntoDOM = function() {
    // Grab a jQuery reference to the root HTML element
    console.log("Hello World")
    const $userinfo = $('#userinfo');
    register_user_listener();
    var myLink = document.getElementById('mylink')


          mylink.onclick = function(event){
          firebase.auth().signOut().then(function() {
            window.location.pathname = '/app/main/signin.html'
          }).catch(function(error) {
              // An error happened.
          });
          }
  //  $root.append("<h1>Dynamic Content Here</h1>");
};

$(function() {
    loadIntoDOM();
});