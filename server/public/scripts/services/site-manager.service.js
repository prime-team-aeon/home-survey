myApp.service('SiteManagerService', ['$http', function ($http) {
    var self = this;

    self.propertyList = {
        list: []
    }

    self.properties = {
        list: []
    };

    self.responseRate = {
        rate: 0
    };

    // get the property and year that the site manager selects
    self.getPropertyList = function () {
        $http({
            method: 'GET',
            url: '/site-manager/propertyList'
        }).then(function (response) {
            self.propertyList.list = response.data;            
        })
    };

    // get the property and year that the site manager selects
    self.getProperty = function (property, year) {
        $http({
            method: 'GET',
            url: '/site-manager/getProperty',
            params: {
                property: property,
                year: year
            }
        }).then(function (response) {
            console.log('yaaaaay', response.data);
        })
    };

    // takes an array of properties, or the string 'all', and returns the response rate for that dataset
    self.getResponseRate = function (properties) {
        $http.get('/admin/responses', {
            params: {
                properties: properties
            }
        })
            .then(function (response) {
                self.responseRate.rate = +response.data;
                self.responseRate.rate = self.responseRate.rate.toFixed(4);
                self.responseRate.rate = self.responseRate.rate * 100;
                console.log('responseRate.rate', self.responseRate.rate);

            });
    };

    // Update the property paid column in the database 
    self.updatePaid = function (property) {
        $http({
            method: 'PUT',
            url: '/site-manager/updatePaid',
            data: property
        }).then(function (response) {
            self.getUserProperties();
        })

    }

}]);