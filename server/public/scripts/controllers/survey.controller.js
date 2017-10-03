myApp.controller('SurveyController', function (SurveyService, $location) {
  console.log('SurveyController created');
  var self = this;
  // self.surveyObject = SurveyService.surveyObject;
  self.go = function (hash) {
    $location.path(hash);
  }

  self.getSurvey = function (language) {
    console.log('controller function ran with : ', language);
    SurveyService.getSurvey(language);
  }
  

});


