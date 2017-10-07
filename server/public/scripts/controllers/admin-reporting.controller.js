myApp.controller('AdminReportingController', ['AdminService', '$mdDialog', '$timeout', '$mdSidenav', '$log', function (AdminService, $mdDialog, $timeout, $mdSidenav, $log) {
    var self = this;

    self.AdminService = AdminService;

    // Toggle Sidenav
    self.openLeftMenu = function () {
        $mdSidenav('left').toggle();
    };

    
}]);