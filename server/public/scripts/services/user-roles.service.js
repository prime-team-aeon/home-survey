myApp.service('UserRolesService', ['$http', function ($http) {
    console.log('UserRoleService loaded');

    var self = this;

    self.users = {}

    self.getUsersStatus = function () {
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
            self.getUsersStatus();
        })
    };

    // Update the users role PUT request
    self.updateUserRole = function(user, newRole) {
        console.log('UserServiceRoles updateUserRole user', user);
        console.log('UserServiceRoles updateUserRole newRole', newRole);
        
        $http({
            method: 'PUT',
            url: '/user-roles/role',
            data: {
                user: user,
                role: newRole
            }
        }).then(function(response){
            console.log('updateUserRole PUT response');
            self.getUsersStatus();
        })
    };

}]);