// Starts application and calls the jsTreeAngular module
var app = angular.module('ComplexDemo', [ 'jsTreeAngular' ]);

// Sample controller for define data and some configuration
app.controller('MainController', ['$scope', 'jsTreeFactory', function ($scope, jsTreeFactory) {
    'use strict';

    var init = function () {

        // Data passed to directive js-tree
        $scope.jsonData = [
            {"id" : 1, "parent" : "#", "text" : "Node 1"},
            {"id" : 2, "parent" : "#", "text" : "Node 2"},
            {"id" : 3, "parent" : 1, "text" : "Child node 1"},
            {"id" : 4, "parent" : 1, "text" : "Child node 2"},
            {"id" : 5, "parent" : 2, "text" : "Child node 3"},
            {"id" : 6, "parent" : 3, "text" : "Child node 4"}
        ];

        // Shows all moved nodes
        $scope.show_moved = function() {
            $scope.movedNodes = jsTreeFactory.getMovedNodes();
        };

        // Listener to show quantity of moved nodes
        $scope.$on('jsTreeAngular:moved', function(e, data) {
            $scope.$apply(function() {
                $scope.moves = data.length;
            });
        });


        // Refresh tree and clean variables
        $scope.refresh = function() {
            $scope.movedNodes = undefined;
            $scope.moves = undefined;
            jsTreeFactory.refreshTree();
        };

        // Some options to pass too.
        $scope.myOptions = {
            'core': {
                'themes': {
                    'striped': true,
                    'responsive': true
                },
                "check_callback": true,
                'animation': 0
            }
        };

    };

    init();

}]);