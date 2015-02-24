define([
	'dojo/_base/declare',
	'dojo/text!./templates/TodoList.html',
	'todo/TodoCom',
	'dojo/on',
	'dojo/query',
	'dojo/dom',
	'dojo/dom-construct',
	'dojo/dom-class',
	'dojo/_base/lang',
	'dojo/_base/array',
	'dojo/dom-style',
	'dojo/NodeList-traverse'
], function(declare, template, TodoCom, on, query, dom, domConstruct, domClass, lang, array, domStyle) {
	return declare('todo/TodoList', [TodoCom], {
		templateString: template,

		postCreate: function() {
			this.addEvents();
		},

		startup: function() {
			this.countItems();
		},

		addEvents: function() {
			on(this.toggleList, 'click', lang.hitch(this, this.toogleCheck));
		},

		toogleCheck: function(event) {
			var e = event || window.event;
			if (e.target.nodeName.toUpperCase() == 'INPUT') {
				if (e.target.id === 'toggle-all') {
					var checked = e.target.checked;
					query('.toggle').forEach(function(item) {
						(item.checked = checked) ? domClass.add(query(item).closest('li')[0], 'done'): domClass.remove(query(item).closest('li')[0], 'done');
					});
					this.countItems();
				} else {
					var checked = e.target.checked;
					domClass.toggle(query(e.target).closest('li')[0], 'done');
					this.countItems(checked);
				}
			}else if(e.target.nodeName == 'A'){
				domConstruct.destroy(query(e.target).closest('li')[0]);
				this.countItems();
			}
		},

		checkAll: function(){
			if(arguments.length && !arguments[0]){
				dom.byId('toggle-all').checked = arguments[0];
				return;
			}
			array.every(query('.toggle'), function(item) {
				return item.checked;
			}) ? dom.byId('toggle-all').checked = true : dom.byId('toggle-all').checked = false;
		},

		clearCompleted: function() {
			query('#todo-list li.done').forEach(function(item) {
				on.emit(query('a.destroy',item)[0],'click',{
					bubbles: true,
					cancelable: true
				});
			});
		},

		rendList: function(item) {
			var liHtml = '<li>' +
					'<div class="view">' +
						'<input class="toggle" type="checkbox">' +
						'<label>' + item + '</label>' +
						'<a class="destroy"></a>' +
					'</div>' +
					'<input class="edit" type="text" value="' + item + '">' +
				'</li>';

			domConstruct.place(liHtml, 'todo-list', 'last');
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
			query('.todo-count').children('b')[0].innerHTML = total - totalDone;
			if (totalDone) {
				var completeHtml = '<a id="clear-completed">Clear ' + totalDone + ' completed item</a>';
				domConstruct.place(completeHtml, this.footer, 'first');
				on(dom.byId('clear-completed'),'click',lang.hitch(this,this.clearCompleted));
			}
		}
	});
});
