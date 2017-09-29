myApp.controller('SurveyController', ['SurveyService', function(SurveyService) {
  console.log('SurveyController created');
  var self = this;
  self.surveyObject=SurveyService.surveyObject
}]);
