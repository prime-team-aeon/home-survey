myApp.controller('SurveyLangController', function (SurveyService, UserRolesService, $location, $window, $mdDialog) {
  console.log('SurveyLangController created');
  var self = this;
  self.propertyList = UserRolesService.propertyList;

  self.propertyChosen = "";

  self.beginSurvey = function(property, unit){
    SurveyService.beginSurvey(property,unit);
  }
});