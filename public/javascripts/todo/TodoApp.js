define([
	'dojo/_base/declare',
	'dojo/text!./templates/TodoApp.html',
	'todo/TodoCom',
	'dojo/on',
	'dojo/dom-style',
	'dojo/_base/lang'
], function(declare, template, TodoCom, on, domStyle, lang) {
	return declare('todo/TodoApp', [TodoCom], {
		templateString: template,

		startup: function() {
			this.inherited(arguments);
			this.addEvents();
			// this.todoList.startup();
		},

		addEvents: function() {
			on(this.todo, 'keyup', lang.hitch(this, this.handleTodo));
			on(this.todoList.domNode, 'showList', lang.hitch(this, this.showList));
		},

		handleTodo: function(e) {
			var e = e || window.event;
			var keyCode = e.keyCode;
			if (keyCode === 13) { //key: return
				this.addTodoList();
			}
		},

		showList: function() {
			domStyle.set(this.todoList.domNode, 'display', '');
			var listObj = this.todoList;
			listObj.rendList(this.todo.value.trim());
			listObj.countItems();
			this.todo.value = '';
		},

		addTodoList: function() {
			var todoValue = this.todo.value.trim();
			if (todoValue.length) {
				on.emit(this.todoList.domNode,'showList',{});
			}
		}
	});
});
