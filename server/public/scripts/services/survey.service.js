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
    
    self.getSurvey = function () {
        $http({
            method: 'GET',
            url: '/survey/one',
        }).then(function (response) {
            console.log('survey get', response);
            self.surveyObject.one = response.data;
        });
        $http({
            method: 'GET',
            url: '/survey/two',
        }).then(function (response) {
            console.log('survey get2', response);
            self.surveyObject.two = response.data;
        });
        $http({
            method: 'GET',
            url: '/survey/three',
        }).then(function (response) {
            console.log('survey get3', response);
            self.surveyObject.three = response.data;
        });
        $http({
            method: 'GET',
            url: '/survey/four',
        }).then(function (response) {
            console.log('survey get4', response);
            self.surveyObject.four = response.data;
        });
        $http({
            method: 'GET',
            url: '/survey/demographics',
        }).then(function (response) {
            console.log('survey get4', response);
            self.surveyObject.demographics = response.data;
        });
        
    };

    self.getSurvey();

});
