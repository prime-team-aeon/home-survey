myApp.controller('SiteManagerController', ['SiteManagerService', function (SiteManagerService) {

    //--------------------------------------
    //-------------VARIABLES----------------
    //--------------------------------------

    var self = this;
    
    // connects SiteManagerService to the SiteManagerController
    self.SiteManagerService = SiteManagerService; 


    //--------------------------------------
    //-------------RUNTIME CODE-------------
    //--------------------------------------

    // Gets user's properties to select from the Select a Property dropdown on page load
    SiteManagerService.getUserProperties(); 
}]);