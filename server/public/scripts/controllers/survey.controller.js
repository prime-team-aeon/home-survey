myApp.controller('SurveyController', function (SurveyService, $location, $window) {
  console.log('SurveyController created');
  var self = this;
  // self.surveyObject = SurveyService.surveyObject;
  self.go = function (hash) {
    $location.path(hash);
    $window.scrollTo(0,0);
  }

  self.getSurvey = function (language) {
    console.log('controller function ran with : ', language);
    SurveyService.getSurvey(language);
  }

  self.respond = function (question_id, answer) {
    SurveyService.surveyAnswers.list[question_id-1].answer = answer;
  }

  self.surveyAnswers = SurveyService.surveyAnswers;

});