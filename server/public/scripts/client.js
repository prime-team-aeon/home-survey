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
    .when('/register', {
      templateUrl: '/views/templates/register.html',
      controller: 'LoginController as lc'
    })
    .when('/user', {
      templateUrl: '/views/templates/user.html',
      controller: 'UserController as uc',
      resolve: {
        getUser: function (UserService) {
          return UserService.getUser();
        }
      }
    })
    .when('/survey-intro', {
      templateUrl: '/views/templates/survey-intro.html',
      controller: 'SurveyController as sc'
    })
    .when('/survey-demographics', {
      templateUrl: '/views/templates/survey-demographics.html',
      controller: 'SurveyController as sc'
    })
    .when('/survey-q1', {
      templateUrl: '/views/templates/survey-q1.html',
      controller: 'SurveyController as sc'
    })
    .when('/survey-q2', {
      templateUrl: '/views/templates/survey-q2.html',
      controller: 'SurveyController as sc'
    })
    .when('/survey-q3', {
      templateUrl: '/views/templates/survey-q3.html',
      controller: 'SurveyController as sc'
    })
    .when('/survey-q4', {
      templateUrl: '/views/templates/survey-q4.html',
      controller: 'SurveyController as sc'
    })
    .when('/survey-review', {
      templateUrl: '/views/templates/survey-review.html',
      controller: 'SurveyController as sc'
    })
    .when('/survey-thanks', {
      templateUrl: '/views/templates/survey-thanks.html',
      controller: 'SurveyController as sc'
    })
    .when('/admin', {
      templateUrl: '/views/templates/admin.html',
      controller: 'AdminController as ac',
      resolve: {
        getUser: function (UserService) {
          return UserService.getUser();
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
