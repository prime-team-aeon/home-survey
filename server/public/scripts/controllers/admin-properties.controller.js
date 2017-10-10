myApp.controller('AdminPropertiesController', ['AdminService', 'UserService', '$mdDialog', '$timeout', '$mdSidenav', '$log', function (AdminService, UserService, $mdDialog, $timeout, $mdSidenav, $log) {
    var self = this;

    self.UserService = UserService;
    self.AdminService = AdminService; // connects AdminService to the AdminPropertiesController
    // AdminService.getAllProperties();

    self.allProperties = AdminService.allProperties; // list of all property information from the occupancy table

    self.propertyList = AdminService.propertyList;

    self.selectedEditProperty = AdminService.selectedEditProperty;

    // default orderby column in edit properties
    self.orderByColumn = 'unit';

    self.yearsToSelect = {
        list: [2017, 2018, 2019, 2020]
    }

    //--------------------------------------
    //-------------FUNCTIONS----------------
    //--------------------------------------

    // Called from the Add Property button on the /admin-property page. Sends a new property and unit number to the admin service
    self.addNewProperty = function () {
        AdminService.addNewProperty(AdminService.newProperty.name, AdminService.newProperty.unit);
    }

    // Called from a checkbox on the /admin-properties page. Sends unit occupied status update to the admin service
    self.updateOccupied = function (property) {
        AdminService.updateOccupied(property);
    }

    // Toggle Sidenav
    self.openLeftMenu = function () {
        $mdSidenav('left').toggle();
    };

    self.getSelectedEditProperty = function(selectedProperty, year) {
        AdminService.getSelectedEditProperty(selectedProperty, year);        
    }
    
}]);
