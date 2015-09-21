$(document).ready(function() {

  $('.search').on('click', 'button', searchGames);

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
    var $results = $('.results');
    var $result = $('<span> </span>');

    results.forEach(function(result) {
      var $result = $('<span> </span>');
      console.log(result.external);
      $result.text(result.external);
      $('<br />').appendTo($result);
      $result.appendTo($results);
    });
  }
});
