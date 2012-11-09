$(document).ready(function() {
  //get tweets
  $(".tweet").tweet({
    username: "hackerspacegr",
    count: 6,
    loading_text: "loading tweets..."
  });

  //get hackers counter
  $.ajax({
    url: 'http://hackerspace.gr/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=Network/Leases',
    dataType: 'jsonp',
    crossDomain: true,
    cache: false
  }).done(function(json) {
    var count = json.query.pages[168].revisions[0]["*"];
    $('#counter').html(count);
    if (count == "0") {
      $('.counter.panel').attr("id","close");
      $('#openornot').html('hackers in space, means that space is now closed!');
    } else {
      $('.counter.panel').attr("id","open");
      $('#openornot').html('hackers in space, means that space is now open!');
    }
  });
});

