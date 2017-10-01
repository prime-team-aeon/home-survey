myApp.service('UserRolesService', ['$http', function ($http) {
    console.log('UserRoleService loaded');

    var self = this;

    self.users = {}

    // get users username, active, and role status
    self.getUsers = function () {
        $http({
            method: 'GET',
            url: '/user-roles',
        }).then(function (response) {
            console.log('user roles', response.data);
            self.users = response.data;
        });
    };

    // Update the users active status PUT request
    self.toggleActive = function(user) {        
        $http({
            method: 'PUT',
            url: '/user-roles/active',
            data: user
        }).then(function(response){
            console.log('toggleActive PUT response');
            self.getUsers();
        })
    };

    // Update the users role PUT request
    self.updateUserRole = function(user) {
        
        $http({
            method: 'PUT',
            url: '/user-roles/role',
            data: {
                user: user,
                role: user.newRole
            }
        }).then(function(response){
            console.log('updateUserRole PUT response');
            self.getUsers();
        })
    };

}]);