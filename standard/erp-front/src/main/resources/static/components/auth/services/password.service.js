'use strict';

angular.module('app')
    .factory('Password', ['$resource', function ($resource) {
        return $resource('api/account/change_password', {}, {});
    }]);

angular.module('app')
    .factory('PasswordResetInit', ['$resource', function ($resource) {
        return $resource('api/account/reset_password/init', {}, {})
    }]);

angular.module('app')
    .factory('PasswordResetFinish', ['$resource', function ($resource) {
        return $resource('api/account/reset_password/finish', {}, {})
    }]);
