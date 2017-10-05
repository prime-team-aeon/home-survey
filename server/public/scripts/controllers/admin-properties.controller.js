myApp.controller('AdminPropertiesController', ['AdminService', '$mdDialog', function (AdminService, $mdDialog) {
    var self = this;

    self.AdminService = AdminService;
    AdminService.getAllProperties();

    self.allProperties = AdminService.allProperties;
    self.uniqueProperties = AdminService.uniqueProperties;

    self.goToUpdateProperties = function () {
        AdminService.getAllProperties();
    }

    self.addNewProperty = function () {
        AdminService.addNewProperty(AdminService.newProperty.name, AdminService.newProperty.unit);
    }
    
}]);