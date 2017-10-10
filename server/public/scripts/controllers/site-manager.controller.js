myApp.controller('SiteManagerController', ['SiteManagerService', function (SiteManagerService) {

    //--------------------------------------
    //-------------VARIABLES----------------
    //--------------------------------------

    var self = this;
    
    // connects SiteManagerService to the SiteManagerController
    self.SiteManagerService = SiteManagerService; 

    self.responseRate = SiteManagerService.responseRate;

    self.getResponseRate = function(property){
        property = [property];
        SiteManagerService.getResponseRate(property);
    }


    //--------------------------------------
    //-------------RUNTIME CODE-------------
    //--------------------------------------

    // Gets user's properties to select from the Select a Property dropdown on page load
    SiteManagerService.getUserProperties(); 
}]);