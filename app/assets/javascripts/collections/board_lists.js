Trellino.Collections.BoardLists = Backbone.Collection.extend({
  url: function() {
    return "boards/" + this.boardId + "/lists";
  },
  initialize: function(models, options) {
    this.boardId = options.boardId;
  },
  model: Trellino.Models.List,
  comparator: function(model) {
    return model.get("rank");
  }
})