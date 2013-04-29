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
				this.blogName = 'Just Another Front-Press Blog';
				this.getConfig();
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
						options.sucess(data);
				},
				error: function (data) {
					console.log('error', data.responseText);
				}
			});
		},

		startView: function () {
			this.view = Backbone.View.extend({

			});
		},

		/**
	 	* getConfig
	 	*/
		getConfig: function (url) {
			var self = this,
				url = url ? url : 'config/main-config.json';

			this.get({
				url: url,
				sucess: function (data) {
					self.parseConfig(data);
				}
			});
		},

		/**
	 	* parseConfig
	 	*/
		parseConfig: function (configData) {
			var self = this;
			this.configData = configData;
			
			for (var i in configData.template.assets.styles) {
				this.getStyle(configData.template.assets.styles[i]);
			}

			if (configData.title) {
				$('title').text(configData.title);
			}

			if (configData.posts) {
				for (var i in configData.posts) {
					this.get({
						url: 'posts/' + configData.posts[i] + '/posts.json',
						sucess: function (data) {
							self.setPostsData(data);
						}
					});
				}
			}
		},

		/**
	 	* getStyle
	 	*/
		setPostsData: function (data) {
			var postList = [];

			for (var postData in data.posts) {
				for (var j in data.posts[postData]) {
					if (j === 'post') {
						postList.push(data.posts[postData][j])
					}
				}
			}

			this.setView(this.configData);
		},

		/**
	 	* setView
	 	*/
		setView: function (data) {
			var viewScript = this.getTemplateView(data)
			console.log(data)
		},

		/**
	 	* getTemplateView
	 	*/
		getTemplateView: function (mainData) {
			var self = this;

			if (this.configData && this.configData.template && this.configData.template.assets && this.configData.template.assets.templates) {
				$.ajax({
					type: 'GET',
					url: this.configData.template.assets.templates.mainpage,
					dataType: 'text',   
					success: function (data) {
						self.onGetView(data, mainData)
					},
					error: function (data) {
						console.log('error', data.responseText);
					}
				});
			}
		},

		onGetView: function (viewElements, mainData) {
			$('body').append(viewElements);
			this.mainTemplate = _.template($('.main-page').text());

			var html = this.mainTemplate({'mainData' : mainData});
			
			$('body').html(html);
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