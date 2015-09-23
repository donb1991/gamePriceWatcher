var db = require('../models');
var request = require('request');

var updateHelper = function(req, res, next) {

  req.updateGames = function() {
    db.UserGame.find({user: req.session.id}).populate('game').exec(function(err, usergames) {
      usergames.forEach(function(usergame) {
        var updatedGameInfo = {
          _id: usergame.game._id,
          gameId: usergame.game.gameId,
          title: usergame.game.title,
        };
        var loweistPrice = Infinity;
        var cheapistDeal = {};
        var storeId;
        request.get('http://www.cheapshark.com/api/1.0/games?ids=' + usergame.game.gameId, function(err, response, body) {
          jsonBody = JSON.parse(body);
          updatedGameInfo.thumb = jsonBody[usergame.game.gameId].info.thumb;
          jsonBody[usergame.game.gameId].deals.forEach(function(deal) {
            if (deal.price < loweistPrice) {
              loweistPrice = deal.price;
              cheapistGame = deal;
            }
          });

          updatedGameInfo.price = cheapistGame.price;
          storeId = cheapistGame.storeID;

          request.get('http://www.cheapshark.com/api/1.0/stores', function(err, response, body) {
            JSON.parse(body).forEach(function(store) {
              if (storeId == store.storeID) {
                updatedGameInfo.retailer = store.storeName;
              }
            });

            db.Game.findByIdAndUpdate(updatedGameInfo._id, updatedGameInfo, function(err, game) {
              if (err) {
                console.log(err);
              }
            });
          });
        });
      });
    });
  };

  next();
};

module.exports = updateHelper;
