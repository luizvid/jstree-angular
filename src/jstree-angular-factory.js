/*!
 jsTree-Angular
 (c) 2015 Luiz Fernando Vid <luizvid@gmail.com>
 License: MIT
 Version 1.1
 */
var jsTree = angular.module('jsTreeAngular',[]);

(function(app) {
    app.factory('jsTreeService', [
            '$log', '$rootScope',
            function($log, $rootScope) {
                'use strict';

                this.moved_nodes = [];
                this.selected_node = undefined;
                this.cbRefreshTree = function() {};
                this.cbUndoMove = function() {};

                this.setMovedNodes = function(node) {
                    if (this._alreadyMoved(node.node.id) !== false) {
                        this._updateMove(node);
                    } else {
                        this._newMove(node);
                    }

                    $rootScope.$broadcast('jsTreeService:moved', this.moved_nodes);
                };

                this._updateMove = function(node) {
                    var index = this._alreadyMoved(node.node.id);

                    if (node.parent == this.moved_nodes[index].old_parent) {
                        this.moved_nodes.splice(index, 1);
                        return;
                    }

                    var data = {
                        'id': node.node.id,
                        'parent': node.parent,
                        'old_parent': this.moved_nodes[index].old_parent,
                        'position': node.position
                    };

                    this.moved_nodes[index] = data;
                };

                this._newMove = function(node) {
                    var data = {
                        'id': node.node.id,
                        'parent': node.parent,
                        'old_parent': node.old_parent,
                        'position': node.position
                    };

                    this.moved_nodes.push(data);
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
                    $rootScope.$broadcast('jsTreeService:selected', this.selected_node);
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
                    this.cbRefreshTree();
                };

                this._refreshTree = function(cb) {
                    this.cbRefreshTree = cb;
                };

                this.undoMove = function() {
                    this.undoLastMove();
                    this.cbUndoMove();
                };

                this._undoMove = function(cb) {
                    this.cbUndoMove = cb;
                };

                this._alreadyMoved = function(needle) {
                    var length = this.moved_nodes.length;
                    for(var i = 0; i < length; i++) {
                        if(this.moved_nodes[i].id == needle) return i;
                    }
                    return false;
                };

                return this;
            }
    ]);
})(jsTree);