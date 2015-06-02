var app = angular.module('jsTreeAngularDemo', [ 'jsTreeAngular' ]);


app.controller('MainController', ['$scope', function($scope) {
    'use strict';

    var init = function() {
        $scope.search = [
            {data: '123'}
        ];
    };


    init();


}]);