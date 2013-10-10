;(function ($, window, undefined) {
  'use strict';

  var $doc = $(document),
      Modernizr = window.Modernizr;

  $(document).ready(function() {
    $.fn.foundationAlerts           ? $doc.foundationAlerts() : null;
    $.fn.foundationButtons          ? $doc.foundationButtons() : null;
    $.fn.foundationAccordion        ? $doc.foundationAccordion() : null;
    $.fn.foundationNavigation       ? $doc.foundationNavigation() : null;
    $.fn.foundationTopBar           ? $doc.foundationTopBar() : null;
    $.fn.foundationCustomForms      ? $doc.foundationCustomForms() : null;
    $.fn.foundationMediaQueryViewer ? $doc.foundationMediaQueryViewer() : null;
    $.fn.foundationTabs             ? $doc.foundationTabs({callback : $.foundation.customForms.appendCustomMarkup}) : null;
    $.fn.foundationTooltips         ? $doc.foundationTooltips() : null;
    $.fn.foundationMagellan         ? $doc.foundationMagellan() : null;
    $.fn.foundationClearing         ? $doc.foundationClearing() : null;

    $('input, textarea').placeholder();
  });

  // UNCOMMENT THE LINE YOU WANT BELOW IF YOU WANT IE8 SUPPORT AND ARE USING .block-grids
  // $('.block-grid.two-up>li:nth-child(2n+1)').css({clear: 'both'});
  // $('.block-grid.three-up>li:nth-child(3n+1)').css({clear: 'both'});
  // $('.block-grid.four-up>li:nth-child(4n+1)').css({clear: 'both'});
  // $('.block-grid.five-up>li:nth-child(5n+1)').css({clear: 'both'});

  // Hide address bar on mobile devices (except if #hash present, so we don't mess up deep linking).
  if (Modernizr.touch && !window.location.hash) {
    $(window).load(function () {
      setTimeout(function () {
        window.scrollTo(0, 1);
      }, 0);
    });
  }

})(jQuery, this);

$(document).ready(function() {
  $("#install_app").click(function() {
    var request = window.navigator.mozApps.install('http://status.hackerspace.gr/manifest.webapp');
    request.onsuccess = function () {
      // Save the App object that is returned
      var appRecord = this.result;
    };
    request.onerror = function () {
      // Display the error information from the DOMError object
      alert('Install failed, error: ' + this.error.name);
    };
  });
});

//get hackers counter
function get_counter() {
  $.ajax({
    url: 'http://hackerspace.gr/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=Network/Leases',
    dataType: 'jsonp',
    crossDomain: true,
    cache: false
  }).done(function(json) {
    var count = json.query.pages[168].revisions[0]["*"];
    var splitted = count.split(" ");
    var random_no = Math.floor((Math.random()*10)+2);
    var skadalia = [
      'thieves',
      'ghosts',
      'rats',
      'mosquitos',
      'resistors',
      'capacitors',
      'supermodels',
      'astronauts',
      'aliens',
      'M$ users',
      'books',
      'Justin Bieber fans',
      'unicorns',
      'nyan cats'
    ];
    var random_text = Math.floor(Math.random()*skadalia.length);
    if ( isNaN(splitted[0]) ) {
      $('.counter.panel').attr("id","close");
      $('#openornot').html('0 hackers and ' + random_no + ' ' + skadalia[random_text] + ' in space, means that space is now closed!');
    } else if (splitted[0] == "0") {
      $('#counter').html(splitted[0]);
      $('.counter.panel').attr("id","close");
      $('#openornot').html('hackers and ' + random_no + ' ' + skadalia[random_text] + ' in space, means that space is now closed!');
    } else {
      $('#counter').html(splitted[0]);
      $('.counter.panel').attr("id","open");
      $('#openornot').html('hackers and ' + random_no + ' ' + skadalia[random_text] + ' in space, means that space is now open!');
    }
  });
};

function get_activity() {
  $.ajax({
    type: 'GET',
    url: 'http://done.hackerspace.gr/api/v1/feed?limit=5',
    dataType: 'jsonp',
    jsonpCallback: 'func',
    success: function(data) {
      $('#activities').empty();
      $.each(data, function(i,v) {
        $('#activities').append('<li class="event"><div class="row"><div class="twelve columns">' + v.content +
          '</div><div class="twelve columns event_date"><span class="event_hour">' + v.author + ' @ ' +
          $.timeago(v.timestamp) + '</span></div></div></li>');
      });
    }
  });
};

function get_news() {
  $('#news_wrapper').FeedEk({
    FeedUrl : 'http://hackerspace.gr/wiki/index.php?title=News&action=feed&feed=rss',
    MaxCount : 5,
    ShowDesc : false,
    ShowPubDate:true,
    TitleLinkTarget:'_blank'
  });
};

//Display All future events in ical file as list.
function displayEvents(events,events_current,limit) {
  //Foreach event
  for ( var i=0; i<Math.min(limit,events.length); i++) {
    //Create a list item
    var li = document.createElement('li');
    li.setAttribute('class', 'event');
    //Add details from cal file.
    li.innerHTML = '<div class="row"><div class="seven columns"><a class="description" target="_blank" href="'+ events[i].DESCRIPTION + '">' +
    events[i].SUMMARY + '</a></div><div class="five columns event_date">' + events[i].day + ' ' + events[i].start_day + '/' +
    events[i].start_month + ' <span class="event_hour">' +events[i].start_time + ' - ' + events[i].end_time + '</span></div></div>';
    //Add list item to list.
    document.getElementById('calendar').appendChild(li);
  }
  for ( var j=0; j<Math.min(limit,events.length); j++) {
    //Create a list item
    var li = document.createElement('li');
    li.setAttribute('class', 'event');
    //Add details from cal file.
    li.innerHTML = '<div class="row"><div class="seven columns"><div class="now_tag">now</div><a class="description" target="_blank" href="'+ events_current[j].DESCRIPTION + '">' +
    events_current[j].SUMMARY + '</a></div><div class="five columns event_date">' + events_current[j].day + ' ' + events_current[j].start_day + '/' +
    events_current[j].start_month + ' <span class="event_hour">' +events_current[j].start_time + ' - ' + events_current[j].end_time + '</span></div></div>';
    document.getElementById('calendar_current').appendChild(li);
  }
}

var a, b;

function get_events() {
  var ical_url = 'http://hackerspace.gr/archive/hsgr.ics';
  //Create new ical parser
  new ical_parser(ical_url, function(cal) {
    //When ical parser has loaded file
    //get future events
    a = cal.getFutureEvents();
    b = cal.getCurrentEvents();
    //And display them
    displayEvents(a,b,6);
  });
}

function insert_random() {

}

$(document).ready(function() {
  $('#loading').toggle();
  get_counter();
  get_events();
  get_activity();
  get_news();
  var refreshId = setInterval(function() {
    get_counter();
  }, 100000);
  insert_random();
});
