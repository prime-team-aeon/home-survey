myApp.controller('AdminReportingController', ['AdminService', '$mdDialog', '$timeout', '$mdSidenav', '$log', function (AdminService, $mdDialog, $timeout, $mdSidenav, $log) {


    //--------------------------------------
    //-------------VARIABLES----------------
    //--------------------------------------


    var self = this;

    self.AdminService = AdminService;

    // List of calculations we support for reporting
    self.calcList = [
        "Scores",
        "Gender",
        "How Long",
        "Ethnicity",
        "Age",
        "Income"
    ];

    self.yearToGet = thisYear;

    self.chartData = AdminService.chartData; // actual data is in .list property, which is an array of objects


    const START_YEAR = 2010;
    var thisYear = new Date();
    thisYear = thisYear.getFullYear();
    self.yearsArray = [];

    for (var i = thisYear; i >= START_YEAR; i--) {
        self.yearsArray.push(i);
    }

    self.yearToGet = thisYear;
    
    self.propertiesToGet = [];
    self.selectAllProperties = true;

    self.propertyList = AdminService.propertyList; // list of unique properties in .list

    canvas = document.getElementById("myChart");
    context = document.getElementById("myChart").getContext("2d");



    //--------------------------------------
    //-------------FUNCTIONS----------------
    //--------------------------------------

    // add property to list of properties to get from db
    self.addProperty = function (newProperty) {
        console.log('addProperty', newProperty);

        if (newProperty != undefined) {
            console.log('defined');

            if (newProperty.length > 0) {
                // look for duplicate
                console.log('length > 0');

                var index = self.propertiesToGet.indexOf(newProperty);
                console.log('index', index);

                if (index == -1) {
                    console.log('index ok');

                    self.propertiesToGet.push(newProperty);
                    self.typedProperty = null;
                }
            }
        }
    }

    self.clearCalc = function () {
        self.yearToGet = null;
        self.propertiesToGet = [];
        self.selectAllProperties = false;
        self.calculation = null;
        AdminService.destroyAllCharts();

    }

    // remove property from list of properties to get from db
    self.deleteProperty = function (property) {
        console.log('deleteProperty', property);
        var index = self.propertiesToGet.indexOf(property);
        self.propertiesToGet.splice(index, 1);
    }

    // download the current chart as a png
    self.downloadChart = function () {
        var datastream = canvas.toDataURL('image/png');
        /* Change MIME type to trick the browser to downlaod the file instead of displaying it */
        datastream = datastream.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');

        /* In addition to <a>'s "download" attribute, we define HTTP-style headers */
        datastream = datastream.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=Chart.png');

        window.open(datastream);

        // this.href = dt;
    };

    // Toggle Sidenav
    self.openLeftMenu = function () {
        $mdSidenav('left').toggle();
    };

    // takes a string based on user input, and gets the data and builds a chart based on that
    self.runCalc = function (calc) {
        console.log('arc.runCalc', calc);

        if (self.selectAllProperties) {
            // "All" is one of the selected properties, which supercedes anything else
            self.propertiesToGet = AdminService.propertyList.list;
        }

        domElement = context; // where we're going to build the chart
        AdminService.getData(self.yearToGet, self.propertiesToGet, calc, domElement);

        
        // switch (calc) {
        //     case "Gender":
        //         domElement = context; // where we're going to build the chart

        //         AdminService.getData(self.yearToGet, self.propertiesToGet, 'gender', domElement);
        //         // we have to send the DOM element to build the chart in to the service, because we don't seem to be able to data-bind the dataset inside the chart constructor
        //         break;
        //     case "How Long":
        //         domElement = context; // where we're going to build the chart

        //         AdminService.getData(self.yearToGet, self.propertiesToGet, 'howLong', domElement);
        //         // we have to send the DOM element to build the chart in to the service, because we don't seem to be able to data-bind the dataset inside the chart constructor
        //         break;

        //     case "Ethnicity":
        //         domElement = context; // where we're going to build the chart

        //         AdminService.getData(self.yearToGet, self.propertiesToGet, 'ethnicity', domElement);
        //         // we have to send the DOM element to build the chart in to the service, because we don't seem to be able to data-bind the dataset inside the chart constructor
        //         break;

        //     default:
        //         console.log('arc.runCalc NYI');
        // }



    }




    //--------------------------------------
    //-------------RUNTIME CODE-------------
    //--------------------------------------

    AdminService.getResponseRate(['all']);
    

}]);
