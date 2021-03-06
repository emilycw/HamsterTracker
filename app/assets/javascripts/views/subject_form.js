HamsterTracker.Views.SubjectForm = Backbone.View.extend({
  events: {
    'submit form': 'submit'
  },

  template: JST['subject/form'],

  initialize: function(options) {
    this.listenTo(this.model, 'sync', this.render);
  },

  render: function () {
    var content = this.template({subject: this.model});
    this.$el.html(content);
    return this;
  },

  submit: function (event) {
    event.preventDefault();
    var attrs = $(event.target).serializeJSON();

    var that = this;
    this.model.set(attrs);
    this.model.save({}, {
      success: function () {
        that.collection.add(that.model);
        Backbone.history.navigate('#/tracking_subjects/'+that.model.get("id"), { trigger: true });
      },

      error: function (model, response) {
        $('.errors').empty();
        var $li = $('<li>' + response.responseText + '</li>');
        $('.errors').append($li);
      }
    });
    this.remove();
  }
});