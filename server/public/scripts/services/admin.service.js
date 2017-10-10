myApp.service('AdminService', ['$http', '$mdToast', '$location', function ($http, $mdToast, $location) {

    //--------------------------------------
    //-------------VARIABLES----------------
    //--------------------------------------

    var self = this;

    self.allProperties = {}; // holds all unit/property combos    
    self.newProperty = {}; // data bound to the property and input fields in the Add New Property section
    self.users = {
        list: []
    }; // stores all administrators, site manager


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
                self.getAllProperties(); // reload all properties to include the new property and unit
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
            self.getSelectedEditProperty(self.selectedEditProperty.list[0].property);
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


    // GET request for all occupancy information from the occupancy table
    self.getAllProperties = function () {
        $http.get('/user-roles/allProperties/').then(function (response) {            

            // stores all occupancy information from the occupancy table via the GET property request
            self.allProperties = response.data;

        });
    }

    // get the selected property on the admin properties edit page
    self.getSelectedEditProperty = function(selectedProperty) { 
        $http({
            method: 'GET',
            url: 'admin/selectedProperty',
            params: {
                selectedProperty: selectedProperty
            }
        }).then(function(response){
            self.selectedEditProperty.list = response.data;
        });
        
    }

    // get the selected property on the admin site manager properties edit page
    self.getSelectedSiteProperty = function(selectedProperty) { 
        $http({
            method: 'GET',
            url: 'admin/selectedProperty',
            params: {
                selectedProperty: selectedProperty
            }
        }).then(function(response){
            self.selectedSiteManagerProperty.list = response.data;
        });
        
    }

    // GET request for properties from the db
    self.getProperties = function () {

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
            self.getSelectedEditProperty(self.selectedEditProperty.list[0].property);
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
