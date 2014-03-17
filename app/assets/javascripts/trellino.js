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

  removeSubview: function(passedModel) {
    var topView = this;
    var passedModelView = this.findSubviewByModel(passedModel);

    if (passedModelView) {
      this.subviews().splice(this.subviews().indexOf(passedModelView), 1)
      passedModelView.remove();
    }
  },

  sortSubviews: function(sortVar) {
    this.subviews().sort(function(subview1, subview2) {
      return subview1.model.get(sortVar) - subview2.model.get(sortVar);
    })
  },

  findSubviewByModel: function(model) {
    var foundView = _.find(this.subviews(), function(checkedSubview) {
      return model === checkedSubview.model;
    });
    return foundView;
  }
})