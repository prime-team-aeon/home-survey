myApp.controller('AdminController', ['CsvService', 'AdminService', '$scope', '$mdDialog', function (CsvService, AdminService, $scope, $mdDialog) {
  console.log('AdminController created');
  var self = this;

  const START_YEAR = 2010;
  const NUM_FUTURE_YEARS = 3;

  // get the current year so the select defaults to it
  let now = new Date();
  self.thisYear = now.getFullYear();

  self.yearsArray = [];
  self.yearToAdd = self.thisYear;
  self.validInput = false;

  // build yearsArray - this is what's shown in the select. Starts at START_YEAR and ends at that plus NUM_FUTURE_YEARS
  for (i = START_YEAR; i < (self.thisYear + NUM_FUTURE_YEARS); i++) {
    self.yearsArray.push(i);
  }

  // called by the UPLOAD CSV button, sends the chosen file and the year to the service for POSTing to the server. Hides the upload button to avoid weird double-click errors
  self.startUpload = function () {
    CsvService.uploadCsv(self.userInput, self.yearToAdd);
    self.validInput = false;
  }

  // event handler for 'change' event on file input. reads in the file, and sets the validInput flag to true which shows the upload button
  self.handleFileSelect = function (fileEvent) {
    reader = new FileReader();
    reader.onerror = function () {
      console.log('reader error');
    };
    reader.onload = function (readerEvent) {
      // this is where the data is ready
      self.validInput = true;
      $scope.$apply();
      self.userInput = readerEvent.target.result;
    }
    reader.readAsText(fileEvent.target.files[0]);
  }

  // assigns the event listener function self.handleFileSelect()
  document.getElementById('admin-file-input').addEventListener('change', self.handleFileSelect, false);

  self.exportAllResponses = function () {
    CsvService.exportAllResponses(self.yearToAdd);
  }

  self.propertyList = AdminService.propertyList;

  // Gets user information and assign to self.users
  self.AdminService = AdminService;
  AdminService.getUsers();
  self.users = AdminService.users;

  self.manageAuth = function (user, property, route) {
    AdminService.manageAuth(user.id, property, route);
  }

  // deletes a user out of the db
  self.deleteUser = function (user) {

    var confirm = $mdDialog.confirm()
      .title('Confirm Delete')
      .textContent('Do you really want to delete this user? This cannot be undone!')
      .ariaLabel('delete confirm dialog')
      .targetEvent(event)
      .ok('Delete')
      .cancel('Cancel');

    $mdDialog.show(confirm).then(function () {
      AdminService.deleteUser(user.username);
    }, function () { });
  }

  self.questions = CsvService.questions;

  self.goToUpdateQuestions = function (year = self.thisYear) {
    CsvService.getQuestions(year);
  }

  self.updateQuestion = function (question, year = self.thisYear) {
    var confirm = $mdDialog.confirm()
      .title('Confirm Update')
      .textContent('Do you really want to update this question? This will affect every survey from now on!')
      .ariaLabel('update confirm dialog')
      .targetEvent(event)
      .ok('Update')
      .cancel('Cancel');

    $mdDialog.show(confirm).then(function () {
      CsvService.updateQuestion(question, year);
    }, function () { });
  }

}]);