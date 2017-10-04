myApp.service('UserRolesService', ['$http', '$mdToast', '$location', function ($http, $mdToast, $location) {
    // console.log('UserRoleService loaded');

    var self = this;

    self.users = {}

    // get users username, active, and role status
    self.getUsers = function () {
        $http({
            method: 'GET',
            url: '/user-roles',
        }).then(function (response) {
            self.users = response.data;
        });
    };

    // Update the users active status PUT request
    self.toggleActive = function (user) {
        $http({
            method: 'PUT',
            url: '/user-roles/active',
            data: user
        }).then(function (response) {
            console.log('toggleActive PUT response');
            self.getUsers();
        })
    };

    // Update the users role PUT request
    self.updateUserRole = function (user) {

        $http({
            method: 'PUT',
            url: '/user-roles/role',
            data: {
                user: user,
                role: user.newRole
            }
        }).then(function (response) {
            console.log('updateUserRole PUT response');
            self.getUsers();
        })
    };

    // get list of properties from db
    self.propertyList = {
        list: []
    };

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

    self.getProperties();

    self.manageAuth = function (userId, property, route) {
        var authInfo = {
            id: userId,
            property: property
        }

        $http.put('/user-roles/properties/' + route, authInfo).then(function (response) {
            self.getUsers();
        });
    }

    self.deleteUser = function (username) {
        // console.log('/user-roles/' + username);

        $http.delete('/user-roles/' + username).then(function (response) {
            // console.log('delete response', response);

            if (response.status == 200) {
                console.log('response ok');

                $mdToast.show(
                    $mdToast.simple()
                        .textContent('User deleted.')
                        .hideDelay(2000)
                );
            } else {
                console.log('response bad');
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('Deletion unsuccessful.')
                        .hideDelay(2000)
                );
            }
            self.getUsers();
        });
    }

    // get list of all properties from db
    self.allProperties = {};
    self.allUnits = {};

    self.getAllProperties = function () {
        $http.get('/user-roles/allProperties/').then(function (response) {

            // get the properties
            self.uniqueProperties = [];
            response.data.forEach(function (occupancy) {
                self.allProperties = response.data;

                self.uniqueProperties = response.data.map(function (occupancy) {
                    return occupancy.property
                });

                self.uniqueProperties = self.uniqueProperties.filter(function (property, index) {
                    return self.uniqueProperties.indexOf(property) == index;
                });
                
            });

            self.allProperties = response.data
            $location.path('/admin-properties');
        });
    }
}]);