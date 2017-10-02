myApp.service('UserService', function($http, $location){
  // console.log('UserService Loaded');

  var self = this;

  self.userObject = {};

  self.getUser = function(role) {
    // console.log('UserService -- getUser');
    role = '/' + role;
    console.log('getUser', role);
    
    $http.get('/user' + role).then(function(response) {
        if(response.data.username) {
            // user has a current session on the server
            self.userObject.userName = response.data.username;
            console.log('UserService.getUser', self.userObject);
        } else {
            // console.log('UserService -- getUser -- failure');
            // user has no session, bounce them back to the login page
            $location.path("/home");
        }
    },function(response){
      // console.log('UserService -- getUser -- failure: ', response);
      $location.path("/home");
    });
  }

  self.logout = function(){
    console.log('UserService -- logout');
    $http.get('/user/logout').then(function(response) {
      console.log('UserService -- logout -- logged out');
      $location.path("/home");
    });
  }
});
