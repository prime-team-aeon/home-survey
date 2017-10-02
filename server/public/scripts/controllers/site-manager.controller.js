myApp.controller('SiteManagerController', ['SiteManagerService', function (SiteManagerService) {    
    var self = this;
    self.SiteManagerService = SiteManagerService;
    SiteManagerService.getUserProperties();
}]);