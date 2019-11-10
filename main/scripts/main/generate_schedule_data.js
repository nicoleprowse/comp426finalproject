const fs = require('fs');
const pdf = require('pdf-parse');
const firebase = require('firebase/app');
require('firebase/firestore')

let dataBuffer = fs.readFileSync('UNC_data.pdf');
var index = 1;
const firebaseConfig = {
    apiKey: "AIzaSyDJ_OfBO9oiI8iFbE83mtYQnmanIGItOWI",
    authDomain: "comp426-final.firebaseapp.com",
    databaseURL: "https://comp426-final.firebaseio.com",
    projectId: "comp426-final",
  };
  firebase.initializeApp(firebaseConfig);
  var db = firebase.firestore();
 
pdf(dataBuffer).then(function(data) {
 
    // number of pages
    //console.log(data.numpages);
    // PDF text
    //console.log(data.text.substring(300,600)); 
    var cont = true;
    var i = 290;
    var pageIndeces = [];
    while(cont){
        if(data.text.substring(i,i+14) == "TitleComponent"){
            pageIndeces.push(i);
            //console.log(data.text.substring(i+183,i+200));
        }
        i = i+1;
        if(i>=100000)cont = false;
    }
    for(var j = 0; j<pageIndeces.length-1;j++){
        parsePage(data.text.substring(pageIndeces[j],pageIndeces[j+1]));
    }   
});

const parsePage = function(page){
    var cont = true;
    var i = 0;
    var classIndeces = [];
    while(cont){
        if(page.charAt(i) == '_'&&page.charAt(i+1)!='_')classIndeces.push(i+1);
        i = i+1
        if(i>=page.length-1)cont = false;
    }
    var classes = [];
    for(var j = 0; j<classIndeces.length-1;j++){
        classes.push(parseClass(page.substring(classIndeces[j],classIndeces[j+1])));
    }
    return classes;
}

const parseClass = function(cl){
    var cont = true;
    var i = 0;
    var classIndeces = [];
    while(cont){
        if(cl.charAt(i).toUpperCase() != cl.charAt(i).toLowerCase())cont = false
        i = i+1
        if(i>=cl.length-1)cont = false;
    }
    i = i-1;
    var dept = cl.substring(i,i+4);
    i = i+5;
    var num = cl.substring(i,i+3);
    i = i+3;
    if(cl.charAt(i).toUpperCase() != cl.charAt(i).toLowerCase()){
        num = num + cl.charAt(i);
        i = i+1
    }
    var sect = cl.substring(i,i+3);
    i = i+3;
    cont = true;
    var type = "not found";
    var j = 0;
    while(cont){
        i = i+1;
        j = j+1;
        if(cl.charAt(i)=='L'||cl.charAt(i)=='R'){
            if(cl.substring(i,i+10)=="Recitation"){
                type = "Recitation";
                cont = false;
                i = i+10;
            }
            if(cl.substring(i,i+7)=="Lecture"){
                type = "Lecture";
                cont = false;
                i = i+7;
            }
        }
        if(j>100){
            cont = false;
        }
    }
    if(type=="not found"){
        return null
    }
    var hours = cl.charAt(i);
    i = i+1;
    var startDays;
    var split;
    var endTime;
    cont = true;
    j = 0;
    while(cont){
        i = i+1;
        j = j+1;
        if(cl.charAt(i)=='D'){
            if(cl.substring(i,i+5)=="Days:"){
                cont = false;
                i = i+5;
                startDays = i;
            }
        }
        if(j>100){
            cont = false;
        }
    }
    cont = true;
    j = 0;
    while(cont){
        i = i+1;
        j = j+1;
        if(cl.charAt(i)=='T'){
            if(cl.substring(i,i+5)=="Time:"){
                cont = false;
                split = i;
                i = i+5;
            }
        }
        if(j>100){
            cont = false;
        }
    }
    j = 0;
    cont = true;
    while(cont){
        i = i+1;
        j = j+1;
            if(cl.charAt(i)<'0'||cl.charAt(i)>'9'){
                if(cl.charAt(i+1)<'0'||cl.charAt(i+1)>'9'){
                    if(cl.charAt(i+2)<'0'||cl.charAt(i+2)>'9'){
                            cont = false;
                            endTime = i;
                    }
                }
            }
        if(j>100){
            cont = false;
        }
    }
    var days = cl.substring(startDays,split);
    var time = cl.substring(split+5,endTime+8);
    if(cl.charAt(split+5)<'0'||cl.charAt(split+5)>'9'){
        time = "TBA";
    }
    db.collection("courses").doc("Course"+index).set({
        DEPARTMENT: dept,
        NUMBER: num,
        SECTION: sect,
        HOURS: hours,
        TYPE: type,
        HOURS: hours,
        DAYS:days
    })
    .then(function() {
        console.log("Document successfully written!");
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });
    index = index +1;
    console.log(dept, " ", num, "-",sect," Hours: ",hours,"   ", type,"   Days: ", days,"   Time: ", time);
    return cl.substring(i)
}