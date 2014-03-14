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