myApp.service('SurveyService', function ($http, $location, $mdDialog) {
    console.log('SurveyService Loaded');

    const NUM_SURVEY_QUESTIONS = 27;

    var self = this;

    self.surveyAnswers = {
        list: []
    };

    self.surveyLanguage = {
        language: "english"
    };

    self.wipeSurveyClean = function(){
        for (var i = 0; i < NUM_SURVEY_QUESTIONS; i++) {
            self.surveyAnswers.list.push({});
        }
    }

    self.wipeSurveyClean();

    self.surveyObject = { };
    
    self.getSurvey = function (language) {
        console.log('Service function ran with : ', language);
        self.surveyLanguage.language = language;
        $http.get('/survey/language', {
            params: {
                'language': language
            }
        }).then(function (response) {
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
        
    self.submitSurvey = function () {
        // console.log('submitSurvey', self.surveyAnswers);
        $http.post('/survey/' + self.surveyLanguage.language, self.surveyAnswers).then(function (response) {
            // console.log('submitSurvey response', response);
            if (response.status == 201) {
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

    self.beginSurvey = function(property, unit){
        // is the property/unit combo legit?
        $http.get('/survey/begin',{
            params: {
                'property': property,
                'unit': unit
            }
        }).then(function(response){
            console.log('response', response);
            
            if (response.data == "authorized"){
                // actually begin the survey
                self.wipeSurveyClean();
                $location.path('/survey-intro')
            } else if (response.data == 'responded'){
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#survey-begin-container')))
                    .clickOutsideToClose(true)
                    .title('Already Responded')
                    .textContent('This unit has already responded. Please try again.')
                    .ariaLabel('Survey Begin Error Alert')
                    .ok('OK')
                );
            } else if (response.data == 'unit not found'){
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#survey-begin-container')))
                    .clickOutsideToClose(true)
                    .title('Unit Not Found')
                    .textContent('This is not a valid unit. Please try again.')
                    .ariaLabel('Error Unit Not Found')
                    .ok('OK')
                );
            }
        });
            // legit: clear the survey object and go to /survey-q1

            // not legit: pop a toast
    }

}); //end of myApp.service