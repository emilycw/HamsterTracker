HamsterTracker.Views.DataPointForm = Backbone.View.extend({
  events: {
    'submit form': 'submit',
    'click .delete': "destroySubject"
  },

  template: JST['dataPoint/form'],

  initialize: function(options) {
    this.listenTo(this.model, 'sync', this.render);
  },
  render: function () {
    var content = this.template({dataPoint: this.model});
    this.$el.html(content);
    return this;
  },

  destroySubject: function(event){
    if (window.confirm("Are you sure you want to delete this data point?")){
      this.model.destroy();
      this.remove();
      Backbone.history.navigate('#/tracking_subjects/' + 
        this.model.trackingSubjectId, 
        { trigger: true });
    }
  },

  submit: function (event) {
    event.preventDefault();
    var attrs = $(event.target).serializeJSON();
    var that = this;
    this.model.set(attrs);
    var sbjId = this.model.trackingSubjectId;
    this.model.save({}, {
      success: function () {
        that.collection.add(that.model);
        Backbone.history.navigate('#/tracking_subjects/'+sbjId, { trigger: true });
      },

      error: function (model, response) {
        $('.errors').empty();
        var $li = $('<li>' + response.responseText + '</li>');
        $('.errors').append($li);
      }
    });
  }
});