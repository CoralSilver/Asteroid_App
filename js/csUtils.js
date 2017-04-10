var csApi = function () {

  var api = {},
    baseUrl = 'https://api.nasa.gov',
    path = '/neo/rest/v1/feed',
    today = new Date(),
    startDate = today.toISOString().slice(0, 10),
    key = 'aTnI7tvcnANazW7uwVSdLYR6U8IQhYWzTqsyJzgl';

  api.getData = function (callback) {
    requestUrl = baseUrl + path + '?start_date=' + startDate + '&api_key=' + key;
    request = new XMLHttpRequest();
    request.open('get', requestUrl, true);
    request.onload = function (e) {
      var response = request.response;
      response = JSON.parse(response);
      if (callback)
        callback(response);
    };
    request.onerror = function (e) {
      console.log(request.response, e);
    };
    request.send();
  }

  return api;

}();
