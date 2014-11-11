'use strict';
var angular = require('angular');
var app = angular.module('myApp', []);
app.controller('WelcomeCtrl', function($scope) {
    $scope.testVar = 'We are up and running from a required module!';
}).directive('bounce', function() {
    return {
        restrict: 'A', //E = element, A = attribute, C = class, M = comment
        replace: false,
        template: '<h1>Joseph Ortiz</h1>',
        link: function(scope, element) {
                element.addClass('animated bounceInDown');
                //element.removeClass('animated bounceInDown');
            } //DOM manipulation
    };
});
