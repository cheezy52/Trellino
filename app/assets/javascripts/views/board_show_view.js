Trellino.Views.BoardShowView = Trellino.CompositeView.extend({
  template: JST["board_show"],

  $subviewContainer: function() {
    return this.$("#board-" + this.model.get("id") + "-lists");
  },

  events: {
    "submit #new-list": "addList",
    "click .list-delete": "deleteList"
  },

  initialize: function() {
    this.listenTo(this.collection, "add", this.addListView);
    this.listenTo(this.collection, "remove", this.removeSubview);
    this.listenTo(this.collection, "change:title sync update", this.render);
    this.listenTo(this.model, "change sync update", this.render);
  },

  render: function() {
    var view = this;

    this.$el.html(this.template({
      board: this.model
    }));

    this.subviews().forEach(function(subview) {
      view.$subviewContainer().append(subview.render().$el);
    });
    $('.board-lists').sortable();

    return this;
  },

  addListView: function(model) {
    var listCards = new Trellino.Collections.ListCards([], {listId: model.get("id")});
    listCards.fetch();
    this.addSubview(new Trellino.Views.ListView({
      model: model,
      collection: listCards
    }));
    this.sortSubviews("rank");
    this.render();
  },

  addList: function(event) {
    event.preventDefault();

    var view = this;
    var maxRank = this.maxRank();
    var formData = $(event.target).serializeJSON();

    var newList = new Trellino.Models.List({
      board_id: this.model.id,
      rank: maxRank
    });

    formData.list.board_id = this.model.id;
    formData.list.rank = maxRank;

    newList.save(formData, {
      success: function(model) {
        view.collection.add(model);
      }
    });
    //should fire addListView as a result
  },

  deleteList: function(event) {
    var view = this;
    event.preventDefault();
    var list = this.collection.get($(event.target).data("id"));
    list.destroy();
    this.collection.remove(list);
    //destroy should remove from collection, which fires removeSubview event
  },

  maxRank: function() {
    var maxList = this.collection.max(function(model) {
      return model.get("rank");
    });

    if (maxList !== -Infinity) {
      maxRank = maxList.get("rank");
    } else {
      maxRank = 0;
    }
    return maxRank;
  }
})