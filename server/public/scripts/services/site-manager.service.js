myApp.service('SiteManagerService', ['$http', '$mdToast', function ($http, $mdToast) {
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
            self.properties.list = response.data;
        })
    };

    // takes an array of properties, or the string 'all', and returns the response rate for that dataset
    self.getResponseRate = function (properties, year) {
        $http.get('/admin/responses', {
            params: {
                properties: properties,
                year: year
            }
        })
            .then(function (response) {
                self.responseRate.rate = +response.data;
                self.responseRate.rate = self.responseRate.rate * 100;
                self.responseRate.rate = self.responseRate.rate.toFixed(2);
            });
    };

    // Update the property paid column in the database 
    self.updatePaid = function (property) {
        $http({
            method: 'PUT',
            url: '/site-manager/updatePaid',
            data: property
        }).then(function (response) {
            self.getProperty(response.data[0].property, response.data[0].year);
        })

    }

    // PUT request to update the occupied status of a unit 
    self.updateOccupied = function (property) {        
        $http({
            method: 'PUT',
            url: '/admin/updateOccupied',
            data: property
        }).then(function (response) {
            self.getProperty(response.data[0].property, response.data[0].year);
        })
    }

}]);