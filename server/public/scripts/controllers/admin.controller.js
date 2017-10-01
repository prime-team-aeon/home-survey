myApp.controller('AdminController', ['CsvService', 'UserRolesService', '$scope', function(CsvService, UserRolesService, $scope) {
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
  for (i = START_YEAR; i < (self.thisYear + NUM_FUTURE_YEARS); i++){
    self.yearsArray.push(i);
  }

  // called by the UPLOAD CSV button, sends the chosen file and the year to the service for POSTing to the server. Hides the upload button to avoid weird double-click errors
  self.startUpload = function() {
    CsvService.uploadCsv(self.userInput, self.yearToAdd);
    self.validInput = false;    
  }

  // event handler for 'change' event on file input. reads in the file, and sets the validInput flag to true which shows the upload button
  self.handleFileSelect = function(fileEvent){    
    reader = new FileReader();
    reader.onerror = function(){
      console.log('reader error');
    };
    reader.onload = function(readerEvent){
      // this is where the data is ready
      self.validInput = true;
      $scope.$apply();
      self.userInput = readerEvent.target.result;
    }
    reader.readAsText(fileEvent.target.files[0]);
  }

  // assigns the event listener function self.handleFileSelect()
  document.getElementById('admin-file-input').addEventListener('change', self.handleFileSelect, false);

  self.exportAllResponses = function(){
    CsvService.exportAllResponses();
  }

  self.propertyList = UserRolesService.propertyList;

  // Gets user information and assign to self.users
  self.UserRolesService = UserRolesService;
  UserRolesService.getUsers();
  self.users = UserRolesService.users;

  self.deauthorizeProperty = function(user, property){
    UserRolesService.deauthorizeProperty(user.id, property)
  }
}]);
