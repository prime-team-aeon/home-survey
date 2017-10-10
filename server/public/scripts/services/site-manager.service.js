myApp.service('SiteManagerService', ['$http', function ($http) {
    var self = this;

    self.properties = {
        list: []
    };

    self.responseRate = {
        rate: 0
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

    // get a site managers property list
    self.getUserProperties = function () {
        $http({
            method: 'GET',
            url: '/site-manager/getProperties',
        }).then(function (response) {
            self.properties.list = response.data;
            self.selectProperties = self.properties.list.map(function (property) {
                return property.property
            });
            self.selectProperties = self.selectProperties.filter(function (property, index) {
                return self.selectProperties.indexOf(property) == index;
            });
        });
    };

    // Update the property paid column in the database 
    self.updatePaid = function(property) {
        $http({
            method: 'PUT',
            url: '/site-manager/updatePaid',
            data: property
        }).then(function(response){
            self.getUserProperties();
        })

    }

}]);