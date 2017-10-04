myApp.controller('SurveyController', function (UserRolesService, SurveyService, $location, $window, $mdDialog) {
  console.log('SurveyController created');
  var self = this;
  // self.surveyObject = SurveyService.surveyObject;
  self.go = function (hash) {
    $location.path(hash);
    $window.scrollTo(0, 0);
  }
  self.surveyObject = SurveyService.surveyObject;

  console.log(self.introOne);


  // self.surveyObject=SurveyService.surveyObject;
  self.getSurvey = function (language) {
    console.log('controller function ran with : ', language);
    SurveyService.getSurvey(language);
  }


  self.surveyLanguage = SurveyService.surveyLanguage;

  self.respond = function (question_id, answer) {
    SurveyService.surveyAnswers.list[question_id - 1].answer = answer;
  }

  self.surveyAnswers = SurveyService.surveyAnswers;
  self.help = function () {
    var confirm = $mdDialog.confirm()
      .title(self.surveyObject.instructions)
      .textContent(self.surveyObject.directions1)
      .ariaLabel(self.surveyObject.instructions)
      .targetEvent(event)
      .ok(self.surveyObject.continue);


    $mdDialog.show(confirm).then(function () {
      SurveyService.help();
    }, function () {});

  }



  self.submitSurvey = function () {
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

  self.propertyList = UserRolesService.propertyList;

  self.propertyChosen = "";

  self.beginSurvey = function (property, unit) {
    SurveyService.beginSurvey(property, unit);
  }

  self.cancelSurvey = function () {
    var confirm = $mdDialog.confirm()
      .title('Confirm Cancel Survey')
      .textContent('Do you want to cancel this survey? This cannot be undone!')
      .ariaLabel('confirm cancel survey dialog')
      .targetEvent(event)
      .ok('Cancel Survey')
      .cancel('Go Back');

    $mdDialog.show(confirm).then(function () {
      SurveyService.wipeSurveyClean();
      self.go('/survey-language');
    }, function () {});

  }
});