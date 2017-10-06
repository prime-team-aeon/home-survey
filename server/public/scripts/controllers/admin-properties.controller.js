myApp.controller('AdminPropertiesController', ['AdminService', 'UserService', '$mdDialog', '$timeout', '$mdSidenav', '$log', function (AdminService, UserService, $mdDialog, $timeout, $mdSidenav, $log) {
    var self = this;

    self.UserService = UserService;
    self.AdminService = AdminService;
    AdminService.getAllProperties();

    self.allProperties = AdminService.allProperties;
    self.uniqueProperties = AdminService.uniqueProperties;

    // Send a new property function to the admin service
    self.addNewProperty = function () {
        AdminService.addNewProperty(AdminService.newProperty.name, AdminService.newProperty.unit);
    }
    
    // Send a new property function to the admin service
    self.addNewUnit = function () {
        AdminService.addNewUnit(AdminService.newUnit.name, self.selectedItem);
    }

    // Send an unit occupied status update to the admin service
    self.updateOccupied = function(property) {
        console.log('updateOccupied property', property);
        AdminService.updateOccupied(property);
    }

    // Toggle Sidenav
    self.openLeftMenu = function () {
        $mdSidenav('left').toggle();
    };
    
}]);