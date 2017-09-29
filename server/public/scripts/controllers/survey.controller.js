
myApp.controller('SurveyController', ['SurveyService', '$location', function (SurveyService,$location) {
  console.log('SurveyController created');
  var self = this;
  self.surveyObject=SurveyService.surveyObject;
  self.go = function (hash) {
    $location.path(hash);
  }
}]);


