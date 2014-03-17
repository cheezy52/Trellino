Trellino.Views.CardView = Backbone.View.extend({
  template: JST["card"],
  tagName: "li class='ui-state-default'",

  events: {
    "mouseenter .card-container": "showDeleteButton",
    "mouseleave .card-container": "hideDeleteButton"
  },

  render: function() {
    this.$el.html(this.template({
      card: this.model
    }));
    this.delegateEvents();
    return this;
  },

  showDeleteButton: function(event) {
    this.$('.card-delete-container').removeClass("hide");
  },

  hideDeleteButton: function(event) {
    this.$('.card-delete-container').addClass("hide");
  },

  initialize: function() {
    this.listenTo(this.model, "change sync update", this.render);
  }
})