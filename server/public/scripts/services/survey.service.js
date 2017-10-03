myApp.service('SurveyService', function ($http, $location) {
    console.log('SurveyService Loaded');

    const NUM_SURVEY_QUESTIONS = 27;

    var self = this;

    self.surveyObject = {
        one: [],
        two: [],
        three: [],
        four: [],
        demographics: []
    };

    self.surveyAnswers = {
        list: []
    };

    self.surveyLanguage = {
        language: "english"
    };

    for (var i = 0; i < NUM_SURVEY_QUESTIONS; i++) {
        self.surveyAnswers.list.push({});
    }

    self.getSurvey = function (language) {
        console.log('Service function ran with : ', language);
        self.surveyLanguage.language = language;
        $http.get('/survey/language', {
            params: {
                'language': language
            }
        }).then(function (response) {
            console.log('Object from DB is: ', response.data);
        }) //end http.get
    }; //end of self.getSurvey

    self.submitSurvey = function () {
        console.log('submitSurvey', self.surveyAnswers);
        
        $http.post('/survey/' + self.surveyLanguage.language, self.surveyAnswers).then(function (response) {
            console.log('submitSurvey response', response);
            if (response.status == 200) {
                $location.path('#/survey-thanks');
            } else {
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#survey-review-button-container')))
                    .clickOutsideToClose(true)
                    .title('Survey Error')
                    .textContent('There was an error submitting the survey. Please ask your Aeon staff member for assistance.')
                    .ariaLabel('Survey Submit Error Alert')
                    .ok('OK')
                    // .targetEvent(event)
                );
            }
        })
    }

}); //end of myApp.service