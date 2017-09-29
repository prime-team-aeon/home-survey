myApp.service('SurveyService', function ($http, $location) {
    console.log('SurveyService Loaded');

    var self = this;

    self.surveyObject = { list: [] };

    self.getSurvey = function () {
        $http({
            method: 'GET',
            url: '/survey',
        }).then(function (response) {
            console.log('survey get', response);
            self.surveyObject.list = response.data;
        });
    };


    self.getSurvey();
});
