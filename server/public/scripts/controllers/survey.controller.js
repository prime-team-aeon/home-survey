
myApp.controller('SurveyController', ['SurveyService', '$location', function (SurveyService,$location) {
  console.log('SurveyController created');
  var self = this;
  self.surveyObject = SurveyService.surveyObject;
  self.go = function (hash) {
    $location.path(hash);
  }

  // self.addResponses = function (response) {
  //   console.log('controller function ran');
  //   ResponsesService.addResponses(response);

  // };
  // self.surveyObject = SurveyService.surveyObject;
  // self.responsesObject = ResponsesService.responsesObject;
  // console.log(ResponsesService.responsesObject);
  

}]);


