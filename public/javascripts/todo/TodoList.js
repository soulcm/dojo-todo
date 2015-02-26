define([
	'dojo/_base/declare',
	'dojo/text!./templates/TodoList.html',
	'todo/TodoCom',
	'dojo/on',
	'dojo/query',
	'dojo/dom',
	'dojo/dom-construct',
	'dojo/dom-class',
	'dojo/dom-attr',
	'dojo/_base/lang',
	'dojo/_base/array',
	'dojo/dom-style',
	'dojo/NodeList-traverse'
], function(declare, template, TodoCom, on, query, dom, domConstruct, domClass, domAttr, lang, array, domStyle) {
	return declare('todo/TodoList', [TodoCom], {
		templateString: template,

		startup: function() {
			this.addEvents();
			this.countItems();
		},

		addEvents: function() {
			on(this.toggleList, 'click', lang.hitch(this, this.toogleCheck));
			on(this.toggleList, 'dblclick', lang.hitch(this, this.editTodoList));
			on(this.toggleList, 'keyup', lang.hitch(this, this.updateByEnter));
			this.toggleList.addEventListener('blur',lang.hitch(this, this.updateTodoList),true); //capture model
		},

		toogleCheck: function(event) {
			var e = event || window.event,
				todoId, checked, obj = {};
			if (e.target.type === 'checkbox') {
				if (e.target.id === 'toggle-all') {
					checked = e.target.checked;
					query('.toggle').forEach(lang.hitch(this, function(item) {
						(item.checked = checked) ? domClass.add(query(item).closest('li')[0], 'done'): domClass.remove(query(item).closest('li')[0], 'done');
						todoId = domAttr.get(query(item).closest('li')[0], 'data-todoid');
						obj.done = checked;
						this.editStorage(todoId, obj);
					}));
					this.countItems();
				} else {
					checked = e.target.checked;
					domClass.toggle(query(e.target).closest('li')[0], 'done');
					todoId = domAttr.get(query(e.target).closest('li')[0], 'data-todoid');
					obj.done = checked;
					this.editStorage(todoId, obj);
					this.countItems(checked);
				}
			} else if (e.target.nodeName == 'A') {
				todoId = domAttr.get(query(e.target).closest('li')[0], 'data-todoid');
				this.removeStorage(todoId);
				domConstruct.destroy(query(e.target).closest('li')[0]);
				this.countItems();
			}
		},

		checkAll: function() {
			if (arguments.length && !arguments[0]) {
				dom.byId('toggle-all').checked = arguments[0];
				return;
			}
			array.every(query('.toggle'), function(item) {
				return item.checked;
			}) ? dom.byId('toggle-all').checked = true : dom.byId('toggle-all').checked = false;
		},

		clearCompleted: function() {
			query('#todo-list li.done').forEach(function(item) {
				on.emit(query('a.destroy', item)[0], 'click', {
					bubbles: true,
					cancelable: true
				});
			});
		},

		editTodoList: function(event) {
			var e = event || window.event,
				target = e.target;
			if (target.type !== 'checkbox') {
				domClass.add(query(target).closest('li')[0], 'editing');
				query(target).closest('li').children('.edit')[0].focus();
			}
		},

		updateTodoList: function(event) {
			var e = event || window.event,
				target = e.target,
				li = query(target).closest('li')[0],
				obj = {};
			domClass.remove(li, 'editing');
			var todoId = domAttr.get(li, 'data-todoid');
			query('label', li)[0].innerHTML = target.value;
			obj.title = target.value;
			this.editStorage(todoId, obj);
		},

		updateByEnter: function(event) {
			var e = event || window.event,
				target = e.target;
			if (target.type === 'text' && e.keyCode === 13) {
				this.updateTodoList();
			}
		},

		rendList: function(storeList) {
			if (typeof storeList !== 'object') {
				throw new Error('storeList should be an object');
			}
			var doneClass = storeList.done ? 'done' : '';
			var checkedHtml = storeList.done ? '<input class="toggle" type="checkbox" checked>' : '<input class="toggle" type="checkbox">';
			var liHtml = '<li data-todoid="'+storeList.id+'" class="'+doneClass+'">' +
					'<div class="view">' +
						checkedHtml +
						'<label>' + storeList.title + '</label>' +
						'<a class="destroy"></a>' +
					'</div>' +
					'<input class="edit" type="text" value="' + storeList.title + '">' +
				'</li>';

			domConstruct.place(liHtml, 'todo-list', 'last');
			var li = query('[data-todoid=' + storeList.id + ']');
			// on(li.children('.edit')[0], 'blur', lang.hitch(this, this.updateTodoList));
		},

		countItems: function() {
			domConstruct.destroy('clear-completed');
			var total = query('#todo-list li').length;
			if (!total) {
				domStyle.set(this.domNode, 'display', 'none');
				return;
			}
			arguments.length ? this.checkAll(arguments[0]) : this.checkAll();
			var totalDone = query('#todo-list li.done').length;
			query('.todo-count b')[0].innerHTML = total - totalDone;
			if (totalDone) {
				var completeHtml = '<a id="clear-completed">Clear ' + totalDone + ' completed item</a>';
				domConstruct.place(completeHtml, this.footer, 'first');
				on(dom.byId('clear-completed'), 'click', lang.hitch(this, this.clearCompleted));
			}
		}
	});
});
