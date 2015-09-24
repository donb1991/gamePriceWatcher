var request = require('request');

var randomGame = {

  getRandomGame: function(req, res, next) {
    var randomGame = {};
    request.get('http://www.cheapshark.com/api/1.0/deals', function(err, response, deal) {
      jsonDeal = JSON.parse(deal);
      randomGame.title = jsonDeal[0].title;
      randomGame.price = jsonDeal[0].salePrice;
      randomGame.thumb = jsonDeal[0].thumb;
      request.get('http://www.cheapshark.com/api/1.0/stores', function(err, response, stores) {
        JSON.parse(stores).forEach(function(store) {
          if (jsonDeal[0].storeID == store.storeID) {
            randomGame.retailer = store.storeName;
          }
        });

        res.locals.randomGame = randomGame;
        return next();
      });
    });
  },

};

module.exports = randomGame;
