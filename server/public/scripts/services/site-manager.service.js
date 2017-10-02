myApp.service('SiteManagerService', ['$http', function ($http) {
    var self = this;

    self.properties = {
        list: []
    }

    // get a site managers property list
    self.getUserProperties = function () {
        $http({
            method: 'GET',
            url: '/site-manager',
        }).then(function (response) {
            self.properties.list = response.data;
            console.log('self.properties.list', self.properties.list);
        });
    };

    // Update the property paid column in the database 
    self.updatePaid = function(property) {
        console.log('property', property);
        $http({
            method: 'PUT',
            url: '/site-manager/updatePaid',
            data: property
        }).then(function(response){
            console.log('updatePaid response', response);
            self.getUserProperties();
        })
        
    }

}]);