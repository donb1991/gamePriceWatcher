$(document).ready(function() {

  var $search = $('.search');
  var $results = $('.results');

  $search.on('click', 'button', searchGames);
  $results.on('click', 'button', addToUsersList);

  function searchGames(e) {
    e.preventDefault();
    $.ajax({
      url: 'https://www.cheapshark.com/api/1.0/games?title=' + $('.search > input').val() + '&limit=5',
      method: 'GET',
    }).done(function(data) {
      renderResults(data);
    });
  }

  function renderResults(results) {
    $results.html('');
    results.forEach(function(result) {
      var $result = $('<span> </span>');
      var $form = $('<form action=\'#\' method=\'get\'><button type="sumbit" name="button" disabled=true>Add</button></form>');
      $result.text(result.external);
      $form.appendTo($result);
      $result.appendTo($results);

      $.ajax({
        url: 'https://www.cheapshark.com/api/1.0/deals?id=' + result.cheapestDealID,
        method: 'GET',
      }).done(function(deal) {
        var game = {};
        game.title = result.external;
        game.gameId = result.gameID;
        game.thumb = result.thumb;
        game.price = deal.gameInfo.salePrice;
        game.publisher = deal.gameInfo.publisher;
        getRetailer(game, deal.gameInfo.storeID, $form);
      });
    });
  }

  function addHiddenGameData(game, $form) {
    $('<input class="title" type=hidden value="' + game.title + '"></input>').appendTo($form);
    $('<input class="gameId" type=hidden value="' + game.gameId + '"></input>').appendTo($form);
    $('<input class="retailer" type=hidden value="' + game.retailer + '"></input>').appendTo($form);
    $('<input class="price" type=hidden value="' + game.price + '"></input>').appendTo($form);
    $('<input class="publisher" type=hidden value="' + game.publisher + '"></input>').appendTo($form);
    $('<input class="thumb" type=hidden value="' + game.thumb + '"></input>').appendTo($form);
    $form.children('button').attr('disabled', false);
  }

  function getRetailer(game, storeId, $form) {
    $.ajax({
      url: 'https://www.cheapshark.com/api/1.0/stores',
      method: 'GET',
    }).done(function(stores) {
      stores.forEach(function(store) {
        if (storeId == store.storeID) {
          game.retailer = store.storeName;
        }
      });

      addHiddenGameData(game, $form);
    });
  }

  function addToUsersList(e) {
    e.preventDefault();
    var userId = $results.attr('class').split(' ')[1];
    $gameForm = ($(e.target).parent());
    data = {
      gameId:  $gameForm.children('.gameId').val(),
      title: $gameForm.children('.title').val(),
      retailer: $gameForm.children('.retailer').val(),
      price: $gameForm.children('.price').val(),
      publisher: $gameForm.children('.publisher').val(),
      thumb: $gameForm.children('.thumb').val(),
    };
    $.ajax({
      url: 'http://localhost:3000/users/' + userId + '/games',
      method: 'POST',
      data: data,
    });
  }

});
