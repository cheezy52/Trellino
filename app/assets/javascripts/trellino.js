window.Trellino = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function () {
    var boards = Trellino.Collections.boards = new Trellino.Collections.Boards();
    boards.fetch();
    var router = window.Trellino.router = new Trellino.Routers.TrellinoRouter($("#content"));
    Backbone.history.start();
  }
};

$(document).ready(function() {
  window.Trellino.initialize();
});

Trellino.CompositeView = Backbone.View.extend({
  remove: function() {
    Backbone.View.prototype.remove.call(this);

    this.subviews().forEach(function(subview) {
      subview.remove();
    })
  },

  subviews: function() {
    if (this._subviews) {
      return this._subviews;
    } else {
      this._subviews = [];
      return this._subviews;
    }
  },

  addSubview: function(subview) {
    this.subviews().push(subview);
  },

  removeSubview: function(subview) {
    var topView = this;
    var foundSubview = _.find(this.subviews(), function(checkedSubview) {
      subview.model === checkedSubview.model;
    })
    if (foundSubview) {
      this.subviews().splice(this.subviews().indexOf(foundSubview), 1)
      foundSubview.remove();
    }
  },

  sortSubviews: function(sortVar) {
    this.subviews().sort(function(subview) {
      return subview.model.get(sortVar);
    })
  }
})