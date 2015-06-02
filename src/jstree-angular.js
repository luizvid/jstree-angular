/*
 jsTree-Angular
 (c) 2015 Luiz Fernando Vid <luizvid@gmail.com>
 License: MIT
 */
var jsTree = angular.module('jsTreeAngular',[]);

jsTree.factory('jsTreeService', [
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

jsTree.directive('jsTree', [
    '$log', '$timeout', 'jsTreeService',
    function ($log, $timeout, jsTreeService) {
        'use strict';

        return {
            restrict: 'EA',
            scope: {
                treeModel: '=',
                treeSearch: '=',
                treePlugins: '=',
                treeOptions: '='
            },
            link: function (scope, element, attrs) {

                var plugins = ["dnd", "massload", "search", "sort", "types", "state", "wholerow"];

                element.jstree({
                    'plugins' : plugins,

                    'dnd': {
                        copy: false,
                        is_draggable: _isDraggable
                    },

                    'search': {
                        'show_only_matches': true,
                        'show_only_matches_children': true
                    },

                    "types" : {
                        "#" : {
                            "valid_children" : ["parent", "recursive"]
                        },  // no draggable
                        'default' : {
                            "valid_children" : []
                        }, // no draggable
                        'root' : {
                            'valid_children' : ["children"]
                        }, // no draggable
                        'parent' : {
                            'valid_children' : ["children"]
                        }, // draggable to '#'
                        'children' : {
                            'valid_children' : []
                        }, // draggable to 'parent'
                        'recursive' : {
                            'valid_children' : ["recursive"]
                        }, // draggable to '#' and self
                        'disabled': {
                            'select_node': false,
                            'open_node': false,
                            'close_node': false,
                            'create_node': false,
                            'delete_node': false,
                            'valid_children' : []
                        } // no draggable
                    },

                    'core': {
                        'strings' : {
                            'Loading ...' : 'Carregando ...'
                        },
                        'themes' : {
                            'striped' : true,
                            'responsive' : true
                        },
                        "check_callback" : true,
                        'animation' : 0
                    }
                });

                scope.$watch('treeModel', function (treeData) {
                    if(treeData == null) return;

                    element.jstree(true).settings.core.data = treeData;
                    jsTreeService.refreshTree();

                }, true);

                element.on('move_node.jstree', function (e, data) {
                    if (data.parent != data.old_parent) {
                        jsTreeService.setMovedNodes(data);
                    }
                });

                element.on('dblclick.jstree', function (e) {
                    if (e.target.parentNode.id) {
                        var data = {
                            'id' : e.target.parentNode.id,
                            'parent': e.target.parentNode.parentNode.parentNode.id
                        };
                        jsTreeService.setSelectedNode(data);
                    }
                });

                var to = false;
                scope.$watch('treeSearch', function(value) {
                    if (angular.isUndefined(value)) return;

                    if(to) { $timeout.cancel(to); }
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

                jsTreeService._refreshTree( function() {
                    element.jstree(true).refresh(false, true);
                });

                jsTreeService._undoMove( function() {
                    //element.jstree(true).undo();
                });
            }
        };
    }
]);