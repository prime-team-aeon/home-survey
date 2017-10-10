myApp.controller('AdminController', ['CsvService', 'AdminService', 'UserService', 'SiteManagerService', '$scope', '$mdDialog', '$mdSidenav', '$location', function (CsvService, AdminService, UserService, SiteManagerService, $scope, $mdDialog, $mdSidenav, $location) {

  //--------------------------------------
  //-------------VARIABLES----------------
  //--------------------------------------


  var self = this;

  // magic numbers for building the year selector
  const START_YEAR = 2010;
  const NUM_FUTURE_YEARS = 3;

  // get the current year so the select defaults to it
  let now = new Date();
  self.thisYear = now.getFullYear();

  self.yearsArray = [];
  self.yearToAdd = self.thisYear;
  self.validInput = false;

  self.questions = CsvService.questions;
  self.propertyList = AdminService.propertyList;  

  self.selectedSiteManagerProperty = AdminService.selectedSiteManagerProperty;
  self.mySiteManagerOrder = 'unit'; // default site manager property order

  self.selectedUser = []; // used for the user md-data-table


  //--------------------------------------
  //-------------FUNCTIONS----------------
  //--------------------------------------

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
    }, function () {}); // blank function is to do nothing when 'cancel' is chosen. otherwise md generates console warnings
  }

  // exports all responses for the chosen year to a csv and starts the download
  self.exportAllResponses = function () {
    CsvService.exportAllResponses(self.yearToAdd);
  }

  // get all occupancy data for the admin site manager page
  self.getSiteManagerProperties = function() {
    AdminService.getSiteManagerProperties();
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


  // authorizes or de-authorizes a user for a particular property
  self.manageAuth = function (user, property, route) {
    AdminService.manageAuth(user.id, property, route);
  }

  // Toggle Sidenav
  self.openLeftMenu = function () {
    $mdSidenav('left').toggle();
  };

  // called by the UPLOAD CSV button, sends the chosen file and the year to the service for POSTing to the server. Hides the upload button to avoid weird double-click errors
  self.startUpload = function () {
    var confirm = $mdDialog.confirm()
    .title('Confirm Upload')
    .textContent('Uploading data will OVERWRITE the selected year\'s occupancy data. Are you sure?')
    .ariaLabel('upload confirm dialog')
    .targetEvent(event)
    .ok('Overwrite')
    .cancel('Cancel');

  $mdDialog.show(confirm).then(function () {
    CsvService.uploadCsv(self.userInput, self.yearToAdd);
    self.validInput = false;
  }, function () {});

  }



  //--------------UPDATE QUESTIONS---------------

  // gets the list of questions from the db and sends the user to the updateQuestions page
  // self.goToUpdateQuestions = function (year = self.thisYear) {
  //   CsvService.getQuestions(year);
  // }
  var year = self.thisYear;
  CsvService.getQuestions(year);


  // called by a button on each individual question. displays a confirm dialog and if confirmed, updates the question in the db
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
    }, function () {});
  }

  //--------------------------------------
  //-------------RUNTIME CODE-------------
  //--------------------------------------
  
  // build yearsArray - this is what's shown in the select. Starts at START_YEAR and ends at that plus NUM_FUTURE_YEARS
  for (i = START_YEAR; i < (self.thisYear + NUM_FUTURE_YEARS); i++) {
    self.yearsArray.push(i);
  }

  // assigns the event listener function self.handleFileSelect()
  // run only if on the /admin route
  self.currentPath = $location.path();
  if (self.currentPath === '/admin') {
    document.getElementById('admin-file-input').addEventListener('change', self.handleFileSelect, false);
  }

  // Gets user information and assign to self.users
  self.AdminService = AdminService;
  AdminService.getUsers();
  self.users = AdminService.users;

  self.UserService = UserService; // connects admin controller to user service
  self.SiteManagerService = SiteManagerService; // connects admin controller to site manager service

  self.getSelectedSiteProperty = function(selectedProperty, year) {
    AdminService.getSelectedSiteProperty(selectedProperty, year);  
    AdminService.getResponseRate([selectedProperty]);    
  }

  self.responseRate = AdminService.responseRate;
 
  AdminService.getResponseRate(['all']);
}]);