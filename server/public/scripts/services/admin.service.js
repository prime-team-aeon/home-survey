myApp.service('AdminService', ['$http', '$mdToast', '$location', function ($http, $mdToast, $location) {

    //--------------------------------------
    //-------------VARIABLES----------------
    //--------------------------------------

    var self = this;

    self.responseRate = {
        rate: 0
    }; // holds the response rate retrieved from the db
    self.allProperties = {}; // holds all unit/property combos    
    self.newProperty = {}; // data bound to the property and input fields in the Add New Property section
    self.users = {
        list: []
    }; // stores all administrators, site manager


    self.chartData = {}; // holds data to be charted

    self.gottenData = {}; // holds data gotten from the server for reporting

    self.chartsArray = []; // holds pointers to the charts we've built so that we can .destroy() them later

    // stores list of properties from the database
    // one entry per property. for building selectors
    self.propertyList = {
        list: []
    };

    // Used for the selected Property on the admin-properties page
    self.selectedEditProperty = {
        list: []
    };

    // Used for the selected Property on the admin-site-manager page
    self.selectedSiteManagerProperty = {
        list: []
    };


    //--------------------------------------
    //-------------FUNCTIONS----------------
    //--------------------------------------


    // add a new property to the database
    self.addNewProperty = function (property, unit) {

        // Runs the POST request if the user has entered both and property and unit
        if (property && unit) {
            $http({
                method: 'POST',
                url: '/admin/new-property',
                data: {
                    property: property,
                    unit: unit
                }
            }).then(function (response) {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent('Property has been added.')
                    .hideDelay(2000)
                );
                self.newProperty = {}; // sets new property and unit input boxes to empty
                self.getProperties(); // reload all properties to include the new property and unit
            });
            // Alert the user they need to enter in both a property and unit number into the input fields
        } else {
            $mdToast.show(
                $mdToast.simple()
                .textContent('Please enter in both a property name')
                .hideDelay(2000)
            );
        }
    }

    // takes a DOM HTML5 <canvas> element and builds a chart in it based on the chartType data and what's in self.gottenData
    self.buildChart = function (chartTarget, chartType) {

        console.log('buildChart', chartType);
        self.destroyAllCharts();

        if (chartType === 'Gender') {
            self.genderData = [0, 0, 0, 0];
            self.genderStrings = [];

            for (var i = 0; i < self.gottenData.list.length; i++) {

                let genderAnswer = self.gottenData.list[i].answer25;

                switch (genderAnswer) {
                    // 1,2,3 (string),null, 
                    case '1':
                        self.genderData[1]++;
                        break;
                    case '2':
                        self.genderData[2]++;
                        break;
                    case '3':
                        self.genderData[3]++;
                        self.genderStrings.push(genderAnswer);
                        break;
                    default:
                        self.genderData[0]++;
                }
            }

            var genderPieChart = new Chart(chartTarget, {
                type: 'pie',
                data: {
                    labels: ["No Response", "Male", "Female", "Self-Identify"],
                    datasets: [{
                        label: 'Gender',
                        data: self.genderData,
                        backgroundColor: [
                            '#aaaaaa',
                            '#c8e6c9',
                            '#a5d6a7',
                            '#81c784',
                        ],
                        borderColor: [
                            '#003300',
                            '#003300',
                            '#003300',
                            '#003300',
                        ],
                        borderWidth: 2
                    }]
                },
                options: {

                }
            });

            self.chartsArray.push(genderPieChart);            

        } else if (chartType === 'How Long') {
            self.howLongData = [0, 0, 0, 0, 0, 0];

            for (var i = 0; i < self.gottenData.list.length; i++) {
                let howLongAnswer = self.gottenData.list[i].answer23;
                if ((howLongAnswer == undefined) || (howLongAnswer == null)) {
                    self.howLongData[0]++;
                } else {
                    self.howLongData[howLongAnswer]++;
                }
            }

            var howLongPieChart = new Chart(chartTarget, {
                type: 'pie',
                data: {
                    labels: ["No Response", "1-3 Months", "4-11 Months", "1-3 Years", "3-5 Years", "5+ Years"],
                    datasets: [{
                        label: 'How Long Have You Lived Here?',
                        data: self.howLongData,
                        backgroundColor: [
                            '#aaaaaa',
                            '#c8e6c9',
                            '#81c784',
                            '#4caf50',
                            '#388e3c',
                            '#1b5e20',
                        ],
                        borderColor: [
                            '#003300',
                            '#003300',
                            '#003300',
                            '#003300',
                            '#003300',
                            '#003300'
                        ],
                        borderWidth: 2
                    }]
                },
                options: {

                }
            });

            self.chartsArray.push(howLongPieChart);

        } else if (chartType === 'Ethnicity') {
            self.ethnicityData = [0, 0, 0, 0, 0, 0, 0, 0];

            for (var i = 0; i < self.gottenData.list.length; i++) {
                let ethnicityAnswer = self.gottenData.list[i].answer24;

                if ((ethnicityAnswer == undefined) || (ethnicityAnswer == null)) {
                    self.ethnicityData[0]++;
                } else {
                    self.ethnicityData[ethnicityAnswer]++;
                }
            }

            var ethnicityPieChart = new Chart(chartTarget, {
                type: 'pie',
                data: {
                    labels: ["No Response", "American Indian", "African Immigrant (Somali, Nigerian, Eritrean, other)", "Asian / Pacific Islander", "Black / African American", "Caucasian / White", "Hispanic / Latino", "Other"],
                    datasets: [{
                        label: 'What Ethnicity Best Describes You?',
                        data: self.ethnicityData,
                        backgroundColor: [
                            '#aaaaaa',
                            '#c8e6c9',
                            '#a5d6a7',
                            '#81c784',
                            '#4caf50',
                            '#388e3c',
                            '#1b5e20',
                            '#003300'
                        ],
                        borderColor: [
                            '#003300',
                            '#003300',
                            '#003300',
                            '#003300',
                            '#003300',
                            '#003300',
                            '#003300',
                            '#003300'
                        ],
                        borderWidth: 2
                    }]
                },
                options: {

                }
            });

            self.chartsArray.push(ethnicityPieChart);

        } else if (chartType === 'Age') {
            self.ageData = [0, 0, 0, 0, 0, 0, 0];

            for (var i = 0; i < self.gottenData.list.length; i++) {
                let ageAnswer = self.gottenData.list[i].answer26;

                if ((ageAnswer == undefined) || (ageAnswer == null)) {
                    self.ageData[0]++;
                } else {
                    self.ageData[ageAnswer]++;
                }
            }

            var agePieChart = new Chart(chartTarget, {
                type: 'pie',
                data: {
                    labels: ["No Response", "Under 18", "18-25", "26-35", "36-45", "46-55", "Over 55"],
                    datasets: [{
                        label: 'How Old Are You?',
                        data: self.ageData,
                        backgroundColor: [
                            '#aaaaaa',
                            '#c8e6c9',
                            '#a5d6a7',
                            '#81c784',
                            '#4caf50',
                            '#388e3c',
                            '#1b5e20'
                        ],
                        borderColor: [
                            '#003300',
                            '#003300',
                            '#003300',
                            '#003300',
                            '#003300',
                            '#003300',
                            '#003300',
                            '#003300'
                        ],
                        borderWidth: 2
                    }]
                },
                options: {

                }
            });

            self.chartsArray.push(agePieChart);

        } else if (chartType === 'Income') {
            self.incomeData = [0, 0, 0, 0, 0, 0, 0, 0, 0];

            for (var i = 0; i < self.gottenData.list.length; i++) {

                let incomeAnswer = self.gottenData.list[i].answer26;

                if ((incomeAnswer == undefined) || (incomeAnswer == null)) {
                    self.incomeData[0]++;
                } else {
                    self.incomeData[incomeAnswer]++;
                }
            }

            var incomePieChart = new Chart(chartTarget, {
                type: 'pie',
                data: {
                    labels: ["No Response", "Less than $800/mo. (Less than $9,600/yr.)", "$801 - 1,300/mo. ($9601 - 15,600/yr.)", "$1,301 - 1,800/mo. ($15,601 - 21,600/yr.)", "$1,801 - 2,300/mo. ($21,601 - 27,600/yr.)", "$2,301 - 2,800/mo. ($27,601 - 33,600/yr.)", "$2,801 - 3,300/mo. ($33,601 - 39,600/yr.)", "$3,301 - 3,800/mo. ($39,601 - 45,600/yr.)", "More than $3,800/mo. (More than 45,600/yr.)"],
                    datasets: [{
                        label: 'What Is Your Income Level?',
                        data: self.incomeData,
                        backgroundColor: [
                            '#aaaaaa',
                            '#c8e6c9',
                            '#a5d6a7',
                            '#81c784',
                            '#66bb6a',
                            '#4caf50',
                            '#388e3c',
                            '#1b5e20',
                            '#003300'
                        ],
                        borderColor: [
                            '#003300',
                            '#003300',
                            '#003300',
                            '#003300',
                            '#003300',
                            '#003300',
                            '#003300',
                            '#003300',
                            '#003300'
                        ],
                        borderWidth: 2
                    }]
                },
                options: {

                }
            });

            self.chartsArray.push(incomePieChart);

        } else if(chartType === 'HOME Score'){
            
        }

    }


    // Function called from a button on the /admin-properties page that deletes a property/unit combination from the occupancy table
    self.deleteUnit = function (occupancyId) {

        $http({
            method: 'DELETE',
            url: '/admin/delete-unit',
            params: {
                occupancyId: occupancyId
            }
        }).then(function (response) {
            $mdToast.show(
                $mdToast.simple()
                .textContent('Unit has been deleted.')
                .hideDelay(2000)
            );
            self.getProperties();
            self.getSelectedEditProperty(self.selectedEditProperty.list[0].property, self.selectedEditProperty.list[0].year);
        });
    }


    // Delete a user from delete button the user section in admin
    self.deleteUser = function (username) {

        $http.delete('/user-roles/' + username).then(function (response) {
            if (response.status == 200) {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent('User deleted.')
                    .hideDelay(2000)
                );
            } else {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent('Deletion unsuccessful.')
                    .hideDelay(2000)
                );
            }
            self.getUsers(); // get a fresh list of users
        });
    }


    self.destroyAllCharts = function () {
        for (var i = 0; i < self.chartsArray.length; i++) {
            console.log('i', i);

            self.chartsArray[i].destroy();
        }
    }

    // GET request for all occupancy information from the occupancy table
    self.getAllProperties = function () {
        $http.get('/user-roles/allProperties/').then(function (response) {

            // stores all occupancy information from the occupancy table via the GET property request
            self.allProperties = response.data;

        });
    }

    // takes an array of properties, or the string 'all', and returns the response rate for that dataset
    self.getResponseRate = function (properties) {
        $http.get('/admin/responses', {
                params: {
                    properties: properties
                }
            })
            .then(function (response) {
                self.responseRate.rate = +response.data;
                self.responseRate.rate = self.responseRate.rate.toFixed(4);
                self.responseRate.rate = self.responseRate.rate * 100;
                console.log('responseRate.rate', self.responseRate.rate);

            });
    }

    // get the selected property on the admin properties edit page
    self.getSelectedEditProperty = function (selectedProperty, year) {
        $http({
            method: 'GET',
            url: 'admin/selectedProperty',
            params: {
                selectedProperty: selectedProperty,
                year: year
            }
        }).then(function (response) {
            self.selectedEditProperty.list = response.data;
        });

    }

    // get the selected property on the admin site manager properties edit page
    self.getSelectedSiteProperty = function (selectedProperty, year) {
        $http({
            method: 'GET',
            url: 'admin/selectedProperty',
            params: {
                selectedProperty: selectedProperty,
                year: year
            }
        }).then(function (response) {
            self.selectedSiteManagerProperty.list = response.data;
        });

    }

    // take in a year and an array of properties, and get the matching dataset from the server
    self.getData = function (year, properties, chartFunction, domElement) {
        console.log('getData year, properties, callback', year, properties, chartFunction);

        $http({
            method: 'GET',
            url: '/admin/data',
            params: {
                year: year,
                properties: properties
            }
        }).then(function (response) {
            self.gottenData.list = response.data;
            console.log('self.gottenData.list', self.gottenData.list);

            // now we actually build the chart
            self.buildChart(domElement, chartFunction);

            // switch (chartFunction) {
            //     case 'gender':
            //         self.buildDemographicsChart(domElement, 'gender');
            //         break;
            //     case 'howLong':
            //         self.buildDemographicsChart(domElement, 'howLong');
            //         break;
            //     default:
            //         console.log('admin service buildChart got bad callback:', chartFunction);
            //         return;
            // }

        })
    }

    // GET request for properties from the db
    self.getProperties = function () {
        self.propertyList.list = [];
        // set a variable to get the current uyear
        let thisYear = new Date();
        thisYear = thisYear.getFullYear();

        $http.get('/user-roles/properties/' + thisYear).then(function (response) {

            // sets propertyList to an array with the unique property names in the occupancy table
            for (var i = 0; i < response.data.length; i++) {
                self.propertyList.list.push(response.data[i].property);
            }

        });
    }


    // GET request for all users (username, active, and role status) from the users table
    self.getUsers = function () {
        $http({
            method: 'GET',
            url: '/user-roles',
        }).then(function (response) {
            self.users.list = response.data;
        });
    };


    // Authorize or Deauthorize a site manager for a property
    self.manageAuth = function (userId, property, route) {
        var authInfo = {
            id: userId,
            property: property
        }

        $http.put('/user-roles/properties/' + route, authInfo).then(function (response) {
            self.getUsers();
        });
    }


    // Update the users active status PUT request
    self.toggleActive = function (user) {
        console.log('heres the user', user);

        $http({
            method: 'PUT',
            url: '/user-roles/active',
            data: user
        }).then(function (response) {
            self.getUsers();
        });
    };


    // PUT request to update the occupied status of a unit 
    self.updateOccupied = function (property) {
        $http({
            method: 'PUT',
            url: '/admin/updateOccupied',
            data: property
        }).then(function (response) {
            if (self.selectedEditProperty.list[0]) {
                self.getSelectedEditProperty(self.selectedEditProperty.list[0].property, self.selectedEditProperty.list[0].year);
            } else if (self.selectedSiteManagerProperty.list[0]) {
                self.getSelectedSiteProperty(self.selectedSiteManagerProperty.list[0].property, self.selectedSiteManagerProperty.list[0].year);
            }

        })
    }


    // Updates a user role from the database
    self.updateUserRole = function (user) {

        $http({
            method: 'PUT',
            url: '/user-roles/role',
            data: {
                user: user,
                role: user.role
            }
        }).then(function (response) {
            self.getUsers(); // get a fresh list of users with updates role
        });
    };


    //--------------------------------------
    //-------------RUNTIME CODE-------------
    //--------------------------------------

    self.getProperties(); // build propertyList immediately

}]);





// self.buildTestChart = function(){
//     self.chartData.list = [0,0,0,0,0];
//     for (var i = 0; i < self.gottenData.list.length; i++) {
//         switch(self.gottenData.list[i].answer1){
//             // 1,2,3,4,null
//             case 1:
//                 self.chartData.list[1]++;
//                 break;
//             case 2:
//                 self.chartData.list[2]++;
//                 break;
//             case 3:
//                 self.chartData.list[3]++;
//                 break;
//             case 4:
//                 self.chartData.list[4]++;
//                 break;
//             default:
//                 self.chartData.list[0]++;
//                 break;
//         } 
//     }
//     console.log('AdminService.chartData.list', self.chartData.list);

// }