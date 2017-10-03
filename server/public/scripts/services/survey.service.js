myApp.service('SurveyService', function ($http, $location) {
    console.log('SurveyService Loaded');

    const NUM_SURVEY_QUESTIONS = 27;
    const SURVEY_TEXT_QUESTIONS = [21,22];
    
    var self = this;

    self.surveyObject = { 
        one: [],
        two: [],
        three:[],
        four:[],
        demographics:[]
     };

    self.surveyAnswers = {list: []};

    self.surveyLanguage = {language:"english"};

    for (var i = 0; i < NUM_SURVEY_QUESTIONS; i++) {
        // if(SURVEY_TEXT_QUESTIONS.indexOf(i+1) > 0){
        //     self.surveyAnswers.list.push({answer: '...'})
        // }
        self.surveyAnswers.list.push({});
    }
    
    self.getSurvey = function (language) {
        console.log('Service function ran with : ', language);
        self.surveyLanguage.language = language;
        $http.get('/survey/language', {params: { 'language': language}}).then(function (response) {
            console.log('Object from DB is: ', response.data);
            
           
        })//end http.get
    };//end of self.getSurvey
        
});//end of myApp.service
