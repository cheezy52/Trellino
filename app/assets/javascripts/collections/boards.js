Trellino.Collections.Boards = Backbone.Collection.extend({
  url: "boards",
  model: Trellino.Models.Board,
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
  }
})