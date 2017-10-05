var myApp = angular.module('myApp', ['ngMaterial', 'ngRoute']);

/// Routes ///
myApp.config(function ($routeProvider, $locationProvider, $mdThemingProvider) {
  $locationProvider.hashPrefix('');
  console.log('myApp -- config')
  $routeProvider
    .when('/home', {
      templateUrl: '/views/templates/home.html',
      controller: 'LoginController as lc',
    })
    .when('/register/verify/:token', {
      templateUrl: '/views/templates/verify.html',
      controller: 'VerifyController as vc'
    })
    .when('/register', {
      templateUrl: '/views/templates/register.html',
      controller: 'LoginController as lc'
    })
    .when('/user', {
      templateUrl: '/views/templates/user.html',
      controller: 'UserController as uc',
      resolve: {
        getUser: function (UserService) {
          return UserService.getUser('any');
        }
      }
    })
    .when('/survey-language', {
      templateUrl: '/views/templates/survey-language.html',
      controller: 'SurveyController as sc',
      resolve: {
        getUser: function (UserService) {
          return UserService.getUser('Resident');
        }
      }
    })
    .when('/survey-intro', {
      templateUrl: '/views/templates/survey-intro.html',
      controller: 'SurveyController as sc',
      resolve: {
        getUser: function (UserService) {
          return UserService.getUser('Resident');
        }
      }
    })
    .when('/survey-demographics', {
      templateUrl: '/views/templates/survey-demographics.html',
      controller: 'SurveyController as sc',
      resolve: {
        getUser: function (UserService) {
          return UserService.getUser('Resident');
        }
      }
    })
    .when('/survey-review', {
      templateUrl: '/views/templates/survey-review.html',
      controller: 'SurveyController as sc',
      resolve: {
        getUser: function (UserService) {
          return UserService.getUser('Resident');
        }
      }
    })
    .when('/survey-language', {
      templateUrl: '/views/templates/survey-language.html',
      controller: 'SurveyController as sc',
      resolve: {
        getUser: function (UserService) {
          return UserService.getUser('Resident');
        }
      }
    })
    .when('/survey-q1', {
      templateUrl: '/views/templates/survey-q1.html',
      controller: 'SurveyController as sc',
      resolve: {
        getUser: function (UserService) {
          return UserService.getUser('Resident');
        }
      }
    })
    .when('/survey-q2', {
      templateUrl: '/views/templates/survey-q2.html',
      controller: 'SurveyController as sc',
      resolve: {
        getUser: function (UserService) {
          return UserService.getUser('Resident');
        }
      }
    })
    .when('/survey-q3', {
      templateUrl: '/views/templates/survey-q3.html',
      controller: 'SurveyController as sc',
      resolve: {
        getUser: function (UserService) {
          return UserService.getUser('Resident');
        }
      }
    })
    .when('/survey-q4', {
      templateUrl: '/views/templates/survey-q4.html',
      controller: 'SurveyController as sc',
      resolve: {
        getUser: function (UserService) {
          return UserService.getUser('Resident');
        }
      }
    })
    .when('/survey-thanks', {
      templateUrl: '/views/templates/survey-thanks.html',
      controller: 'SurveyController as sc',
      resolve: {
        getUser: function (UserService) {
          return UserService.getUser('Resident');
        }
      }
    })
    .when('/admin', {
      templateUrl: '/views/templates/admin.html',
      controller: 'AdminController as ac',
      resolve: {
        getUser: function (UserService) {
          return UserService.getUser('Administrator');
        }
      }
    })
    .when('/admin-questions', {
      templateUrl: '/views/templates/admin-questions.html',
      controller: 'AdminController as ac',
      resolve: {
        getUser: function (UserService) {
          return UserService.getUser('Administrator');
        }
      }
    })    
    .when('/site-manager', {
      templateUrl: '/views/templates/site-manager.html',
      controller: 'SiteManagerController as smc',
      resolve: {
        getUser: function (UserService) {
          return UserService.getUser('Aeon');
        }
      }
    })
    .when('/logout', {
      resolve: {
        logout: function (UserService) {
          return UserService.logout();
        }
      }
    })
    .otherwise({
      redirectTo: 'home'
    });

  $mdThemingProvider.theme('default')
    .primaryPalette('green')
    .accentPalette('light-green')


});