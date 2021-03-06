'use strict';

angular
  .module('inspinia')
  // Directive for selecting Employees based on crmUserSelect
  .directive('crmEmployeeSelect', function(employeesAPI) {
    return {
      restrict: 'A',
      require: '^crmUserSelect',
      link: function(scope, elem, atts, userSelectCtrl) {
        // Get employees
        userSelectCtrl.getUsers = function getUsers(search) {
          employeesAPI.all({searchTerm: search}).then(function(res) {
            // TODO: Get rid of map. Server need to return User model.
            userSelectCtrl.users = res.data.map(function(emp) { return emp.user; });
          });
        };
      }
    };
  });
