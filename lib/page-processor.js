var _ = require('underscore');
var Handlebars = require('handlebars');

function PageProcessor(handlebars) {
	this.sourceMap = {};
	this.registrations = [];
	this.handlebars = handlebars || Handlebars;
}

PageProcessor.prototype = {
	registerSourceMap: registerSourceMap,
	registerPage: registerPage,
	generatePageMap: generatePageMap
};

function registerSourceMap(sourceMap) {
	_.each(sourceMap, function (template, path) {
		this.sourceMap[path] = template;
		this.handlebars.registerPartial(path, template);
	}.bind(this));
}

function registerPage(pagePath, sourcePath, data) {
	this.registrations.push({
		pagePath: pagePath,
		sourcePath: sourcePath,
		data: data
	});
}

function generatePageMap() {
	var pageMap = {};
	_.each(this.registrations, function (registration) {

		var adjustment = _adjustment(registration.pagePath);
		this.handlebars.registerHelper('asset', function (url) {
			return adjustment + url;
		});

		var source = this.sourceMap[registration.sourcePath];
		var render = this.handlebars.compile(source);
		var content = render(registration.data);
		pageMap[registration.pagePath] = content;

		this.handlebars.unregisterHelper('asset');

	}.bind(this));
	return pageMap;
}

function _level(path) {
	var parts = path.split('/');
	return parts.length - 1;
}

function _adjustment(path) {
	var level = _level(path);
	return '../'.repeat(level);
}

module.exports = PageProcessor;