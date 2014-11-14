'use strict';
var angular = require('angular');
var app = angular.module('myApp', []);
app.controller('WelcomeCtrl', function($scope) {
    $scope.testVar = 'We are up and running from a required module!';
}).controller("ContactCtrl", ['$scope', '$location', '$anchorScroll', function($scope, $location, $anchorScroll) {
    $scope.gotoBottom = function() {
        // set the location.hash to the id of
        // the element you wish to scroll to.
        $location.hash('contact');

        // call $anchorScroll()
        $anchorScroll();
    };

}]).directive('bounceDirective', function() {
    return {
        restrict: 'EAC', //E = element, A = attribute, C = class, M = comment
        replace: false,
        template: '<h1>Joseph Ortiz</h1>',
        link: function(scope, element) {
                element.addClass('animated bounceInDown');
                //element.removeClass('animated bounceInDown');
            } //DOM manipulation
    };
});
