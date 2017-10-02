myApp.service('SiteManagerService', ['$http', function ($http) {
    var self = this;

    self.properties = {
        list: []
    }

    // get users username, active, and role status
    self.getUserProperties = function () {
        $http({
            method: 'GET',
            url: '/site-manager',
        }).then(function (response) {
            console.log('response', response);
            self.properties.list = response.data;
        });
    };

}]);