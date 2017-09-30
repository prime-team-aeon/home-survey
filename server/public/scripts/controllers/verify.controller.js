myApp.controller('VerifyController', function ($http, $location, UserService, $mdToast, $routeParams) {
  console.log('VerifyController created. Token:', $routeParams.token);
  var self = this;

  $http.get('/register/verify/' + $routeParams.token).then(function(response){
    console.log('response', response);
    
    if (response.status === 200) {
      self.message = "Email verified. Please log in."
      self.showLogin = true;
    } else if (response.data == 'expired'){
      self.message = "Sorry, your verification token has expired."
      self.showRegister = true;
    } else {
      self.message = "Sorry, you seem to have followed a bad link."
      setTimeout(function() {
        $location.path('/');
      }, 2000);
    }
  }); // end get route

});