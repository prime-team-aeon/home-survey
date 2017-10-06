myApp.service('AdminService', ['$http', '$mdToast', '$location', function ($http, $mdToast, $location) {

    //--------------------------------------
    //-------------VARIABLES----------------
    //--------------------------------------

    var self = this;

    self.allProperties = {}; // holds all unit/property combos    
    self.newProperty = {};
    self.users = {};

    // stores list of properties from the database
    // one entry per property. for building selectors
    self.propertyList = {
        list: []
    };


    //--------------------------------------
    //-------------FUNCTIONS----------------
    //--------------------------------------


    // add a new property to the database
    self.addNewProperty = function (property, unit) {

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
                self.newProperty = {};
                self.getAllProperties();
            });
        } else {
            $mdToast.show(
                $mdToast.simple()
                .textContent('Please enter in both a property name')
                .hideDelay(2000)
            );
        }
    }

    // add a new property unit to the database
    self.addNewUnit = function (unit, property) {

        if (unit) {
            $http({
                method: 'POST',
                url: '/admin/new-unit',
                data: {
                    property: property,
                    unit: unit
                }
            }).then(function (response) {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('Unit has been added.')
                        .hideDelay(2000)
                );
                self.newUnit = {};
                self.getAllProperties();
            });
        } else {
            $mdToast.show(
                $mdToast.simple()
                    .textContent('Please enter in a unit name')
                    .hideDelay(2000)
            );
        }
    }


    // Delete a properties unit request sent to the server
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
            self.getAllProperties();
        });
    }


    // delete a user from the database
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
            self.getUsers();
        });
    }


    // get list of all property/unit combos from db
    self.getAllProperties = function () {
        $http.get('/user-roles/allProperties/').then(function (response) {

            // get the properties
            self.uniqueProperties = [];
            response.data.forEach(function (occupancy) {

                self.uniqueProperties = response.data.map(function (occupancy) {
                    return occupancy.property
                });

                self.uniqueProperties = self.uniqueProperties.filter(function (property, index) {
                    return self.uniqueProperties.indexOf(property) == index;
                });

            });

            self.allProperties = response.data;
            $location.path('/admin-properties');
        });
    }


    // get list of properties from db
    self.getProperties = function () {
        let thisYear = new Date();
        thisYear = thisYear.getFullYear();
        $http.get('/user-roles/properties/' + thisYear).then(function (response) {
            console.log('getProperties response', response);
            for (var i = 0; i < response.data.length; i++) {
                self.propertyList.list.push(response.data[i].property);
            }
        });
    }

    
    // get users username, active, and role status
    self.getUsers = function () {
        $http({
            method: 'GET',
            url: '/user-roles',
        }).then(function (response) {
            self.users = response.data;
        });
    };


    // authorize or deauthorize a site manager for a property
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
        $http({
            method: 'PUT',
            url: '/user-roles/active',
            data: user
        }).then(function (response) {
            self.getUsers();
        });
    };


    // Send an unit occupied status update to the admin service
    self.updateOccupied = function (property) {
        console.log('updateOccupied service property', property);
        $http({
            method: 'PUT',
            url: '/admin/updateOccupied',
            data: property
        }).then(function (response) {
            self.getAllProperties();
        })
    }


    // Update the user's role PUT request
    self.updateUserRole = function (user) {
        $http({
            method: 'PUT',
            url: '/user-roles/role',
            data: {
                user: user,
                role: user.newRole
            }
        }).then(function (response) {
            self.getUsers();
        });
    };



    //--------------------------------------
    //-------------RUNTIME CODE-------------
    //--------------------------------------

    self.getProperties(); // build propertyList immediately


    
}]);
    