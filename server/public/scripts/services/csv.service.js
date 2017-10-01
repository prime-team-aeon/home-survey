myApp.service('CsvService', function($http, $location, $mdToast){
  console.log('CsvService Loaded');

  var self = this;

  // called ultimately by the [UPLOAD] button on admin.html. Parses the imported file and sends it up to the server.
  self.uploadCsv = function(file, year){
    // thanks Papa!
    var parsed = Papa.parse(file);

    for (var i = 0; i < parsed.data.length; i++) {
      parsed.data[i].push(year);
    }
    
    $http.post('/csv/upload', parsed).then(function(response){
      $mdToast.show(
        $mdToast.simple()
        .textContent('CSV uploaded!')
        .hideDelay(2000)
      );
      $location.path('/admin');
    })
  }
  
  self.exportAllResponses = function(year){
    $http.get('/csv/export/' + year).then(function(response){

      // reformat data into client's preferred structure
      // each row is a single survey, columns are answers

      console.log('response.data', response.data);
      
      // format the data into a csv file
      var exportCsv = Papa.unparse(response.data);
      exportCsv = "data:text/csv;charset=utf-8," + exportCsv;
      exportCsv = encodeURI(exportCsv);      

      // tell the browser to download it
      
      // DEBUG -- UNCOMMENT NEXT LINE
      // window.open(exportCsv);
    })
  }
});
