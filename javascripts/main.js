//get hackers counter
function get_counter() {
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
};

function get_events() {
  var ical_file = '/hsgr.ics';

  //run ical parser on load
  window.addEventListener("load", function() {
    //Create new ical parser
    new ical_parser(ical_file, function(cal) {
      //When ical parser has loaded file
      //get future events
      events = cal.getFutureEvents();
      //And display them
      displayDemo(events);
    });
  }, true);

  //Display All future events in ical file as list.
  function displayDemo(events) {
    //Foreach event
    events.forEach(function(event) {
      //Create a list item
      var li = document.createElement('li');
      //Add details from cal file.
      li.innerHTML = '<strong>' +event.SUMMARY + '</strong><br/> ' +
      event.day + ': ' +event.start_time + ' - ' + event.end_time + ' ('+event.start_date+ ')' ;
      //Add list item to list.
      document.getElementById('calendar').appendChild(li);
    });
  }
}

$(document).ready(function() {
  $('#loading').toggle();
  get_counter();
  get_events();
  var refreshId = setInterval(function() {
    get_counter();
  }, 100000);
});

$(document).ajaxStart(function() {
  $('#loading').toggle();
}).ajaxStop( function() {
  $('#loading').toggle();
});
