myApp.service('CsvService', function ($http, $location, $mdToast) {

  //--------------------------------------
  //-------------VARIABLES----------------
  //--------------------------------------


  var self = this;

  self.questions = {};

  //--------------------------------------
  //-------------FUNCTION----------------
  //--------------------------------------

  // exports all responses to a csv file and tells the browser to download it
  self.exportAllResponses = function (year) {
    $http.get('/csv/export/' + year).then(function (response) {

      // format the data into a csv file
      var exportCsv = Papa.unparse(response.data);
      exportCsv = "data:text/csv;charset=utf-8," + exportCsv;
      exportCsv = encodeURI(exportCsv);

      // tell the browser to download it
      var link = document.createElement("a");
      link.download = 'home-survey-responses-' + year;
      link.href = exportCsv;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      delete link;
    })
  }


  // gets all languages of questions from the db (for the updateQuestions view)
  self.getQuestions = function (year) {

    $http.get('/survey/questions/' + year).then(function (response) {
      self.questions.list = response.data;
      //Create array to store themes without repeating values. Generates drop down selector in Admin page
      self.questions.theme = [];
      for (var i = 0; i < response.data.length; i++) {
        var theme = response.data[i].theme;
        var arr = self.questions.theme
        if (themeExists(arr, theme) == false) {
          self.questions.theme.push(theme);
        }
      }
      function themeExists(arr, theme) {
        return arr.some(function(arrVal) {
          return theme === arrVal
        })
      }
    });
  }


  // updates all four languages of the selected question in the db
  self.updateQuestion = function (question, year) {

    $http.post('/survey/questions/' + year, question).then(function (response) {
      self.getQuestions();
      // $location.path('/admin-questions');
    });

  }
  // ----------------------------------- //
  // ------------ IMPORTANT ------------ //
  // ----------------------------------- //

  /* The following assumptions about the incoming file must be true for this to work:
    a. There is a single header row (adjust in csv.router.js const `OCCUPANCY_IGNORE_ROWS`)

    b. The columns are as follows:
      1. Property Name
      2. Occupancy (keyed off whether the string 'Occupied' appears in that element)
      3. Unit Number (trims all characters except alphanumeric, -, and _)

    c. There are exactly 3 columns
  */

  // called ultimately by the [UPLOAD] button on admin.html. Parses the imported file and sends it up to the server.
  self.uploadCsv = function (file, year) {
    // thanks Papa!
    var parsed = Papa.parse(file);
    
    for (var i = 0; i < parsed.data.length; i++) {
      
      // scrub the data
      for (var j = 0; j < parsed.data[i].length; j++) {
        // search the 'occupied' field for whether it contains the text 'occupied' or not, and set it to true/false based on that
        if(j===1){
          if(parsed.data[i][j].search('Occupied') >= 0){
            parsed.data[i][j] = true;
          } else{
            parsed.data[i][j] = false;
          }
        } else {
          parsed.data[i][j] = parsed.data[i][j].replace(/(?!\w|\s|-)./g, '') // remove all non-alphanumeric characters except whitespace, -, and _
          .replace(/\s+/g, ' ') // replace all multiple-whitespace patterns with a single space
          .replace(/^(\s*)([\W\w]*)(\b\s*$)/g, '$2'); // remove all trailing and leading whitespace
        }
      }

      // add the passed-in year to the data row
      parsed.data[i].push(year);
    }

    $http.post('/csv/upload/' + year, parsed).then(function (response) {
      $mdToast.show(
        $mdToast.simple()
        .textContent('CSV uploaded!')
        .hideDelay(2000)
      );
      $location.path('/admin');
    })
  }

  //--------------------------------------
  //-------------RUNTIME CODE-------------
  //--------------------------------------

  // none



});