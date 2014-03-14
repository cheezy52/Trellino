Trellino.Views.BoardsIndexView = Backbone.View.extend({
  template: JST["board"],

  initialize: function() {
    this.listenTo(this.collection, "add change:title remove sync", this.render)
  },

  render: function() {
    var view = this;
    this.$el.empty();
    this.collection.each(function(board) {
      view.$el.append(view.template({ board: board }));
    })
    view.$el.append($('<br><a href="#/boards/new">Add a Board!</a>'));
    return this;
  }
})