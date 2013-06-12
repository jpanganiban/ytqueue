var apiKey = 'AIzaSyBhqRNBsDHXYahBdwhGIKHz_QM_wTI2jyY';
var service = 'youtube';
var apiVersion = 'v3';


// Disable search. Wait for the gapi client
// to be loaded.
$('#search').hide();
$('#loading').show();


/**
 * resourcePath
 *
 * Generates a resource path for the api
 * request
 */
function resourcePath(resource) {
  return service + "/" + apiVersion + "/" + resource;
};


/**
 * gapiLoadCallback
 *
 * callback function iniated by the onload
 * parameter set when importing the google api
 * client
 */
function gapiLoadCallback() {
  gapi.client.setApiKey(apiKey);

  $('#loading').hide();
  $('#search').fadeIn();
};


/**
 * youtubeSearch
 *
 * Utility function for doing a youtube search
 */
function youtubeSearch(searchString, callback) {
  gapi.client.request({
    path: resourcePath('search'),
    params: {'part': 'id,snippet', 'q': searchString, 'maxResults': 50},
    callback: callback
  });
};


/**
 * constructVideoUrl
 *
 * Constructs a youtubeUrl based on a videoId
 */
function constructVideoUrl(videoId) {
  return "http://www.youtube.com/watch?v=" + videoId + "&vq=small";
}


/**
 * submitQueue 
 *
 * Submits a request to include the selected video into the
 * current play queue
 */
function submitQueue(videoId, successCallback, errorCallback) {
  $.ajax({
    method: "POST",
    url: "/playlist",
    data: {"link": constructVideoUrl(videoId)},
    success: successCallback,
    error: errorCallback
  });
};


/**
 * locateTemplate
 *
 * Utility function for locating a template
 */
function locateTemplate(id) {
  var $template = $("script[type='text/html']#" + id);

  if (!$template.length) {
    return undefined;
  }

  return _.template($template.html());
}


$('#search').submit(function(e) {
  var $el = $(this);
  var $searchField = $el.find('.search-string');
  var searchString = $searchField.val();

  if (searchString === "") {
    return false;
  }

  // Empty previous result
  $results = $('#results');
  $results.html('');
  $results.show();

  // Initiate serach
  youtubeSearch(searchString, function(resp) {
    $.each(resp.items, function(key, item) {
      $results.append(locateTemplate('result')(item));
    });

    // Bind click event here since .result elements doesn't
    // exist yet.
    $('.result').click('click', function(e) {
      e.stopPropagation();
      var $el = $(e.target);

      submitQueue($el.data('videoId'), function() {
        $results.fadeOut(function() {
          $results.html('Added to the queue!');
          $results.fadeIn(function() {
            $results.fadeOut();
          });
        });
      });
    });

    $searchField.val('');
  });

  return false;
});
