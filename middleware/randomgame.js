var request = require('request');
var client = require('google-images');

var randomGame = {

  getRandomGame: function(req, res, next) {
    var randomGame = {};
    request.get('http://www.cheapshark.com/api/1.0/deals', function(err, response, deal) {
      jsonDeal = JSON.parse(deal);
      randomGame.title = jsonDeal[0].title;
      randomGame.price = jsonDeal[0].salePrice;
      randomGame.redirectLink = 'http://www.cheapshark.com/redirect.php?dealID=' + jsonDeal[0].dealID;
      client.search(randomGame.title + ' cover art', { page: 0, callback: function(err, images) {
        randomGame.thumb = images[0].unescapedUrl;
        request.get('http://www.cheapshark.com/api/1.0/stores', function(err, response, stores) {
          JSON.parse(stores).forEach(function(store) {
            if (jsonDeal[0].storeID == store.storeID) {
              randomGame.retailer = store.storeName;
            }
          });

          res.locals.randomGame = randomGame;
          return next();
        });
      },});
    });
  },

};

module.exports = randomGame;
