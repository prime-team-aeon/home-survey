myApp.controller('AdminController', function(CsvService, $scope) {
  console.log('AdminController created');
  var self = this;

  const START_YEAR = 2010;

  self.uploadCsv = function(){
    console.log('ac.uploadCsv()');       
  }
  
  let now = new Date();
  self.thisYear = now.getFullYear();
  console.log('ac.thisYear', self.thisYear);
  

  self.yearsArray = [];
  self.yearToAdd = self.thisYear;
  self.validInput = false;

  // build yearsArray
  for (i = START_YEAR; i < (self.thisYear + 3); i++){
    self.yearsArray.push(i);
  }

  self.startUpload = function() {
    console.log('ac.startUpload');
    CsvService.uploadCsv(self.userInput, self.yearToAdd);
    self.validInput = false;    
  }

  self.handleFileSelect = function(fileEvent){
    console.log('hfs');
    
    reader = new FileReader();
    reader.onerror = function(){
      console.log('reader error');
    };
    reader.onload = function(readerEvent){
      console.log('reader onload', readerEvent);
      // this is where we actually send the data onward

      self.validInput = true;
      $scope.$apply();
      self.userInput = readerEvent.target.result;
    }
    reader.readAsText(fileEvent.target.files[0]);
  }

  document.getElementById('admin-file-input').addEventListener('change', self.handleFileSelect, false);
});
