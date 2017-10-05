myApp.controller('SurveyController', function (AdminService, SurveyService, $location, $window, $mdDialog) {

  //--------------------------------------
  //-------------VARIABLES----------------
  //--------------------------------------


  var self = this;

  self.propertyChosen = ""; // the user-selected property
  self.propertyList = AdminService.propertyList; // holds the list of properties pulled from the database
  self.surveyAnswers = SurveyService.surveyAnswers; // holds the user's answers
  self.surveyLanguage = SurveyService.surveyLanguage; // the user-selected language
  self.surveyObject = SurveyService.surveyObject; // holds the translated questions for display
  

  
  //--------------------------------------
  //-------------FUNCTIONS----------------
  //--------------------------------------


  // displays a confirmation dialog for the user, and if confirmed clears the surveyAnswers object and sends the user back to the language-select page
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


  // passes the user-selected language to the service so that surveyObject can be built with the translated questions
  self.getSurvey = function (language) {
    SurveyService.getSurvey(language);
  }


  // called primarily from prev/next buttons on DOM, sends user to the passed address and resets their scroll to the top of the page
  self.go = function (hash) {
    $location.path(hash);
    $window.scrollTo(0, 0);
  }

  
  // displays a dialog with translated help instructions for the user
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


  // takes hard-coded question_id and answer values from the user/DOM and puts them in surveyAnswers.list
  self.respond = function (question_id, answer) {
    SurveyService.surveyAnswers.list[question_id - 1].answer = answer;
  }


  // displays a confirmation dialog, and if confirmed invokes the service's submitSurvey function to store responses in the db
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


  //--------------------------------------
  //-------------RUNTIME CODE-------------
  //--------------------------------------


  // passes the user-selected property and unit to the service to be checked against the db for whether or not it's a valid property and unit that has not yet responded to the survey
  self.beginSurvey = function (property, unit) {
    SurveyService.beginSurvey(property, unit);
  }




});