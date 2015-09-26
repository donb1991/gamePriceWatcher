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
      var $column = $('<div class=\'columns medium-12\'></div>');
      var $result = $('<div class=\'game\'> </div>');
      var $form = $('<div class=\'right columns medium-4 small-6 vcenter\'> ' +
        '<form class=\'\'action=\'#\' method=\'get\'>' +
          '<div class=\'row collapse\'>' +
            '<div class=\'columns small-11 \'>' +
              '<input type=\'Number\'class=\'userPrice\' placeholder=\'Your price\'></input>' +
            '</div>' +
            '<div class=\'columns small-1\'>' +
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
        game.price = deal.gameInfo.salePrice;
        game.publisher = deal.gameInfo.publisher;
        $.ajax({
          url:'https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=' + game.title + ' Cover Art',
          method: 'GET',
          dataType: 'jsonp',
        }).done(function(data) {
          game.thumb = data.responseData.results[0].unescapedUrl;
          getRetailer(game, deal.gameInfo.storeID, $result);
        });
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
    var $img = $('<img class="coverArt columns medium-2 show-for-medium-up vcenter" src="' + game.thumb + '" alt="' + game.title + ' Cover Art" />');
    var $div = $('<div class="columns medium-5 small-6 vcenter"> </div>');
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

  function googleImg() {
    google.load('search', '1');

    var imageSearch;

    function addPaginationLinks() {

      // To paginate search results, use the cursor function.
      var cursor = imageSearch.cursor;
      var curPage = cursor.currentPageIndex; // check what page the app is on
      var pagesDiv = document.createElement('div');
      for (var i = 0; i < cursor.pages.length; i++) {
        var page = cursor.pages[i];
        if (curPage == i) {
          // If we are on the current page, then don't make a link.
          var label = document.createTextNode(' ' + page.label + ' ');
          pagesDiv.appendChild(label);
        } else {
          // Create links to other pages using gotoPage() on the searcher.
          var link = document.createElement('a');
          link.href = '/image-search/v1/javascript:imageSearch.gotoPage(' + i + ');';
          link.innerHTML = page.label;
          link.style.marginRight = '2px';
          pagesDiv.appendChild(link);
        }
      }

      var contentDiv = document.getElementById('content');
      contentDiv.appendChild(pagesDiv);
    }

    function searchComplete() {

      // Check that we got results
      if (imageSearch.results && imageSearch.results.length > 0) {

        // Grab our content div, clear it.
        var contentDiv = document.getElementById('content');
        contentDiv.innerHTML = '';

        // Loop through our results, printing them to the page.
        var results = imageSearch.results;
        for (var i = 0; i < results.length; i++) {
          // For each result write it's title and image to the screen
          var result = results[i];
          var imgContainer = document.createElement('div');
          var title = document.createElement('div');

          // We use titleNoFormatting so that no HTML tags are left in the
          // title
          title.innerHTML = result.titleNoFormatting;
          var newImg = document.createElement('img');

          // There is also a result.url property which has the escaped version
          newImg.src = '/image-search/v1/result.tbUrl;';
          imgContainer.appendChild(title);
          imgContainer.appendChild(newImg);

          // Put our title + image in the content
          contentDiv.appendChild(imgContainer);
        }

        // Now add links to additional pages of search results.
        addPaginationLinks(imageSearch);
      }
    }

    function OnLoad() {

      // Create an Image Search instance.
      imageSearch = new google.search.ImageSearch();

      // Set searchComplete as the callback function when a search is
      // complete.  The imageSearch object will have results in it.
      imageSearch.setSearchCompleteCallback(this, searchComplete, null);

      // Find me a beautiful car.
      imageSearch.execute('Subaru STI');

      // Include the required Google branding
      google.search.Search.getBranding('branding');
    }

    google.setOnLoadCallback(OnLoad);
  }

});
