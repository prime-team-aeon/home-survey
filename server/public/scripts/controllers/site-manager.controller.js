myApp.controller('SiteManagerController', ['SiteManagerService', 'UserService', function (SiteManagerService, UserService) {

    //--------------------------------------
    //-------------VARIABLES----------------
    //--------------------------------------

    var self = this;
    
    // connects SiteManagerService to the SiteManagerController
    self.SiteManagerService = SiteManagerService; 

<<<<<<< HEAD
    self.logout = function () {
        UserService.logout();
        
    };
=======
    self.responseRate = SiteManagerService.responseRate;

    self.getResponseRate = function(property){
        property = [property];
        SiteManagerService.getResponseRate(property);
    }
>>>>>>> master


    //--------------------------------------
    //-------------RUNTIME CODE-------------
    //--------------------------------------

    // Gets user's properties to select from the Select a Property dropdown on page load
    SiteManagerService.getUserProperties(); 
}]);