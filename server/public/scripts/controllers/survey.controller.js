myApp.controller('SurveyController', function (SurveyService, $location, $window, $mdDialog) {
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
  
  self.surveyLanguage = SurveyService.surveyLanguage;

  self.respond = function (question_id, answer) {
    SurveyService.surveyAnswers.list[question_id-1].answer = answer;
  }

  self.surveyAnswers = SurveyService.surveyAnswers;

  self.submitSurvey = function(){
    var confirm = $mdDialog.confirm()
    .title('Confirm Survey Submission')
    .textContent('Do you want to submit your survey? This cannot be undone!')
    .ariaLabel('confirm survey dialog')
    .targetEvent(event)
    .ok('Confirm')
    .cancel('Cancel');

  $mdDialog.show(confirm).then(function () {
    SurveyService.submitSurvey();
  }, function () {});

  }

});