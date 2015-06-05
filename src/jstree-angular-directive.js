/*
 jsTree-Angular
 (c) 2015 Luiz Fernando Vid <luizvid@gmail.com>
 License: MIT
 Version 1.1
 */
(function(app) {
    app.directive('jsTree', [
        '$timeout', 'jsTreeFactory',
        function ($timeout, jsTreeFactory) {
            'use strict';

            var key, plugins = [], options = [], properties = {};

            function link(scope, element) {
                plugins = scope.plugins ? _mapTrim(scope.plugins.split(',')) : [];
                options = scope.options ? scope.options : [];

                properties = {'plugins': plugins};

                if (scope.options !== undefined) {
                    for (key in options) {
                        if ('core' === key || plugins.indexOf(key))
                            if (options.hasOwnProperty(key))
                                properties[key] = options[key];
                    }
                }

                element.jstree(properties);

                scope.$watch('model', function (treeData) {
                    if (treeData == null) return;

                    element.jstree(true).settings.core.data = treeData;
                    jsTreeFactory.refreshTree();

                }, true);

                element.on('move_node.jstree', function (e, data) {
                    if (data.parent != data.old_parent) {
                        jsTreeFactory.setMovedNodes(data);
                    }
                });

                element.on('dblclick.jstree', function (e) {
                    if (e.target.parentNode.id) {
                        var data = {
                            'id': e.target.parentNode.id,
                            'parent': e.target.parentNode.parentNode.parentNode.id
                        };
                        jsTreeFactory.setSelectedNode(data);
                    }
                });

                var to = false;
                scope.$watch('search', function (value) {
                    if (angular.isUndefined(value) || plugins.indexOf('search') == -1) return;

                    if (to) {
                        $timeout.cancel(to);
                    }
                    to = $timeout(function () {
                        element.jstree(true).search(value);
                    }, 250);
                });

                function _isDraggable(node) {
                    return (!(
                    node[0].type == 'disabled' ||
                    node[0].type == 'root'
                    ));
                }

                jsTreeFactory._refreshTree(function () {
                    element.jstree(true).refresh(false, true);
                });

            }

            var _mapTrim = function(arr) {
                for (key in arr) {
                    arr[key] = $.trim(arr[key]);
                }
                return arr;
            };

            return {
                restrict: 'EA',
                scope: {
                    model: '=treeModel',
                    search: '=treeSearch',
                    plugins: '@treePlugins',
                    options: '=treeOptions'
                },
                link: link
            };
        }
    ]);
})(jsTree);