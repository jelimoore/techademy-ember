import DS from 'ember-data';

export default DS.Model.extend({
        username: DS.attr('string'),
        dates: DS.attr('object'),
	owner: DS.attr('object'),
	description: DS.attr('string'),
	link: DS.attr('string'),
	views: DS.attr('number'),
	tags: DS.attr('object'),
        id: '',
        farm: DS.attr('number'),
        secret: DS.attr('string'),
        server: DS.attr('string'),
        url: function(){
                return "https://farm"+this.get('farm')+".staticflickr.com/"+this.get('server')+"/"+this.get('id')+"_"+this.get('secret')+"_b.jpg";
        }.property('farm','server','id','secret'),
});
