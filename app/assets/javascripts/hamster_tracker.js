window.HamsterTracker = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    HamsterTracker.subjects = new HamsterTracker.Collections.Subjects();
    HamsterTracker.subjects.fetch()
    // { reset: true }
    HamsterTracker.unshownAttributes = []
    HamsterTracker.makeEntryErrors = []
    HamsterTracker.formsToSubmit = 0
    var indexView = new HamsterTracker.Views.SubjectsIndex({
      collection: HamsterTracker.subjects
    });
    $('#sidebar').html(indexView.render().$el);


    new HamsterTracker.Routers.Router({
      $rootEl: $("#content"),
      $sidebar: $('#sidebar')
    });


    //Less distressed by refresh if we stop history before starting
    Backbone.history.stop();
    Backbone.history.start();
  }
};