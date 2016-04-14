;(function (application) {
    'use strict';

    application
        .controller('ApplicationController', function($scope, Skills) {
            Skills.getSkills().then(function(response) {
                $scope.skills = response.data;
            });
        });

})(application);
