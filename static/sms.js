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
        sendSms();

      }
    }



  function sendSms(){
    var TestRef = database.ref("Tests/Count");
    var Count;
    TestRef.once('value').then(function(snapshot) {
      var TestData = snapshot.val();
      Count = TestData;
      Count=Number(Count);

      var now =currentTime();
      for(var i=0;i<Count;i++){
        var timeOfSober=timeOfSober(i);
        chackInActive(timeOfSober,now);
      }
    
  }

  function timeOfSober(id){
    var Test=database.ref("Tests/"+id)
    Test.once('value').then(function(snapshot){
      Test=snapshot.val();
      var estimatedTime=Test.estimatedTime;
      console.log("estimated time "+estimatedTime);
      var timeOfTest=Test.timeOfTest;
      timeOfTest=Number(timeOfTest);
      //the time when the person will get sober
      var timeOfSober=estimatedTime+timeOfTest;
      console.log(timeOfSober+" sober");
      return timeOfSober

        });
      }

    });
  }

    function currentTime(){
      var now=new Date();
      now=now.getTime();
      console.log(now+"now");
      return now;
    }

    function chackInActive(timeOfSober, currenttime){
      var timeLeft=timeOfSober-currentTime;
      if(timeLeft+5<0){
        
      }



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
        */
    }
    

      
      // Inside TestRef for the count
    
    //Inside SendSMS    

      
      // Inside done()
    });

//End of file, dont place any code here
