$(document).ready(function() {

  var $search = $('.search');
  var $results = $('.results');
  var $content = $('#content');
  var $update = $('.update');
  var $delete = $('.delete');
  var $filterLink = $('.filterLink');
  var $password = $('.password');
  var $signup = $('.signup');
  var $gamelist = $('.gamelist .game');

  $('small').hide();

  if ($gamelist.length === $('.filter').length) {
    $('.message').show();
    $('.filter').show();
  }

  $search.on('click', 'button', searchGames);
  $results.on('click', 'button', addToUsersList);
  $update.on('click', updateGamePrice);
  $delete.on('click', deleteGame);
  $filterLink.on('click', filter);
  $signup.on('keyup', confrimPassword);

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
      var $row = $('<div class=\'row \'></div>');
      var $column = $('<div class=\'columns large-12\'></div>');
      var $result = $('<div class=\'game\'> </div>');
      var $form = $('<div class=\'right columns large-4 vcenter\'> ' +
        '<form class=\'\'action=\'#\' method=\'get\'>' +
          '<div class=\'row collapse\'>' +
            '<div class=\'columns large-11 \'>' +
              '<input type=\'Number\'class=\'userPrice\' placeholder=\'Your price\'></input>' +
            '</div>' +
            '<div class=\'columns large-1\'>' +
              '<button class=\'button postfix success expand\' type="sumbit" name="button" disabled=true>+</button>' +
            '</div>' +
          '</div>' +
        '</form></div>');

      $form.appendTo($result);
      $result.appendTo($column);
      $column.appendTo($row);
      $row.appendTo($results);

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
    var $img = $('<img class="coverArt columns large-2 vcenter" src="' + game.thumb + '" alt="' + game.title + ' Cover Art" />');
    var $div = $('<div class="columns large-5 vcenter"> </div>');
    var $form = $result.find('form');
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
    $gameForm = $(e.target.form);
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
      url: window.location.href + '/usergames',
      method: 'POST',
      data: data,
    });
  }

  function updateGamePrice(e) {
    userPrice = Number($(e.target.form).find('.userPrice').val());
    url =  window.location.href + '/' + $(e.target.form).attr('class');
    $.ajax({
      url: url,
      method: 'PUT',
      data: {userPrice: userPrice},
    }).done(function(data) {
      if (data.userPrice > userPrice) {
        $(e.target).closest('.game').addClass('filter');
      } else {
        $(e.target).closest('.game').removeClass('filter');
      }
    });
  }

  function deleteGame(e) {

    url =  window.location.href + '/' + $(e.target.form).attr('class');
    $.ajax({
      url: url,
      method: 'delete',
    }).done(function(data) {
      $(e.target).closest('.game').remove();
    });
  }

  function filter(e) {
    e.preventDefault();
    if ($(e.target).text() === 'All') {
      $('.filter').show();
    } else {
      $('.filter').hide();
    }
  }

  function confrimPassword(e) {
    var $signupbutton = $('.signupButton');
    var $userName = $('.userName');
    if ($($password[0]).val() != $($password[1]).val() && ($($password[1]).val())) {
      $signupbutton.attr('disabled', true);
    } else if (!($($userName).val())) {
      $signupbutton.attr('disabled', true);
    } else {
      $signupbutton.attr('disabled', false);
    }
  }
});
