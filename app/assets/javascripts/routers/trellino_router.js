Trellino.Routers.TrellinoRouter = Backbone.Router.extend({
  routes: {
    "": "boardsIndex",
    "boards": "boardsIndex",
    "boards/new": "boardNew",
    "boards/:id": "boardShow"
  },

  boardsIndex: function() {
    var indexView = new Trellino.Views.BoardsIndexView({
      collection: Trellino.Collections.boards
    });
    this._swapView(indexView);
  },

  boardNew: function() {
    var newView = new Trellino.Views.BoardNewView({
      collection: Trellino.Collections.boards
    });
    this._swapView(newView);
  },

  boardShow: function(id) {

  },

  initialize: function($rootEl) {
    this.$rootEl = $rootEl;
  },

  _swapView: function(view) {
    if(this.currentView) {
      this.currentView.remove();
    }
    this.currentView = view;
    $("#content").html(view.render().$el);
  }
})