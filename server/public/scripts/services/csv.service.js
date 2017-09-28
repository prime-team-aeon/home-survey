myApp.service('CsvService', function($http, $location, $mdToast){
  console.log('CsvService Loaded');

  var self = this;

  self.uploadCsv = function(file){
    console.log('CsvService', file);

    var parsed = Papa.parse(file);

    console.log('parsed', parsed);
    
    $http.post('/csv/upload', parsed).then(function(response){
      $mdToast.show(
        $mdToast.simple()
        .textContent('CSV uploaded!')
        .hideDelay(2000)
      );
    })
  }
  

});
