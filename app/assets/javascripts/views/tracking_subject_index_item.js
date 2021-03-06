HamsterTracker.Views.SubjectsIndexItem = Backbone.CompositeView.extend({
  initialize: function(){
    this.listenTo(this.model, 'sync destroy', this.render);
  },

  template: JST['tracking_subjects_index_item'],

  tagName: "li",

  render: function(){
    var content = this.template({subject: this.model});
    this.$el.html(content);;
    return this;
  },
})