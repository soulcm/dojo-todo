define([
	'dojo/_base/declare',
	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	'dijit/_WidgetsInTemplateMixin',
	'dojo/text!./templates/TodoApp.html',
	'dojo/on',
	'dojo/dom-style',
	'dojo/_base/lang'
], function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, on, domStyle, lang) {
	return declare('todo/TodoCom', [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {

	});
});
