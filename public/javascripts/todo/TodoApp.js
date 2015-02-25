define([
	'dojo/_base/declare',
	'dojo/text!./templates/TodoApp.html',
	'todo/TodoCom',
	'dojo/on',
	'dojo/_base/array',
	'dojo/dom-style',
	'dojo/_base/lang'
], function(declare, template, TodoCom, on, array, domStyle, lang) {
	return declare('todo/TodoApp', [TodoCom], {
		templateString: template,

		flagInit: true,

		startup: function() {
			this.inherited(arguments);
			this.addEvents();
			this.showList();
		},

		addEvents: function() {
			on(this.todo, 'keyup', lang.hitch(this, this.handleTodo));
		},

		handleTodo: function(e) {
			var e = e || window.event;
			var keyCode = e.keyCode;
			if (keyCode === 13) { //key: return
				this.addTodoList();
			}
		},

		/*
		 * show todo list
		 */
		showList: function(todoStroeList) {
			var todoObj, listObj = this.todoList;
			domStyle.set(listObj.domNode, 'display', '');
			if (this.todo.value.trim() !== '') {
				listObj.rendList(todoStroeList);
			}
			if (this.flagInit) {
				if (todoObj = window.localStorage.getItem('dojo-todo')) {
					array.forEach(todoObj.split(','), function(item) {
						var todoStroeList = JSON.parse(window.localStorage.getItem(item));
						listObj.rendList(todoStroeList);
					});
				}
				this.flagInit = false;
			}

			listObj.countItems();
			this.todo.value = '';
		},

		addTodoList: function() {
			var todoValue = this.todo.value.trim(),
				todoStroeList = {};
			if (todoValue.length) {
				this.showList(this.saveStorage(todoValue));
			}
		}
	});
});
