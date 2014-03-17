Trellino.Models.List = Backbone.Model.extend({
  urlRoot: function() {
    return "boards/" + this.get("board_id") + "/lists";
  },
})