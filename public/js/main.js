$(document).ready(function() {

  var $search = $('.search');
  var $results = $('.results');
  var $content = $('#content');

  $search.on('click', 'button', searchGames);
  $results.on('click', 'button', addToUsersList);

  function searchGames(e) {
    e.preventDefault();
    $.ajax({
      url: 'https://www.cheapshark.com/api/1.0/games?title=' + $('.search input').val() + '&limit=5',
      method: 'GET',
    }).done(function(data) {
      renderResults(data);
    });
  }

  function renderResults(results) {
    $results.html('');
    results.forEach(function(result) {
      var $row = $('<div class=\'row\'></div>');
      var $column = $('<div class=\'game columns large-12\'></div>');
      var $result = $('<section> </section>');
      var $form = $('<form  action=\'#\' method=\'get\'> ' +
        '<div class=\'right columns large-4\'>' +
          '<div class=\'row collapse\'>' +
            '<div class=\'columns large-11\'>' +
              '<input type=\'Number\'class=\'userPrice\' placeholder=\'Your price\'></input>' +
            '</div>' +
            '<div class=\'columns large-1\'>' +
              '<button class=\'button postfix success\' type="sumbit" name="button" disabled=true>+</button>' +
            '</div>' +
          '</div>' +
        '</div></form>');

      $form.appendTo($result);
      $result.appendTo($column);
      $column.appendTo($results);
      $row.appendTo($column);

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
        getRetailer(game, deal.gameInfo.storeID, $result);
      });
    });
  }

  function getRetailer(game, storeId, $result) {
    $.ajax({
      url: 'https://www.cheapshark.com/api/1.0/stores',
      method: 'GET',
    }).done(function(stores) {
      stores.forEach(function(store) {
        if (storeId == store.storeID) {
          game.retailer = store.storeName;
        }
      });

      addHiddenGameData(game, $result);
    });
  }

  function addHiddenGameData(game, $result) {
    var $img = $('<img class="coverArt columns large-3" src="' + game.thumb + '" alt="' + game.title + ' Cover Art" />');
    var $div = $('<div class="columns large-5"> </div>');
    var $form = $result.children('form');
    $div.append('<span class="title">Title: ' + game.title + '</span><br />');
    $div.append('<span class="title">Retailer: ' + game.retailer + '</span> <br />');
    $div.append('<span class="title">Price: ' + game.price + '</span> <br />');
    $div.append('<span class="title">Publisher: ' + game.publisher + '</span> <br />');
    $div.prependTo($result);
    $img.prependTo($result);
    $('<input class="title" type=hidden value="' + game.title + '"></input>').appendTo($form);
    $('<input class="gameId" type=hidden value="' + game.gameId + '"></input>').appendTo($form);
    $('<input class="retailer" type=hidden value="' + game.retailer + '"></input>').appendTo($form);
    $('<input class="price" type=hidden value="' + game.price + '"></input>').appendTo($form);
    $('<input class="publisher" type=hidden value="' + game.publisher + '"></input>').appendTo($form);
    $('<input class="thumb" type=hidden value="' + game.thumb + '"></input>').appendTo($form);
    $form.find('button').attr('disabled', false);
  }

  function addToUsersList(e) {
    e.preventDefault();
    var userId = $results.attr('class').split(' ')[1];
    $gameForm = ($(e.target).closest('form'));
    data = {
      gameId:  $gameForm.find('.gameId').val(),
      title: $gameForm.find('.title').val(),
      retailer: $gameForm.find('.retailer').val(),
      price: $gameForm.find('.price').val(),
      publisher: $gameForm.find('.publisher').val(),
      thumb: $gameForm.find('.thumb').val(),
      userPrice: $gameForm.find('.userPrice').val(),
    };
    $.ajax({
      url: 'http://localhost:3000/users/' + userId + '/games',
      method: 'POST',
      data: data,
    });
  }

  $('a').on('click', function(e) {
    e.preventDefault();
    var url = 'http://localhost:3000' + $(e.target).attr('href');
    $.ajax({
      url: url,
      method: 'GET',
    }).done(function(data) {
      console.log(data);
      $content.html(data);
    });
  });

  $('.login').on('click', 'button', function(e) {
    e.preventDefault();
    $form = $(e.target).closest('form');
    console.log($form);
    data = {
      userName: $form.children('.userName').val(),
      password: $form.children('.password').val(),
    };
    $.ajax({
      url: 'http://localhost:3000/login',
      method: 'GET',
      data: data,
    }).done(function(data) {
      console.log(data);
      $content.html(data);
    });
  });
});
