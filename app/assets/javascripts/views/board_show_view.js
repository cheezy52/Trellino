Trellino.Views.BoardShowView = Trellino.CompositeView.extend({
  template: JST["board_show"],
  $subviewContainer: function() {
    return $("#board-" + this.model.get("id") + "-lists");
  },

  initialize: function() {
    this.listenTo(this.collection, "add", this.addListView);
    this.listenTo(this.collection, "remove", this.removeSubview);
    this.listenTo(this.collection, "change:title sync update", this.render);
    this.listenTo(this.model, "change sync update", this.render);
  },

  render: function() {
    var view = this;
    this.$el.html(this.template({
      board: this.model
    }));
    this.subviews().forEach(function(subview) {
      view.$subviewContainer().append(subview.render().$el);
    });
    return this;
  },

  addListView: function(model) {
    var listCards = new Trellino.Collections.ListCards([], {listId: model.get("id")});
    listCards.fetch();
    this.addSubview(new Trellino.Views.ListView({
      model: model,
      collection: listCards
    }));
    this.sortSubviews("rank");
    this.render();
  }
})