/*
 jsTree-Angular
 (c) 2015 Luiz Fernando Vid <luizvid@gmail.com>
 License: MIT
 Version 1.2
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
            var _plugins = [], _options = [], _properties = {}, _id;

            function link(scope, element) {
                /**
                 * Verifies if jsTree is loaded.
                 */
                if (angular.isUndefined(element.jstree)) {
                    element.append('<p style="color: red; font-size: 12px; background-color: rgba(255, 64, 39, 0.09)">Something went wrong, <strong>jsTree looks like was not loaded. Obtain more information by clicking <a href="//github.com/luizvid/jstree-angular/blob/master/README.md#quick-start" style="color: red; font-decoration: underline;" target="_blank">here</a>.</strong></p>');
                    return;
                }

                _id = scope.id ? _mapTrim(scope.id) : 'default-tree';
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

                /**
                 * Initializes tree with plugins and options.
                 */
                element.jstree(_properties, 'test');

                /**
                 * Verifies if jsTree is updated with version 3.1.0 or later.
                 */
                if (angular.isUndefined(element.jstree(true).settings.massload)) {
                    element.append('<p style="color: red; font-size: 12px; background-color: rgba(255, 64, 39, 0.09)">Something went wrong, <strong>jsTree seems outdated. Update your version to 3.1.0 or later by clicking <a href="//github.com/vakata/jstree/releases" style="color: red; font-decoration: underline;" target="_blank">here</a>.</strong></p>');
                    return;
                }
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
                    console.log(element.jstree(true).settings.plugins);
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
            var _mapTrim = function(value) {
                if (typeof value === 'string') {
                    value = $.trim(value);
                } else {
                    for (var key in value) {
                        value[key] = $.trim(value[key]);
                    }
                }
                return value;
            };

            /**
             * Directive scope`s callback
             */
            return {
                restrict: 'EA',
                scope: {
                    id: '@treeId',
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