define([
	'dojo/_base/declare',
	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	'dijit/_WidgetsInTemplateMixin',
	'dojo/text!./templates/TodoApp.html',
	'dojo/on',
	'dojo/dom-style',
	'dojo/_base/array',
	'dojo/_base/lang'
], function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, on, domStyle, array, lang) {
	return declare('todo/TodoCom', [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {

		saveStorage: function(todoValue) {
			var todoStoreArr, todoId, todoStroeList = {};
			todoStoreArr = (window.localStorage.getItem('dojo-todo') && window.localStorage.getItem('dojo-todo').split(',')) || [];
			todoId = 'dojo-todo' + new Date().toISOString();
			todoStoreArr.push(todoId);
			window.localStorage.setItem('dojo-todo', todoStoreArr);
			todoStroeList.title = todoValue;
			todoStroeList.done = false;
			todoStroeList.id = todoId;
			window.localStorage.setItem(todoId, JSON.stringify(todoStroeList));
			return todoStroeList;
		},

		editStorage: function(todoId, obj) {
			var todoStoreList = JSON.parse(window.localStorage.getItem(todoId));
			todoStoreList.done = obj.done === undefined ? todoStoreList.done : obj.done;
			todoStoreList.title = obj.title === undefined ? todoStoreList.title : obj.title;
			window.localStorage.setItem(todoId, JSON.stringify(todoStoreList));
		},

		removeStorage: function(todoId) {
			window.localStorage.removeItem(todoId);
			var todoStoreArr = window.localStorage.getItem('dojo-todo').split(',');
			todoStoreArr.splice(array.indexOf(todoStoreArr, todoId), 1);
			window.localStorage.setItem('dojo-todo', todoStoreArr);
		}

	});
});
