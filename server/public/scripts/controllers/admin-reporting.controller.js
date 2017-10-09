myApp.controller('AdminReportingController', ['AdminService', '$mdDialog', '$timeout', '$mdSidenav', '$log', function (AdminService, $mdDialog, $timeout, $mdSidenav, $log) {
    var self = this;

    self.AdminService = AdminService;

    self.chartData = AdminService.chartData; // actual data is in .list property, which is an array of objects

    self.yearsToGet = [];
    self.propertiesToGet = [];

    const START_YEAR = 2010;
    var thisYear = new Date();
    thisYear = thisYear.getFullYear();
    self.yearsArray = [];

    for (var i = START_YEAR; i <= thisYear; i++) {
        self.yearsArray.push(i);
    }

    self.propertyList = AdminService.propertyList; // list of unique properties in .list

    // Toggle Sidenav
    self.openLeftMenu = function () {
        $mdSidenav('left').toggle();
    };

    // take in an array of years and an array of properties, and get the matching dataset from the server
    self.getData = function (years, properties) {
        AdminService.getData(years, properties);
    }

    self.getData([2017, 2018], ['1822 Park', 'The Jourdain']);

    var ctx = document.getElementById("myChart").getContext("2d");

    // add year to list of years to get from db
    self.addYear = function(newYear){
        console.log('addYear', newYear);
        self.yearsToGet.push(newYear);
    }

    // add property to list of properties to get from db
    self.addProperty = function(newProperty){
        console.log('addProperty', newProperty);

        if(newProperty != undefined){
            console.log('defined');
            
            if(newProperty.length > 0){
                // look for duplicate
                console.log('length > 0');
                
                var index = self.propertiesToGet.indexOf(newProperty);
                console.log('index', index);
                
                if (index == -1){
                    console.log('index ok');
                    
                    self.propertiesToGet.push(newProperty);
                    self.typedProperty = null;                
                }
            }
        }        
    }

    // remove year from list of years to get from db
    self.deleteYear = function(year){
        console.log('deleteYear', year);
        var index = self.yearsToGet.indexOf(year);
        self.yearsToGet.splice(index,1);
    }

    // remove property from list of properties to get from db
    self.deleteProperty = function(property){
        console.log('deleteProperty', property);
        var index = self.propertiesToGet.indexOf(property);
        self.propertiesToGet.splice(index,1);
    }

    // build test chart
    self.chartTest = function () {
        console.log('arc.chartTest()');

        AdminService.buildTestChart();

        console.log('arc.chartData.list', self.chartData.list);
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                datasets: [{
                    label: '# of Votes',
                    data: self.chartData.list,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });

    }

}]);