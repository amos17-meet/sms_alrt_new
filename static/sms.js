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
    if(path=="/sms") {
        chackAllActiveUsersAndSendSMS();
      }
    }


  // run thrue all users. chack if they shuld stay active and send SMS if needed
  
  function chackAllActiveUsersAndSendSMS(){
    var TestRef = database.ref("Tests/Count");
    var Count;
    TestRef.once('value').then(function(snapshot) {
      var TestData = snapshot.val();
      Count = TestData;
      Count=Number(Count);
      console.log(Count);

      var now =currentTime();
      console.log(typeof(now));
      var i =0;
      while(i<Count)
      {
        var Test=database.ref("Tests/"+i)
        Test.once('value').then(function(snapshot){
          Test=snapshot.val();
          if(Test.status=="active"){
            var endOfAlcoholEffect=timeOfSober(Test);
            console.log(endOfAlcoholEffect);
            console.log(i);
            console.log(Test.status);
            if(isActive(endOfAlcoholEffect,now,Test)){
              console.log(Test.status); 

            }
            
          }
        });
      }
    });
  }
  
/*
      for(var i=0;i<Count;i=i+1){
        console.log(i);
        var Test=database.ref("Tests/"+i)
        Test.once('value').then(function(snapshot){
          Test=snapshot.val();
          if(Test.status=="active"){
            var endOfAlcoholEffect=timeOfSober(i);
            console.log(i);
            console.log(Test.status);
            isActive(endOfAlcoholEffect,now);
            console.log(Test.status);
          }
        });
      }
    });
  }
*/
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
      if(timeLeft+15*60000){
         console.log(Test);
         changeToInactive(Test);
         console.log("inactive");
        return false;
      }
      return true;
    }


    function changeToInactive(Test) {
      var sBirth=Test.Birth;
      var sEstimatedTime=Test.estimatedTime;
      var sGender=Test.gender;
      var sId=Test.id;
      var sLatitude=Test.latitude;
      var sLongitude=Test.longitude;
      var sPhoneNumber=Test.phoneNumber;
      var sResult=Test.result;
      var sSms=Test.sms;
      var sTimeOfTest=Test.timeOfTest;
      var sWeight=Test.weight;

      firebase.database().ref('Tests/' + Test.id).set({
        Birth: sBirth,
        estimatedTime: sEstimatedTime,
        id : sId,
        gender: sGender,
        latitude: sLatitude,
        longitude : sLongitude,
        phoneNumber: sPhoneNumber,
        result: sResult,
        sms : sSms,
        status: "inactive",
        timeOfTest: sTimeOfTest,
        weight : sWeight
      });
    }
      


        //In for loop
        /*
        if(Test.status=="active")
        {
          console.log("HERE");
          estimatedTime=Test.estimatedTime;
          estimatedTime=estimatedTime.split(":");
          estimatedTime=estimatedTime[0];
          estimatedTime=parseInt(estimatedTime);
          timeOfTest=Test.timeOfTest;
          timeOfTest=parseInt(timeOfTest);

          timeOfSober=estimatedTime+timeOfSober;
          console.log(timeOfSober+"");
        }
        
    }
    */

      
      // Inside TestRef for the count
    
    //Inside SendSMS    

      
      // Inside done()
    });

//End of file, dont place any code here

