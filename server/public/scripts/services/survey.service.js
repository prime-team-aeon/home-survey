myApp.service('SurveyService', function ($http, $location) {
    console.log('SurveyService Loaded');

    var self = this;

    self.surveyObject = { 
        one: [],
        two: [],
        three:[],
        four:[],
        demographics:[]
     };

    self.surveyAnswers = [];

    self.surveyLanguage = {
        language: 'english'
    };

    
    self.getSurvey = function (language) {
        console.log('Service function ran with : ', language);
        
        $http.get('/survey/language', {params: { 'language': language}}).then(function (response) {
            console.log('Object from DB is: ', response.data);
        self.surveyLanguage.language = language;    
           
        })//end http.get
    };//end of self.getSurvey
      
});//end of myApp.service
