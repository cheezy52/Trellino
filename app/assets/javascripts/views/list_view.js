Trellino.Views.ListView = Trellino.CompositeView.extend({
  template: JST["list"],
  tagName: "div class='list-container'",
  $subviewContainer: function() {
    return this.$("#list-" + this.model.get("id") + "-cards");
  },

  events: {
    "submit .new-card": "addCard",
    "click .delete-card": "deleteCard",
    "click .new-card-show-button": "showCardAdd",
    "mouseenter .list-container-indiv": "showAddRemoveIcons",
    "mouseleave .list-container-indiv": "hideAddRemoveIcons"
  },

  updateListRanks: function(event, ui) {
    var view = this;
    var cards = $(ui.item).parent().find(".card-container");

    for (var i = 1; i < cards.length; i++) {
      //this is horrible hacky bullshit, don't do this
      //very very brittle
      var firstModel = view.collection.get($(cards[i - 1].children[0]).data("id"));
      var secondModel = view.collection.get($(cards[i].children[0]).data("id"));

      if (firstModel.get("rank") >= secondModel.get("rank")) {
        secondModel.set("rank", firstModel.get("rank") + 1);
        secondModel.save();
      }
    }
    this.sortSubviews("rank");
    this.render();
  },

  render: function() {
    var view = this;

    this.$el.html(this.template({
      list: this.model
    }));
    this.subviews().forEach(function(subview) {
      view.$subviewContainer().append(subview.render().$el);
    });
    this.$('.ui-sortable').sortable({
      update: this.updateListRanks.bind(this)
    });
    this.delegateEvents();
    return this;
  },

  initialize: function() {
    this.listenTo(this.model, "change sync update", this.render);
    this.listenTo(this.collection, "add", this.addCardView);
    this.listenTo(this.collection, "remove", this.removeSubview);
    this.listenTo(this.collection, "change:title sync update", this.render);
  },

  showAddRemoveIcons: function(event) {
    this.$('.new-card-container').removeClass("hide");
    this.$('.list-delete-container').removeClass("hide");
  },

  hideAddRemoveIcons: function(event) {
    this.$('.new-card-container').addClass("hide");
    this.$('.list-delete-container').addClass("hide");
  },

  showCardAdd: function(event) {
    this.$('.new-card').removeClass("hide");
    this.$('.new-card-show-button').addClass("hide");
  },

  addCardView: function(model) {
    var cardView = new Trellino.Views.CardView({
      model: model,
      list_id: this.model.id
    });
    this.addSubview(cardView);
    this.sortSubviews("rank");
    this.render();
  },

  addCard: function(event) {
    event.preventDefault();
    var view = this;
    var maxCardRank = this.maxCardRank();
    var formData = $(event.target).serializeJSON();

    var card = new Trellino.Models.Card({
      list_id: this.model.id,
      rank: maxCardRank
    });

    formData.card.list_id = this.model.id;
    formData.card.rank = maxCardRank;

    card.save(formData, {
      success: function(model) {
        view.collection.add(model);
      }
    })
    //should fire addCardView as a result
  },

  deleteCard: function(event) {
    var view = this;
    event.preventDefault();
    var card = this.collection.get($(event.target).data("id"));
    card.destroy();
    this.collection.remove(card);
    //destroy should remove from collection, which fires removeSubview event
  },

  maxCardRank: function() {
    var maxCard = this.collection.max(function(model) {
      return model.get("rank");
    });

    if (maxCard !== -Infinity) {
      maxCardRank = maxCard.get("rank");
    } else {
      maxCardRank = 0;
    }
    return maxCardRank;
  }


})