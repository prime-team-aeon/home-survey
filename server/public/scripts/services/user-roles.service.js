myApp.service('UserRolesService', ['$http', function ($http) {
    console.log('UserRoleService loaded');

    var self = this;

    self.users = {}

    self.getUserRoles = function () {
        $http({
            method: 'GET',
            url: '/user-roles',
        }).then(function (response) {
            console.log('user roles', response.data);
            self.users = response.data;
        });
    };

    self.toggleActiveStatus = function(user) {
        console.log('UserServiceRoles toggleActiveStatus user', user);
        
        $http({
            method: 'PUT',
            url: '/user-roles/active',
            data: user
        }).then(function(response){
            console.log('toggleActiveStatus PUT response');
            self.getUserRoles();
        })
    };

}]);