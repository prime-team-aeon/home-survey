myApp.controller('AdminPropertiesController', ['AdminService', '$mdDialog', function (AdminService, $mdDialog) {
    
    //--------------------------------------
    //-------------VARIABLES----------------
    //--------------------------------------
    
    var self = this;
    self.AdminService = AdminService; // connects AdminService to the AdminPropertiesController
    self.allProperties = AdminService.allProperties; // list of all property information from the occupancy table
    self.uniqueProperties = AdminService.uniqueProperties;

    //--------------------------------------
    //-------------FUNCTIONS----------------
    //--------------------------------------

    // Called from the Add Property button on the /admin-property page. Sends a nee property and unit number to the admin service
    self.addNewProperty = function () {
        AdminService.addNewProperty(AdminService.newProperty.name, AdminService.newProperty.unit);
    }

    // Called from a checkbox on the /admin-properties page. Sends unit occupied status update to the admin service
    self.updateOccupied = function (property) {
        AdminService.updateOccupied(property);
    }

    //--------------------------------------
    //-------------RUNTIME CODE-------------
    //--------------------------------------

    // On controller load, get list of all property/unit combos from db
    AdminService.getAllProperties();


}]); // End of AdminPropertiesController