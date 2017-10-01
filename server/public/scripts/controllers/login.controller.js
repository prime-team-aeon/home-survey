myApp.controller('LoginController', function ($http, $location, UserService, $mdToast) {
    // console.log('LoginController created');
    var vm = this;
    vm.user = {
      username: '',
      password: ''
    };
    vm.message = '';

    vm.login = function() {
      // console.log('LoginController -- login');
      if(vm.user.username === '' || vm.user.password === '') {
        vm.message = "Enter your username and password!";
      } else {
        // console.log('LoginController -- login -- sending to server...', vm.user);
        $http.post('/', vm.user).then(function(response) {
          if(response.data.username) {
            // console.log('LoginController -- login -- success: ', response.data);
            // location works with SPA (ng-route)
            $location.path('/user'); // http://localhost:5000/#/user
          } else {
            // console.log('LoginController -- login -- failure: ', response);
            vm.message = "Wrong!!";
          }
        }).catch(function(response){
          // console.log('LoginController -- registerUser -- failure: ', response);
          vm.message = "Wrong!!";
        });
      }
    };

    vm.registerUser = function() {
      // console.log('LoginController -- registerUser');
      if(vm.user.username === '' || vm.user.password === '') {
        vm.message = "Choose a username and password!";
      } else {
        // console.log('LoginController -- registerUser -- sending to server...', vm.user);
        $http.post('/register', vm.user).then(function(response) {
          // console.log('LoginController -- registerUser -- success');
          $location.path('/home');
          $mdToast.show(
            $mdToast.simple()
              .textContent("Registration Successful! Please check your email to verify.")
              .position('top right')
          );//end of $mdToast
        }).catch(function(response) {
          // console.log('LoginController -- registerUser -- error');
          vm.message = "Please try again."
          $mdToast.show(
            $mdToast.simple()
              .textContent("Please enter a valid email address.")
              .position('top right')
          );//end of $mdToast
        });
      }
    }

    vm.cancelToast = function (ev) {
      $mdToast.show(
        $mdToast.simple()
          .textContent("Registration Canceled.")
          .position('top right')
      );//end of $mdToast
    };//end of vm.showToast

    vm.registerToast = function (ev) {
      $mdToast.show(
        $mdToast.simple()
          .textContent("Enter a new username and password")
          .position('top right')
      );//end of $mdToast
    };//end of vm.showToast

    vm.successToast = function (ev) {
      $mdToast.show(
        $mdToast.simple()
          .textContent("Registration Successful! Enter username and password to login.")
          .position('top right')
      );//end of $mdToast
    };//end of vm.showToast
});
