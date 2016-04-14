;(function (application) {
    'use strict';

    application.config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'page/skills.html',
                controller: 'ApplicationController'
            })
            .when('/contato', {
                templateUrl: 'page/contact.html',
                controller: 'ContactController'
            })
            .otherwise({
                redirectTo: '/'
            });

            $locationProvider.html5Mode(true);
        }
    );
})(application);
