Proyect.ROUTER = Backbone.Router.extend({
	
	initialize: function() {
		App.loadModule(Proyect.CONFIG.app.startModule);	
	},

	routes: {
		"menu": "menu"
	},

	menu: function() {
		App.loadModule("menu");
	},

	notfound: function() {
		App.loadModule(Proyect.CONFIG.app.startModule);	
	}

});
var backboneRouter = new Proyect.ROUTER;
if (!Backbone.history.start()) backboneRouter.trigger('notfound');