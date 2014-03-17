Trellino.Views.BoardNewView = Backbone.View.extend({
  template: JST["board_new"],

  render: function() {
    this.$el.html(this.template());
    return this;
  },

  events: {
    "submit #new-board": "addBoard"
  },

  addBoard: function(event) {
    var view = this;
    event.preventDefault();
    var formData = $(event.target).serializeJSON();
    var newBoard = new Trellino.Models.Board();
    newBoard.save(formData, {
      success: function(model) {
        view.collection.add(model);
        view.$el.append("Board creation successful!");
        Backbone.history.navigate("#/boards/" + model.get("id"));
      }
    });
  }
})