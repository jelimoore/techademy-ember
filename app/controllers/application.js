import Ember from 'ember';

var PhotoCollection = Ember.ArrayProxy.extend(Ember.SortableMixin, {
	sortProperties: ['title'],
	sortAscending: true,
	content: [],
});

export default Ember.Controller.extend({
	photos: PhotoCollection.create(),
	searchField: '',
	tagSearchField: '',
	tagList: [],
	filteredPhotos: function () {
		var filter = this.get('searchField');
		var rx = new RegExp(filter, 'gi');
		var photos = this.get('photos');
		return photos.filter(function(photo){
			return photo.get('title').match(rx) || photo.get('username').match(rx);
		});
	}.property('photos.@each','tagSearchField'),
	actions: {
		search: function () {
			this.get('filteredPhotos');
			this.store.unloadAll('photo');
			this.send('getPhotos',this.get('searchField'));
			console.log("Searched stuff");
		},
		getPhotos: function(tag){
			console.log("Getting photos...");
			var apiKey = 'b8294fdcfcd1cf6b8de9727fc5ca3cf2';
			var host = 'https://api.flickr.com/services/rest/';
			var method = 'flickr.photos.search';
			var requestURL = host + "?method="+method + "&api_key="+apiKey+"&tags="+tag+"&format=json&nojsoncallback=1";
			var photos = this.get('photos');
			var t = this;
			console.log("Getting JSON...");
			Ember.$.getJSON(requestURL, function(data){
				console.log(data);
				data.photos.photo.map(function(photoitem) {
					var infoRequestURL = host+"?method=flickr.photos.getInfo&api_key="+apiKey+"&photo_id="+photoitem.id+"&format=json&nojsoncallback=1";
					console.log(infoRequestURL);
					Ember.$.getJSON(infoRequestURL, function(item){
						console.log(item);
						var photo = item.photo;
						var tags = photo.tags.tag.map(function(tagitem){
							return tagitem._content;
						});

						var newPhotoItem = t.store.createRecord('photo',{
							title: photo.title._content,
							dates: photo.dates,
							owner: photo.owner,
							description: photo.description._content,
							link: photo.urls.url[0]._content,
							views: photo.views,
							tags: tags,
							id: photo.id,
							farm: photo.farm,
							secret: photo.secret,
							server: photo.server,
						});
						photos.pushObject(newPhotoItem);
					});
				});
			});
		},
		clicktag: function(tag){
			this.set('tagSearchField', tag);
			this.get('photos').content.clear();
			this.store.unloadAll('photo');
			this.send('getPhotos',tag);
		},
	},

	init: function(){
		this._super.apply(this, arguments);
		var apiKey = 'b8294fdcfcd1cf6b8de9727fc5ca3cf2';
		var host = 'https://api.flickr.com/services/rest/';
		var method = "flickr.tags.getHotList";
		var requestURL = host + "?method="+method+"&api_key="+apiKey+"&count=100&format=json&nojsoncallback=1";
		console.log(requestURL);
		var t = this;
		Ember.$.getJSON(requestURL, function(data){
			console.log(data);
			data.hottags.tag.map(function(tag){
				t.get('tagList').pushObject(tag._content);
			});
		});
	}

});
