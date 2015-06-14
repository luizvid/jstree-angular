/*!
 jsTree-Angular
 (c) 2015 Luiz Fernando Vid <luizvid@gmail.com>
 License: MIT
 Version 1.1.1
 */
if(angular.isUndefined(jsTreeAngular)) {
    var jsTreeAngular = angular.module('jsTreeAngular',[]);
}
(function(app) {
    app.factory('jsTreeAngular', [
        '$rootScope',
        function($rootScope) {
            'use strict';

            /**
             * dnd`s (drag and drop) plugin function, plugin needed
             * Holds the list of moved arrays
             * @type {Array}
             * @private
             */
            var _moved_nodes = [];

            /**
             * no plugin needed
             * Holds the selected node
             * @type {undefined}
             * @private
             */
            var _selected_node = undefined;

            /**
             * Holds the active plugins
             * @type {undefined}
             * @private
             */
            var _available_plugins = undefined;

            /**
             * Holds the refresh`s tree method
             * @private
             */
            var _cbRefreshTree = function() {};

            /**
             * dnd`s (drag and drop) Plugin function, plugin needed
             * Sets the moved nodes
             * @param node
             */
            this.setMovedNodes = function(node) {
                if (_alreadyMoved(node.node.id, this) !== false) {
                    _updateMove(node);
                } else {
                    _newMove(node);
                }

                $rootScope.$broadcast('jsTreeAngular:moved', _moved_nodes);
            };

            /**
             * dnd`s (drag and drop) Plugin function, plugin needed
             *
             * @returns {Array}
             */
            this.getMovedNodes = function() {
                if (_checksActivePlugins('dnd', 'getMovedNodes')) return;
                return _moved_nodes;
            };

            /**
             * Clears the moved nodes holder.
             */
            this.cleanMovedNodes = function() {
                if (_checksActivePlugins('dnd', 'cleanMovedNodes')) return;
                _moved_nodes = [];
            };

            this.undoLastMove = function() {
                if (_checksActivePlugins('dnd', 'undoLastMove')) return;
                _moved_nodes.unshift();
            };

            this.setSelectedNode = function(node) {
                _selected_node = node;
                $rootScope.$broadcast('jsTreeAngular:selected', _selected_node);
            };

            /**
             * Returns the selected node value.
             * @param node
             * @returns {*}
             */
            this.getSelectedNode = function(node) {
                return _selected_node = node;
            };

            /**
             * Clears the selected node holder.
             */
            this.clearSelectedNode = function() {
                _selected_node = undefined;
            };

            /**
             * Sets the active plugins.
             * @param plugins
             * @private
             */
            this._setActivePlugins = function(plugins) {
                _available_plugins = plugins;
            };

            /**
             * Triggers the refresh`s tree method and clean all variables.
             */
            this.refreshTree = function() {
                this.clearSelectedNode();
                this.cleanMovedNodes();
                _cbRefreshTree();
            };

            /**
             * Attach refresh`s tree method
             * @param cb
             * @private
             */
            this._refreshTree = function(cb) {
                _cbRefreshTree = cb;
            };

            /**
             * Private function _updateMove
             * @param node
             * @param _this
             * @private
             */
            var _updateMove = function(node) {
                var index = _alreadyMoved(node.node.id);

                if (node.parent == _moved_nodes[index].old_parent) {
                    _moved_nodes.splice(index, 1);
                    return;
                }

                var data = {
                    'id': node.node.id,
                    'parent': node.parent,
                    'old_parent': _moved_nodes[index].old_parent,
                    'position': node.position
                };

                _moved_nodes[index] = data;
            };

            /**
             * Checks if the plugin is active.
             * @param fnCalled
             * @private
             */
            var _checksActivePlugins = function(fnPlugin, fnCalled) {
                if (_available_plugins.indexOf(fnPlugin) === -1) {
                    console.error(fnPlugin + ' plugin is needed for ' + fnCalled + ' to work. Add \'' + fnPlugin + '\' with tree-plugins.');
                    return false;
                }
            };

            /**
             * Private function _newMove
             * @param node
             * @param _this
             * @private
             */
            var _newMove = function(node) {
                var data = {
                    'id': node.node.id,
                    'parent': node.parent,
                    'old_parent': node.old_parent,
                    'position': node.position
                };

                _moved_nodes.push(data);
            };

            /**
             * Private function _alreadyMoved
             * @param needle
             * @param _this
             * @private
             */
            var _alreadyMoved = function(needle) {
                var length = _moved_nodes.length;
                for(var i = 0; i < length; i++) {
                    if(_moved_nodes[i].id == needle) return i;
                }
                return false;
            };

            /**
             * Returns an instance of this factory
             */
            return this;
        }
    ]);
})(jsTreeAngular);