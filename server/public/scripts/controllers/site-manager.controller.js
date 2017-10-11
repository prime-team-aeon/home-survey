myApp.controller('SiteManagerController', ['SiteManagerService', 'UserService', 'AdminService', function (SiteManagerService, UserService, AdminService) {

    //--------------------------------------
    //-------------VARIABLES----------------
    //--------------------------------------

    var self = this;
    
    // connects SiteManagerService to the SiteManagerController
    self.SiteManagerService = SiteManagerService;
    
    // connects AdminService to the SiteManagerController
    self.AdminService = AdminService; 
    
    // connects UserService to the SiteManagerController
    self.UserService = UserService; 

    self.responseRate = SiteManagerService.responseRate;

    self.propertyList = SiteManagerService.propertyList;

    // magic numbers for building the year selector
    const START_YEAR = 2015;
    const NUM_FUTURE_YEARS = 1;

    // get the current year so the select defaults to it
    let now = new Date();
    self.thisYear = now.getFullYear();

    self.yearsArray = [];
    self.yearToAdd = self.thisYear;

    //--------------------------------------
    //-------------FUNCTIONS----------------
    //--------------------------------------

    self.logout = function () {
        UserService.logout();
    };

    self.getResponseRate = function (property) {
        property = [property];
        SiteManagerService.getResponseRate(property);
    }

    // send the users submission for a property and year to the service
    self.getProperty = function(property, year) {        
        SiteManagerService.getProperty(property.property, year);   
    }
    
    //--------------------------------------
    //-------------RUN TIME CODE----------------
    //--------------------------------------
    
    // build yearsArray - this is what's shown in the select. Starts at START_YEAR and ends at that plus NUM_FUTURE_YEARS
    for (i = START_YEAR; i < (self.thisYear + NUM_FUTURE_YEARS); i++) {
        self.yearsArray.push(i);
    }

    SiteManagerService.getPropertyList();
    
}]);