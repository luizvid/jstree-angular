/*!
 jsTree-Angular
 (c) 2015 Luiz Fernando Vid <luizvid@gmail.com>
 License: MIT
 Version 1.1
 */
var jsTree = angular.module('jsTreeAngular',[]);

(function(app) {
    app.factory('jsTreeFactory', [
        '$rootScope',
        function($rootScope) {
            'use strict';

            this.moved_nodes = [];
            this.selected_node = undefined;
            var _cbRefreshTree = function() {};

            this.setMovedNodes = function(node) {
                if (_alreadyMoved(node.node.id, this) !== false) {
                    _updateMove(node, this);
                } else {
                    _newMove(node, this);
                }

                $rootScope.$broadcast('jsTreeAngular:moved', this.moved_nodes);
            };

            this.getMovedNodes = function() {
                return this.moved_nodes;
            };

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

            this.getSelectedNode = function(node) {
                return this.selected_node = node;
            };

            this.clearSelectedNode = function() {
                this.selected_node = undefined;
            };

            this.refreshTree = function() {
                this.clearSelectedNode();
                this.cleanMovedNodes();
                _cbRefreshTree();
            };

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

            return this;
        }
    ]);
})(jsTree);