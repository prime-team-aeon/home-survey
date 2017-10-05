myApp.controller('AdminPropertiesController', ['AdminService', '$mdDialog', function (AdminService, $mdDialog) {
    var self = this;

    self.AdminService = AdminService;
    AdminService.getAllProperties();

    self.allProperties = AdminService.allProperties;
    self.uniqueProperties = AdminService.uniqueProperties;

    // Send a new property function to the admin service
    self.addNewProperty = function () {
        AdminService.addNewProperty(AdminService.newProperty.name, AdminService.newProperty.unit);
    }

    // Send an unit occupied status update to the admin service
    self.updateOccupied = function(property) {
        console.log('updateOccupied property', property);
        AdminService.updateOccupied(property);
    }
    
}]);