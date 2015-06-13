/*
 jsTree-Angular
 (c) 2015 Luiz Fernando Vid <luizvid@gmail.com>
 License: MIT
 Version 1.1
 */
if(angular.isUndefined(jsTreeAngular)) {
    var jsTreeAngular = angular.module('jsTreeAngular',[]);
}
(function(app) {
    app.directive('jsTree', [
        '$timeout', 'jsTreeAngular',
        function ($timeout, jsTreeAngular) {
            'use strict';

            /**
             * Initializes properties.
             * @type {Array}
             * @private
             */
            var _plugins = [], _options = [], _properties = {};

            function link(scope, element) {
                /**
                 * Sets plugin list from scope`s tree-plugin.
                 * @type {*}
                 * @private
                 */
                _plugins = scope.plugins ? _mapTrim(scope.plugins.split(',')) : [];
                /**
                 * Sets option list from scope`s tree-options.
                 * @private
                 */
                _options = scope.options ? scope.options : [];
                /**
                 * Sets properties
                 * @type {{plugins: Array}}
                 * @private
                 */
                _properties = {'plugins': _plugins};

                /**
                 * Set pair for plugins and options and validate them.
                 */
                if (scope.options !== undefined) {
                    for (var key in _options) {
                        if ('core' === key || _plugins.indexOf(key))
                            if (_options.hasOwnProperty(key))
                                _properties[key] = _options[key];
                    }
                }

                element.jstree(_properties);

                /**
                 * Watch for scope`s tree-model callback.
                 */
                scope.$watch('model', function (treeData) {
                    if (treeData == null) return;

                    element.jstree(true).settings.core.data = treeData;

                    jsTreeAngular.refreshTree();
                }, true);


                /**
                 * Watch for tree-search scope`s callback.
                 * @type {boolean}
                 */
                var to = false;
                scope.$watch('search', function (value) {
                    _checksActivePlugins('search');
                    if (angular.isUndefined(value) || plugins.indexOf('search') == -1) return;

                    if (to) {
                        $timeout.cancel(to);
                    }
                    to = $timeout(function () {
                        element.jstree(true).search(value);
                    }, 250);
                });

                /**
                 * Sets jsTreeAngular`s moved nodes when tree`s event for move node is triggered.
                 */
                element.on('move_node.jstree', function (e, data) {
                    if (data.parent != data.old_parent) {
                        jsTreeAngular.setMovedNodes(data);
                    }
                });

                /**
                 * Sets jsTreeAngular`s selected node when tree`s event for double click is triggered.
                 */
                element.on('dblclick.jstree', function (event, data) {
                    if (event.target.parentNode.id) {
                        var data = {
                            'id': event.target.parentNode.id,
                            'parent': event.target.parentNode.parentNode.parentNode.id
                        };
                        jsTreeAngular.setSelectedNode(data);
                    }
                });

                /**
                 * Sets the refresh`s tree method to JsTreeAngular`s callback
                 */
                jsTreeAngular._refreshTree(function () {
                    element.jstree(true).refresh(false, true);
                });

                /**
                 * Checks if the plugin is active.
                 * @param fnPlugin
                 * @private
                 */
                var _checksActivePlugins = function(fnPlugin) {
                    if (false) {
                        console.error('The ' + fnPlugin + ' is needed for this functionality.');
                    }
                };
            }

            /**
             * Array`s trim
             * @param arr
             * @returns {*}
             * @private
             */
            var _mapTrim = function(arr) {
                for (var key in arr) {
                    arr[key] = $.trim(arr[key]);
                }
                return arr;
            };

            /**
             * Directive scope`s callback
             */
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
})(jsTreeAngular);