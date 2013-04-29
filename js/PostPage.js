var global = global ? global : {};

global.testing = (/\/tests\//g).test(window.location.href);

global.templates = global.templates ? global.templates : {};

global.templates.PostTemplate = Backbone.Model.extend({
		/**
		 * constructor
		 */
		initialize: function(options) {
			var self = this;

			if (options.start) {
				this.getPostNameByUrl();
				this.getConfig();
				this.setView();
			}
		},

		/**
		 * setView
		 */
		setView: function () {
			this.view = new global.templates.PostTemplate.View({el: $("#wrapper")});
		},

		/**
	 	* getPostNameByUrl
	 	*/
		getPostNameByUrl: function () {
			var urlSplitted = window.location.pathname.split('/')
			this.postName = urlSplitted[urlSplitted.length - 1].replace(/\.html/g, '');
		},

		/**
	 	* getConfig
	 	*/
		getConfig: function (url) {
			var self = this,
				url = url ? url : '../../../config/main-config.json';

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
				this.getStyle('../../../' + data.template.assets.styles[i]);
			}

			if (data.title) {
				$('title').text(data.title);
			}

			if (data.posts) {
				for (var i in data.posts) {
					this.get({
						url: 'posts.json',
						callback: function (data) {
							for (var post in data.posts) {
								self.parsePosts(data.posts[post])
							}
						}
					});
				}
			}
		},

		/**
	 	* parsePost
	 	*/
		parsePosts: function (posts) {
			var postData = {};
			for (var post in posts) {
				if (post === 'post' && posts[post].url === this.postName) {
					postData = posts[post];
					
					this.view.renderTemplate(postData)
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

global.templates.PostTemplate.View = Backbone.View.extend({
	initialize: function () {
		this.postTemplate = _.template($('#postTemplate').text());
	},

	renderTemplate: function (postData) {
		var html = this.postTemplate({'postData' : postData});
		console.log('render template')
		this.$el.html(html);
	},

	render: function(){
        
    }
});

$(document).ready(function () {
	if ( !global.testing ) {
		global.templates.postTemplate = new global.templates.PostTemplate({start: true});
	}
});