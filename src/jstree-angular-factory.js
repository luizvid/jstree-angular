/*!
 jsTree-Angular
 (c) 2015 Luiz Fernando Vid <luizvid@gmail.com>
 License: MIT
 Version 1.2
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
             */
            this.moved_nodes = [];

            /**
             * no plugin needed
             * Holds the selected node
             * @type {undefined}
             */
            this.selected_node = undefined;

            /**
             * Holds the active plugins
             * @type {undefined}
             */
            this.available_plugins = undefined;

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
                _checksActivePlugins('setMovedNodes', 'dnd');
                if (_alreadyMoved(node.node.id, this) !== false) {
                    _updateMove(node, this);
                } else {
                    _newMove(node, this);
                }

                $rootScope.$broadcast('jsTreeAngular:moved', this.moved_nodes);
            };

            /**
             * dnd`s (drag and drop) Plugin function, plugin needed
             *
             * @returns {Array}
             */
            this.getMovedNodes = function() {
                return this.moved_nodes;
            };

            /**
             * Clears the moved nodes holder.
             */
            this.cleanMovedNodes = function() {
                this.moved_nodes = [];
            };

            this.undoLastMove = function() {
                this.moved_nodes.unshift();
            };

            this.setSelectedNode = function(node) {
                this.selected_node = node;
                $rootScope.$broadcast('jsTreeAngular:selected', this.selected_node);
            };

            /**
             * Returns the selected node value.
             * @param node
             * @returns {*}
             */
            this.getSelectedNode = function(node) {
                return this.selected_node = node;
            };

            /**
             * Clears the selected node holder.
             */
            this.clearSelectedNode = function() {
                this.selected_node = undefined;
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
            var _updateMove = function(node, _this) {
                var index = _alreadyMoved(node.node.id, _this);

                if (node.parent == _this.moved_nodes[index].old_parent) {
                    _this.moved_nodes.splice(index, 1);
                    return;
                }

                var data = {
                    'id': node.node.id,
                    'parent': node.parent,
                    'old_parent': _this.moved_nodes[index].old_parent,
                    'position': node.position
                };

                _this.moved_nodes[index] = data;
            };

            /**
             * Checks if the plugin is active.
             * @param fnCalled
             * @private
             */
            var _checksActivePlugins = function(fnCalled, fnPlugin) {
                if (false) {
                    console.error('The method ' + fnCalled + ' is not set because the ' + fnPlugin + '`s plugin is not active.');
                    return false;
                }
            };

            /**
             * Private function _newMove
             * @param node
             * @param _this
             * @private
             */
            var _newMove = function(node, _this) {
                var data = {
                    'id': node.node.id,
                    'parent': node.parent,
                    'old_parent': node.old_parent,
                    'position': node.position
                };

                _this.moved_nodes.push(data);
            };

            /**
             * Private function _alreadyMoved
             * @param needle
             * @param _this
             * @private
             */
            var _alreadyMoved = function(needle, _this) {
                var length = _this.moved_nodes.length;
                for(var i = 0; i < length; i++) {
                    if(_this.moved_nodes[i].id == needle) return i;
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