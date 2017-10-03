myApp.service('SurveyService', function ($http, $location) {
    console.log('SurveyService Loaded');

    var self = this;

    self.surveyObject = { };
    
    
    
    self.getSurvey = function (language) {
        console.log('Service function ran with : ', language);
        
        $http.get('/survey/language', {params: { 'language': language}}).then(function (response) {
            console.log('Object from DB is: ', response.data);
            for (var i = 0; i < response.data.questions.length; i++) {
                self.surveyObject[response.data.questions[i].question_number] = response.data.questions[i][language];
            }
            for (var i = 0; i < response.data.translations.length; i++) {
                self.surveyObject[response.data.translations[i].type] = response.data.translations[i][language];
            }
            console.log(self.surveyObject)
            
           
        })//end http.get
    };//end of self.getSurvey
        
});//end of myApp.service
