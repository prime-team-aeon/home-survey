myApp.controller('AdminPropertiesController', ['UserRolesService', '$mdDialog', function (UserRolesService, $mdDialog) {
    var self = this;

    self.UserRolesService = UserRolesService;
    UserRolesService.getAllProperties();

    self.allProperties = UserRolesService.allProperties;
    self.uniqueProperties = UserRolesService.uniqueProperties;

    self.goToUpdateProperties = function () {
        UserRolesService.getAllProperties();
    }

    self.addNewProperty = function () {
        UserRolesService.addNewProperty(UserRolesService.newProperty.name, UserRolesService.newProperty.unit);
    }
}]);