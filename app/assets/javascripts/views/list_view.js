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
    this.$('.list-cards').sortable({
      remove: this.removeCard.bind(this),
      receive: this.receiveCard.bind(this),
      deactivate: this.updateListRanks.bind(this),
      connectWith: ".list-cards"
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

  removeCard: function(event, ui) {
    var cardId = $($(ui.item.children()[0]).children()[0]).data("id");
    var card = this.collection.get(cardId);
    this.collection.remove(card);
    //no DB update to avoid race condition/orphaned cards
  },

  receiveCard: function(event, ui) {
    var cardId = $($(ui.item.children()[0]).children()[0]).data("id");
    var card = null;
    var view = this;
    if (this.parentView) {
      var cardList = this.parentView.collection.find(function(list) {
        return list.collection.get(cardId);
      });
      card = cardList.collection.get(cardId);
    } else {
      card = new Trellino.Models.Card({
        list_id: this.model.get("id"),
        id: cardId
      });
    };
    if(card) {
      this.collection.add(card);
    }
    card.set("list_id", this.model.get("id"));

    //this is literally the worst never ever do this
    var cardRank = null;
    $.each($('.list-cards'), function(listIndex, list) {
      $.each($(list).children(), function(cardIndex, card) {
        var id = $($(card).children().children()[0]).data("id");
        if(id === cardId) {
          if (list[cardIndex - 1]) {
            var prevId = $($(list[cardIndex - 1]).children().children()[0]).data("id");
            var prevCard = view.collection.get(prevId);
            cardRank = prevCard.get("rank") + 1;
          } else if (list[cardIndex + 1]) {
            var nextId = $($(list[cardIndex + 1]).children().children()[0]).data("id");
            var nextCard = view.collection.get(nextId);
            cardRank = nextCard.get("rank") + 1;
          }
        } else if (cardRank) {
          var prevId = $($(list[cardIndex - 1]).children().children()[0]).data("id");
          var thisId = $(card.children().children()[0]).data("id");
          var prevCard = view.collection.get(prevId);
          var thisCard = view.collection.get(thisId);
          thisCard.set("rank", prevCard.get("rank") + 1);
          thisCard.save();
        }
      });
    });
    card.set("rank", (cardRank ? cardRank : 1));

    card.save();
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