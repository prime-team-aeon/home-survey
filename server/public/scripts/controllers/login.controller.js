myApp.controller('LoginController', function ($http, $location, UserService, $mdToast, AdminService) {

  //--------------------------------------
  //-------------VARIABLES----------------
  //--------------------------------------

  var vm = this;

  vm.user = {
    username: '',
    password: ''
  };

  
  //--------------------------------------
  //-------------FUNCTIONS----------------
  //--------------------------------------

  
  // logs the user in, then redirects to the appropriate page if they have a role assigned
  vm.login = function () {
    if (vm.user.username === '' || vm.user.password === '') {
    } else {
      $http.post('/', vm.user).then(function (response) {
        if (response.data.username) {
          if (response.data.role){
            vm.user.role = response.data.role;
          }
          // location works with SPA (ng-route)
          //cascading ifs for each user role using else ifs
          if (vm.user.role == 'Administrator') {
            $location.path('/admin-reporting'); // http://localhost:5000/#/admin
          } else if (vm.user.role == 'Site Manager') {
            $location.path('/site-manager'); // http://localhost:5000/#/site-manager
          } else if (vm.user.role === 'Resident') {
            $location.path('/survey-language'); // http://localhost:5000/#/survey-language
          } else {
            $mdToast.show(
              $mdToast.simple()
                .textContent("Unauthorized - Please contact an administrator to authorize you as a Site Manager or Administrator.")
                .position('top right')
            );//end of $mdToast
              }
        }
      }).catch(function (response) {
        $mdToast.show(
          $mdToast.simple()
            .textContent("Unauthorized - Invalid username/password, or your account may not have been authorized by an administrator yet.")
            .position('top right')
        );//end of $mdToast
      });
    }
  };


  // registers the user with the provided name/password. note user is not active and can't do anything until they confirm their email and get a role assigned by an admin
  vm.registerUser = function () {
    if (vm.user.username === '' || vm.user.password === '') {
    } else {
      $http.post('/register', vm.user).then(function (response) {
        $location.path('/home');
        $mdToast.show(
          $mdToast.simple()
            .textContent("Registration Successful! Please check your email to verify.")
            .position('top right')
        );//end of $mdToast
      }).catch(function (response) {
        $mdToast.show(
          $mdToast.simple()
            .textContent("Please enter a valid email address.")
            .position('top right')
        );//end of $mdToast
      });
    }
  }


  // displays a toast if the user cancels their registration
  vm.cancelToast = function (ev) {
    $mdToast.show(
      $mdToast.simple()
        .textContent("Registration Canceled.")
        .position('top right')
    );//end of $mdToast
  };//end of vm.showToast


  // displays a toast prompting the user to enter a new name/pass.
  // do we still need this?
  vm.registerToast = function (ev) {
    $mdToast.show(
      $mdToast.simple()
        .textContent("Enter a new username and password")
        .position('top right')
    );//end of $mdToast
  };//end of vm.showToast


  // displays a notification toast if the registration is successful
  vm.successToast = function (ev) {
    $mdToast.show(
      $mdToast.simple()
        .textContent("Registration Successful! Enter username and password to login.")
        .position('top right')
    );//end of $mdToast
  };//end of vm.showToast





  
  //--------------------------------------
  //-------------RUNTIME CODE-------------
  //--------------------------------------

  // none



});
