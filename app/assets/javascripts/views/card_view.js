Trellino.Views.CardView = Backbone.View.extend({
  template: JST["card"],
  tagName: "li class='ui-state-default'",

  render: function() {
    this.$el.html(this.template({
      card: this.model
    }));
    return this;
  },

  initialize: function() {
    this.listenTo(this.model, "change sync update", this.render);
  }
})