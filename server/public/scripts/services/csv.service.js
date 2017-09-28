myApp.service('CsvService', function($http, $location, $mdToast){
  console.log('CsvService Loaded');

  var self = this;

  self.uploadCsv = function(file){
    console.log('CsvService', file);
    var fileToUpload = { data: file }
    $http.post('/csv/upload', fileToUpload).then(function(response){
      $mdToast.show(
        $mdToast.simple()
        .textContent('CSV uploaded!')
        .hideDelay(2000)
      );
    })
  }
  

});
