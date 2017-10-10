myApp.controller('AdminPropertiesController', ['AdminService', 'UserService', '$mdDialog', '$timeout', '$mdSidenav', '$log', function (AdminService, UserService, $mdDialog, $timeout, $mdSidenav, $log) {
    var self = this;

    self.UserService = UserService;
    self.AdminService = AdminService; // connects AdminService to the AdminPropertiesController

    self.allProperties = AdminService.allProperties; // list of all property information from the occupancy table

    self.propertyList = AdminService.propertyList; // List of distinct properties for the select dropdown

    self.selectedEditProperty = AdminService.selectedEditProperty; // Property selected by user to edit

    // default orderby column in edit properties
    self.orderByColumn = 'unit';

    // magic numbers for building the year selector
    const START_YEAR = 2010;
    const NUM_FUTURE_YEARS = 3;

    // get the current year so the select defaults to it
    let now = new Date();
    self.thisYear = now.getFullYear();

    self.yearsArray = [];
    self.yearToAdd = self.thisYear;

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

    // Send the selected property and year to the AdminService to GET the selected year
    self.getSelectedEditProperty = function (selectedProperty, year) {
        AdminService.getSelectedEditProperty(selectedProperty, year);
    }

    //--------------------------------------
    //-------------RUNTIME CODE-------------
    //--------------------------------------

    // build yearsArray - this is what's shown in the select. Starts at START_YEAR and ends at that plus NUM_FUTURE_YEARS
    for (i = START_YEAR; i < (self.thisYear + NUM_FUTURE_YEARS); i++) {
        self.yearsArray.push(i);
    }

}]);
