Trellino.Routers.TrellinoRouter = Backbone.Router.extend({
  routes: {
    "": "boardsIndex",
    "boards": "boardsIndex",
    "boards/": "boardsIndex",
    "boards/new": "boardNew",
    "boards/:id": "boardShow",
    // "cards/:id": "cardShow"
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
    var boardLists = new Trellino.Collections.BoardLists([], {
      boardId: id
    });
    boardLists.fetch();
    var boardView = new Trellino.Views.BoardShowView({
      model: Trellino.Collections.boards.getOrFetch(id),
      collection: boardLists
    });
    this._swapView(boardView);
  },
  //
  // cardShow: function(id) {
  //   var cardTodoItems = new Trellino.Collections.CardTodoItems({
  //     cardId: id
  //   });
  //   var cardView = new Trellino.Views.CardShowView({
  //     model: Trellino.Collections.cards.getOrFetch(id),
  //     collection: cardTodoItems
  //   })
  // },

  initialize: function($rootEl) {
    this.$rootEl = $rootEl;
  },

  _swapView: function(view) {
    if(this.currentView) {
      this.currentView.remove();
    }
    this.currentView = view;
    $("#content").html(view.render().$el);
    $('.ui-sortable').sortable();
    $('.list-container').sortable();
  }
})