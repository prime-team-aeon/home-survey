myApp.service('UserRolesService', ['$http', function ($http) {
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

    // get list of properties from db
    self.propertyList = { list: [] };
    
    self.getProperties = function(){
        let thisYear = new Date();
        thisYear = thisYear.getFullYear();
        $http.get('/user-roles/properties/' + thisYear).then(function(response){
            // console.log('getProperties response', response);
            for (var i = 0; i < response.data.length; i++) {
                self.propertyList.list.push(response.data[i].property);
            }
        });
    }

    self.getProperties();

    self.deauthorizeProperty = function(userId, property){
        var deauthorizeInfo = {
            id: userId,
            property: property
        }
        console.log('deauthorizeInfo', deauthorizeInfo);
        
        $http.put('/user-roles/properties/deauth', deauthorizeInfo).then(function(response){
            console.log('deauth response', response);
            self.getUsers();
        });
    }
}]);