var app = angular.module('jsTreeAngularDemo', [ 'jsTreeAngular' ]);


app.controller('MainController', ['$scope', function($scope) {
    'use strict';

    var init = function() {
        $scope.jsonData = [
            {"id" : 1, "text" : "Node 1"},
            {"id" : 2, "text" : "Node 2"}
        ]
    };


    init();


}]);