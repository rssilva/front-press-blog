var global = global ? global : {};

global.testing = (/\/tests\//g).test(window.location.href);

global.templates = global.templates ? global.templates : {};

global.templates.MainTemplate = Backbone.Model.extend({
    /**
	 * constructor
	 */
  	initialize: function(options) {
    	var self = this;

    	if (options.start) {
    		this.getConfig();
    	}
  	},

  	/**
	 * getConfig
	 */
  	getConfig: function (url) {
  		var self = this,
  			url = url ? url : 'config/main-config.json';

  		this.get({
    		url: url,
    		callback: function (data) {
    			self.parseConfig(data);
    		}
    	});
  	},

  	/**
	 * parseConfig
	 */
  	parseConfig: function (data) {
  		var self = this;
  		
  		for (var i in data.template.assets.styles) {
  			this.getStyle(data.template.assets.styles[i]);
  		}

  		if (data.title) {
  			$('title').text(data.title);
  		}

  		if (data.posts) {
  			for (var i in data.posts) {
  				this.get({
	  				url: 'posts/' + data.posts[i] + '/posts.json',
	  				callback: function (data) {
	  					for (var post in data.posts) {
	  						for (var j in data.posts[post])
	  						console.log(data.posts[post][j])
	  					}
	  				}
  				});
  			}
  		}
  	},

  	/**
	 * get
	 */
  	get: function (options) {
  		
  		$.ajax({
	        type: 'GET',
	        url: options.url,
	        dataType: 'json',   
	        success: function (data) {
	        	options.callback(data);
		    },
		    error: function (data) {
		    	console.log('error', data.responseText);
		    }
  		});
  	},

  	/**
	 * getStyle
	 */
  	getStyle: function (url) {
  		var styleTag = document.createElement('link')

		styleTag.rel= "stylesheet";
		styleTag.type= "text/css";
  		styleTag.href = url;

  		$('head').append(styleTag);
  	}
});

$(document).ready(function () {
	if ( !global.testing ) {
		global.templates.mainTemplate = new global.templates.MainTemplate({start: true});
	}
});