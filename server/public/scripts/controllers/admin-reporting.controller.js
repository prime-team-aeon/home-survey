myApp.controller('AdminReportingController', ['AdminService', '$mdDialog', '$timeout', '$mdSidenav', '$log', function (AdminService, $mdDialog, $timeout, $mdSidenav, $log) {
    var self = this;

    self.AdminService = AdminService;

    self.chartData = AdminService.chartData; // actual data is in .list property, which is an array of objects

    // Toggle Sidenav
    self.openLeftMenu = function () {
        $mdSidenav('left').toggle();
    };

    // take in an array of years and an array of properties, and get the matching dataset from the server
    self.getData = function(years, properties) {
        AdminService.getData(years, properties);
    }
    
    self.getData(2017, ['1822 Park', 'The Jourdain']);
}]);