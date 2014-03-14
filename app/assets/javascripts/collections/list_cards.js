Trellino.Collections.ListCards = Backbone.Collection.extend({
  url: function() {
    return "lists/" + this.listId + "/cards";
  },
  model: Trellino.Models.Card,
  initialize: function(models, options) {
    this.listId = options.listId;
  },
  getOrFetch: function(id) {
    var coll = this;
    if (this.get(id)) {
      return this.get(id);
    } else {
      var tempModel = new this.model({ id: id });
      tempModel.fetch({
        success: function(model) {
          coll.add(model);
        }
      });
      return tempModel;
    }
  },
  comparator: function(model) {
    return model.get("rank");
  }
})