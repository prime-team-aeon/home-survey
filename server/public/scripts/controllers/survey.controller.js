myApp.controller('SurveyController', function ($location) {
  console.log('SurveyController created');
  var self = this;

  self.go = function (hash) {
    $location.path(hash);
  }
});
