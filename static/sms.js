$.when(
    $.getScript( "https://www.gstatic.com/firebasejs/4.1.2/firebase.js" ),
    $.Deferred(function( deferred ){
        $( deferred.resolve );
    })
).done(function(){
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyC9vpBfsZbCtsIMvvimJy1n3FMfmc90N4s",
    authDomain: "rpoint-22019.firebaseapp.com",
    databaseURL: "https://rpoint-22019.firebaseio.com",
    projectId: "rpoint-22019",
    storageBucket: "rpoint-22019.appspot.com",
    messagingSenderId: "425524786368"
  };
  firebase.initializeApp(config);

  var database=firebase.database();

  window.onload = function () {
    var path = window.location.pathname;
    if(path=="/send_sms_to") {
        chackAllActiveUsersAndSendSMS();
        //test_loop();
      }
  }


  var send= function(phoneNumberList,URL){
    console.log("send function");
    $.ajax({
      type: 'post',
      url: URL, //TODO change for deployed version
      data: {'phoneNumberList':JSON.stringify(phoneNumberList)},
      // dataType: 
      async: false,
      success: function (response) {
          console.log(response);
      }
    }).done(function (data) {
        console.log(data);
    });

  }
  //send({'firstPhoneNumber':"5"},"http://127.0.0.1:5000/send_sms");

  // run thrue all users. chack if they shuld stay active and send SMS if needed
  
  function chackAllActiveUsersAndSendSMS(){
    var phoneNumbersListFirstSms=[];
    var phoneNumbersListSecondSms=[];
    var TestRef = database.ref("Tests/Count");
    var Count;
    var i=0;
    var isCountHappend=false;
    TestRef.once('value').then(function(snapshot) {
      var TestData = snapshot.val();
      Count = TestData;
      Count=Number(Count);
      console.log(Count);
      var now =currentTime();
      console.log(typeof(now));
      var Test=database.ref("Tests")
      Test.once('value').then(function(snapshot){
        //send first SMS to users who just used breathalyzer
        //console.log();
        //snapshot.filter(function(childSnapshot){
          //TODO filter out child snapshots who have received a text

        //   var key = childSnapshot.key;
        //   console.log(key);
        //   if(key=="Count"){
        //     console.log("key is Count");
        //   }
        //   return true;
        // }).map(function(childSnapshot){
        //   //TODO get phone number and return it
        // });
        //feed above list into your send function

        snapshot.forEach(function(childSnapshot) {
      // key will be "ada" the first time and "alan" the second time
          var key = childSnapshot.key;
          console.log(key);
          if(key=="Count"){
            console.log("key is Count");
            isCountHappend=true;
          }
        // childData will be the actual contents of the child
          else {
            console.log("key is "+key );
            var TestData=snapshot.val();
            console.log(TestData[key]);
            console.log(TestData[key].status);
            if(TestData[key].sms==0){
              sendFirstSms(phoneNumbersListFirstSms,TestData[key]);
            }
            if(TestData[key].status=="active"){
              console.log("here");
              var endOfAlcoholEffect=timeOfSober(TestData[key]);
              console.log(endOfAlcoholEffect);
              console.log(TestData[key].status);
              if(isActive(endOfAlcoholEffect,now,TestData[key])){
                console.log(TestData[key].status); 
                sendSecoundSms(phoneNumbersListSecondSms,endOfAlcoholEffect,now,TestData[key]);
              }
            }
            i++;
            console.log("i is "+i);
            
            }
          if(i==Count&&isCountHappend){
            //send phone numbers list
            console.log("finished");
            console.log(phoneNumbersListFirstSms);
            // send(phoneNumbersListFirstSms,"http://127.0.0.1:5000/get_first_phone_number_list");
            // send(phoneNumbersListFirstSms,"http://127.0.0.1:5000/get_second_phone_number_list");
            send(phoneNumbersListFirstSms,"http://rpoint-sms.herokuapp.com/get_first_phone_number_list");
            send(phoneNumbersListFirstSms,"http://rpoint-sms.herokuapp.com/get_second_phone_number_list");
          }
          
        });


      });
    });
  }
  console.log('hope that forEAch is done')
     
  function test_loop(){
    var Test=database.ref("Tests")
    Test.once('value').then(function(snapshot){
      snapshot.forEach(function(childSnapshot) {
        // key will be "ada" the first time and "alan" the second time
        var key = childSnapshot.key;
        if(key=="Count")console.log("test loop count");
        // childData will be the actual contents of the child
        else console.log(key);
        
      });
    });
  }
  

  //return the time when the user will be sober 
  function timeOfSober(Test){
    console.log("timeOfSoberFunction");
    //var Test=database.ref("Tests/"+id)
    //Test.once('value').then(function(snapshot){
     // TestData=snapshot.val();
      var TestData=Test;
      console.log(TestData);
      var estimatedTime=TestData.estimatedTime;
      console.log("estimated time "+estimatedTime);
      var timeOfTest=TestData.timeOfTest;
      timeOfTest=Number(timeOfTest);
      //the time when the person will get sober
      var timeOfSober=estimatedTime+timeOfTest;
      console.log(timeOfSober+" sober");
      return timeOfSober

    //});
      
  }
    
  
    //return current time
    function currentTime(){
      var now=new Date();
      now=now.getTime();
      console.log(now+"now");
      //now=Number(now);
      return now;
    }

    //chack if the user shuld be active. if yes return true, else return false
  function isActive(timeOfSober, currentTime, Test){
    console.log("here");
    console.log(timeOfSober);
    console.log(typeof(timeOfSober));
    console.log(typeof(currentTime));
    var timeLeft=timeOfSober-currentTime;
    console.log(timeOfSober+"-"+currentTime);
    console.log(timeLeft);
    if(timeLeft+15*60000<0){
       console.log(Test);
       changeToInactive(Test);
       console.log("inactive");
      return false;
    }
    return true;
  }


  function changeToInactive(Test) {
    var sAge=Test.age;
    var sEstimatedTime=Test.estimatedTime;
    var sGender=Test.gender;
    var sId=Test.id;
    var sLanguage=Test.language;
    var sLatitude=Test.latitude;
    var sLongitude=Test.longitude;
    var sPhoneNumber=Test.phoneNumber;
    var sResult=Test.result;
    var sSms=Test.sms;
    var sLanguAge=Test.language
    var sTimeOfTest=Test.timeOfTest;
    var sWeight=Test.weight;

    firebase.database().ref('Tests/' + Test.id).set({
      age: sAge,
      estimatedTime: sEstimatedTime,
      gender: sGender,
      id : sId,
      language:sLanguage,
      latitude: sLatitude,
      longitude : sLongitude,
      phoneNumber: sPhoneNumber,
      result: sResult,
      sms :sSms ,
      status: "inactive",
      timeOfTest: sTimeOfTest,
      weight : sWeight
    });
  }

  function updateSms(Test) {
    var sAge=Test.age;
    var sEstimatedTime=Test.estimatedTime;
    var sGender=Test.gender;
    var sId=Test.id;
    var sLatitude=Test.latitude;
    var sLongitude=Test.longitude;
    var sPhoneNumber=Test.phoneNumber;
    var sResult=Test.result;
    var sStatus=Test.status;
    var sLanguage=Test.language
    var sTimeOfTest=Test.timeOfTest;
    var sWeight=Test.weight;

    var sSms=Number(Test.sms);
    sSms++;
    console.log("sms is "+ sSms);

    firebase.database().ref('Tests/' + Test.id).set({
      age: sAge,
      estimatedTime: sEstimatedTime,
      gender: sGender,
      id : sId,
      language:sLanguage,
      latitude: sLatitude,
      longitude : sLongitude,
      phoneNumber: sPhoneNumber,
      result: sResult,
      sms :sSms+"" ,
      status: sStatus,
      timeOfTest: sTimeOfTest,
      weight : sWeight
    });
  }

  function sendFirstSms(phoneNumbersListFirstSms,Test){
    //sendFirstText(phoneNumbersListFirstSms, Test);
    if(Test.phoneNumber!=""){
      updateSms(Test);
      phoneNumbersListFirstSms.push(Test.phoneNumber+"/"+Test.id);
    }

  }
  

  function sendSecoundSms(phoneNumbersListSecondSms,timeOfSober, currentTime, Test){
    var timeLeft=timeOfSober-currentTime;
    if(timeLeft-5*60000<0){
      if(Test.sms!=2){
        if(Test.phoneNumber!=""){
          phoneNumbersListSecondSms.push(Test.phoneNumber+"/"+Test.id);
          updateSms(Test);
        }
        return true;
      }
    }
    return false;
  }

  // function sendFirstText(phoneNumbersListFirstSms,Test){
    
  // }

  // function sendSecondText(phoneNumbersListSecondSms,Test){
    
  // }


      
});
/*
$.ajax({
    type: 'post',
    url: "http://127.0.0.1:5000/send_sms", //TODO change for deployed version
    data: {'param1':'133333333333333333',
          'param2': '20000000000000000',
    },
    // dataType: 
    async: false,
    success: function (response) {
        console.log(response);
    }
}).done(function (data) {
    console.log(data);
});
*/
// $.ajax({
//         type: 'POST',
//         url: "http://localhost:5000/send_sms",//<todo CHANGE BEFORE DEPLOYING
//         data: {'in':'out'}, //passing some input here
//         // dataType: "text",
//         success: function(response){
//            output = response;
//            alert(output);
//         }
// })
// .done(function(data){
//     console.log(data);
//     alert(data);
// });
