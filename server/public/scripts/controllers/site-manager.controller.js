myApp.controller('SiteManagerController', ['SiteManagerService', 'UserService', function (SiteManagerService, UserService) {

    //--------------------------------------
    //-------------VARIABLES----------------
    //--------------------------------------

    var self = this;
    
    // connects SiteManagerService to the SiteManagerController
    self.SiteManagerService = SiteManagerService; 

    self.logout = function () {
        UserService.logout();
        
    };


    //--------------------------------------
    //-------------RUNTIME CODE-------------
    //--------------------------------------

    // Gets user's properties to select from the Select a Property dropdown on page load
    SiteManagerService.getUserProperties(); 
}]);