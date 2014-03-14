Trellino.Views.ListView = Trellino.CompositeView.extend({
  template: JST["list"],
  $subviewContainer: function() {
    return $("#list-" + this.model.get("id") + "-cards");
  },

  render: function() {
    var view = this;
    this.$el.html(this.template({
      list: this.model
    }));
    this.subviews().forEach(function(subview) {
      view.$subviewContainer().append(subview.render().$el);
    });
    return this;
  },

  initialize: function() {
    this.listenTo(this.model, "change sync update", this.render);
    this.listenTo(this.collection, "add", this.addCardView);
    this.listenTo(this.collection, "remove", this.removeSubview);
    this.listenTo(this.collection, "change:title sync update", this.render);
  },

  addCardView: function(model) {
    var cardView = new Trellino.Views.CardView({
      model: model
    });
    this.addSubview(cardView);
    this.sortSubviews("rank");
    this.render();
  }
})