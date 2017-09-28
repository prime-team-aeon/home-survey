myApp.service('CsvService', function($http, $location, $mdToast){
  console.log('CsvService Loaded');

  var self = this;

  self.uploadCsv = function(file, year){
    console.log('CsvService', file);

    var parsed = Papa.parse(file);

    for (var i = 0; i < parsed.data.length; i++) {
      parsed.data[i].push(year);
    }
    console.log('parsed', parsed);
    
    $http.post('/csv/upload', parsed).then(function(response){
      $mdToast.show(
        $mdToast.simple()
        .textContent('CSV uploaded!')
        .hideDelay(2000)
      );
      $location.path('/admin');
    })
  }
  

});
