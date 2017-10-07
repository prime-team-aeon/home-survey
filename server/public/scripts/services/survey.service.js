myApp.service('SurveyService', function ($http, $location, $mdDialog) {

    //--------------------------------------
    //-------------VARIABLES----------------
    //--------------------------------------

    const NUM_SURVEY_QUESTIONS = 27; // used as a magic number for building the answers array

    var self = this;

    self.surveyObject = {}; // holds the translated answers from the db
    self.surveyProperty = ""; // holds the user-selected property
    self.surveyUnit = ""; // holds the user-selected unit

    self.surveyAnswers = { // holds the user's responses
        list: []
    };

    self.surveyLanguage = { // holds the user-selected language, default English
        language: "english"
    };


    
    //--------------------------------------
    //-------------FUNCTIONS----------------
    //--------------------------------------

    // checks that the property and unit are eligible to fill out survey
    // displays error dialogs on error states
    // if unit & property are ok, stores those values, wipes the answers array, and sends the user to the survey
    self.beginSurvey = function (property, unit) {
        // is the property/unit combo legit?        
        $http.get('/survey/begin', {
            params: {
                'property': property,
                'unit': unit
            }
        }).then(function (response) {
            // console.log('response', response);

            if (response.data == "authorized") {
                // legit: clear the survey object and go to /survey-q1
                self.wipeSurveyClean();
                self.surveyProperty = property;
                self.surveyUnit = unit;
                $location.path('/survey-intro')
            } else if (response.data == 'responded') {
                // not legit: pop a toast
                $mdDialog.show(
                    $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('Already Responded')
                    .textContent('This unit has already responded. Please try again.')
                    .ariaLabel('Survey Begin Error Alert')
                    .ok('OK')
                );
            } else if (response.data == 'unit not found') {
                // not legit: pop a toast
                $mdDialog.show(
                    $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('Unit Not Found')
                    .textContent('This is not a valid unit. Please try again.')
                    .ariaLabel('Error Unit Not Found')
                    .ok('OK')
                );
            }
        });
    }


    // builds the surveyObject with translated answers in the user-selected language.
    self.getSurvey = function (language) {
        self.surveyLanguage.language = language;

        $http.get('/survey/language', {
            params: {
                'language': language
            }
        }).then(function (response) {
            for (var i = 0; i < response.data.questions.length; i++) {
                self.surveyObject[response.data.questions[i].question_number] = response.data.questions[i][language];
            }
            for (var i = 0; i < response.data.translations.length; i++) {
                self.surveyObject[response.data.translations[i].type] = response.data.translations[i][language];
            }

        }) //end http.get
    }; //end of self.getSurvey


    // sends the user's language, property, unit, and survey answers to the db to be stored
    // displays error dialogs if a unit has already responded or a server error happens, or takes the user to the thanks page if successful
    self.submitSurvey = function () {
        console.log('self.surveyAnswers', self.surveyAnswers);
        

        $http.post('/survey', self.surveyAnswers, {
            params: {
                'language': self.surveyLanguage.language,
                'property': self.surveyProperty,
                'unit': self.surveyUnit
            }
        }).then(function (response) {
            if (response.status == 201) {
                $location.path('/survey-thanks');
            } else if (response.data == 'responded') {
                $mdDialog.show(
                    $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('Already Responded')
                    .textContent('This unit has already responded. Please try again.')
                    .ariaLabel('Survey Begin Error Alert')
                    .ok('OK')
                );
            } else {
                $mdDialog.show(
                    $mdDialog.alert()
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


    // clears out all responses and rebuilds the answers array with null objects
    self.wipeSurveyClean = function () {
        self.surveyAnswers.list = [];
        for (var i = 0; i < NUM_SURVEY_QUESTIONS; i++) {
            self.surveyAnswers.list.push({});
        }
    }


    //--------------------------------------
    //-------------RUNTIME CODE-------------
    //--------------------------------------

    self.wipeSurveyClean(); // start out with a fresh survey
    self.getSurvey('english'); // Load english as language on load
    



}); //end of myApp.service