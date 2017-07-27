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
  var storage = firebase.storage();
  var auth = firebase.auth();
  var signup = document.getElementById('signup');
  if (signup) {
  signup.onclick = function() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var confirmpass = document.getElementById('confpassword').value;
    if(password != confirmpass) {
      alert("The passwords do not match!");
    }
    else {
    auth.createUserWithEmailAndPassword(email, password).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  alert(errorMessage);
});
    alert("Account has been created successfully! Proceed to login!");
    var user = auth.currentUser;
    alert (user);
    }
  }
    
    
  }


  var login = document.getElementById("login");
  if (login) {
  login.onclick = function() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    auth.signInWithEmailAndPassword(email, password).catch(function(error) {
      var errorMessage=error.message;
      var errorCode = error.code;
      alert(errorCode);
      if(errorCode=="auth/user-not-found")
      {
        var response = confirm("E-mail is not registered! Click <a href=\"/signup\">here</a> to sign up!");
        if(response==true)
        {
          
        }
      }
      else if (errorCode=="auth/wrong-password")
      {
        var response = confirm("Incorrect password. Wish to reset your password?")
        if(response==true)
        {
          auth.sendPasswordResetEmail(email);
          alert("Password reset e-mail has been sent successfully!");
        }
      }
      alert(errorMessage);
    })
    if(auth.currentUser.emailVerified == false) {
      var response = confirm("Your account needs to be verified. Re-send verification e-mail?");
      if(response==true) {
        auth.currentUser.sendEmailVerification();
        alert("Verficiation e-mail has been sent. Please check your inbox");
      }
    }
    else {
      alert("Welcome back!");
    }
    
  };
}


window.onload = function () {
  var path = window.location.pathname;
  if(path=="/") {
    firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    alert("Logged in");
    alert(user.displayName);
    if(!user.emailVerified)
    {
      alert("You must be verified first.");
      user.sendEmailVerification();
      auth.signOut();
      window.location.replace("/login");
    }
    if(user.displayName==null)
    {
      window.location.replace("/settings");
    }
  } else {
    // No user is signed in.
  }
});
  }
  else if (path.includes("/results"))
  {
    // alert("Results page");
    var id = window.location.pathname.replace("/results/", "");
    GetResultsData(id);
  }
  else if (path.includes("/done"))
    {
      var id = window.location.pathname.replace("/done/", "");
      GetDonePage(id);
    }
}


firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    if(window.location.pathname=="/login")
    {
      window.location.replace("/");
    }
  } else {
    // No user is signed in.
  }

});


  function GetResultsData(id) {
    var TestRef = database.ref("Tests/"+id);
    TestRef.once('value').then(function(snapshot) {
      console.log(snapshot.val());
      var TestData = snapshot.val();
      if(TestData.status!="active")
        {
          window.location.replace("/");
        }
        else {
          // if(Number(TestData.result)<0.05)
          //   {
          //     window.location.replace("/done/"+id);
          //   }

      // alert(TestData.age);
      // alert(TestData.freq);
      // alert(TestData.gender);
      // alert(TestData.result);
      // alert(TestData.weight);
      // var TimeEstimation=Number(TestData.result)/0.016;
      // var Hours = parseInt(TimeEstimation);
      // var Minutes = parseInt((TimeEstimation-Hours)*60);
       var Estimation = TestData.estimatedTime;
       document.getElementById("timeresult").innerText+="  "+Estimation;
       document.getElementById("result").innerText+="   "+TestData.result;

      // alert(Hours + ":" +Minutes);
        }
    });
  }

  function GetDonePage(id) {
    var TestRef = database.ref("Tests/"+id);
    TestRef.once('value').then(function(snapshot) {
      var result = snapshot.val().result;
      document.getElementById("result").value+=result;
    })
    //place your code here, the scripts are all loaded
  }

});