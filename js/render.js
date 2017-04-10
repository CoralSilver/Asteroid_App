var renderRecords = function() {
  //locally scoped variable because of IIFE
  var deadlyAsteroids = 0;

  renderFilteredRecords = function(result) {
    result = result.near_earth_objects;
    var outputLoc = document.getElementById('asteroids');
    //create outer accordion element
    var docFrag = document.createDocumentFragment();
    var container = document.createElement('div');
    container.className = 'accordion-container';
    container.setAttribute('role', 'tablist');
    // count for unique aria ids to accordion items
    var idCount = 1;
    // Convert dataObject to an array in order to reverse with today's date first instead of last (imperfect)
    var dataArray = Object.keys(result).map(function(k) { return result[k]; });
    dataArray.reverse();
    for(var i = 0; len = dataArray.length, i < len; i++)  {
      // must iterate through arrays contained in returned array
      dataArray[i].forEach(function(currentValue, i, array) {
        var name = array[i].name;
        var rawDistance = +(+array[i].close_approach_data[0].miss_distance.miles).toFixed();
        var rawSpeed = +(+array[i].close_approach_data[0].relative_velocity.miles_per_hour).toFixed();
        var safe = '<span class="safe">Safe for now</span>';
        var deadly = '<span class="alert">Fingers crossed</span>';
        var status = (array[i].is_potentially_hazardous_asteroid) ? deadly : safe;
        if (array[i].is_potentially_hazardous_asteroid) {
          deadlyAsteroids++;
        }
        // add accessibility attributes
        var id = '"ui-id-' + idCount + '"';
        var contentId = '"ui-id-' + (++idCount) + '"';
        var accessiblityAttr = 'role="tab" id=' + id + 'aria-controls=' + contentId + 'aria-selected="false" aria-expanded="false" tabindex="0"'
        var divElem = '<h3 class="accordion"' + accessiblityAttr + '>' + name + status + '</h3>';
        var approachDate = '<li>Approach date: ' + array[i].close_approach_data[0].close_approach_date + '</li>';
        var link = '<li><a href="' + array[i].nasa_jpl_url + '" target="_blank">' + 'More info' + '</a></li>';
        var distance = '<li>Estimated miss distance in miles: ' + rawDistance.toLocaleString('en') + '</li>';
        var speed = '<li>Relative velocity in miles per hour: ' + rawSpeed.toLocaleString('en') + '</li>';
        var size = '<li>Estimated diameter in feet: ' + array[i].estimated_diameter.feet.estimated_diameter_min.toFixed() + '(min), ' + array[i].estimated_diameter.feet.estimated_diameter_max.toFixed() + '(max)</li>';
        var ULAccessiblity = 'id="ui-id-' + idCount + '" aria-labelledby="ui-id-' + (idCount - 1) + '" role="tabpanel" aria-hidden="true"'
        var unorderedList = '<ul hidden class="column-two"' + ULAccessiblity + '>' + approachDate + distance + speed + size + link + '</ul>';
        idCount++;
        container.innerHTML += divElem;
        container.innerHTML += unorderedList;
        // append formatted html to document fragment
        docFrag.appendChild(container);
      });
      //append final, complete HTML to the DOM
      outputLoc.appendChild(docFrag);
    }
  }

  toggle = function(e) {
    // remove hidden attribute on sibling ul and set aria props to true
    if (e.target && e.target.matches(".accordion")) {
      var allRecordNames = document.getElementsByClassName('accordion');
      var moreInfo = e.target.nextElementSibling;
      moreInfo.removeAttribute('hidden');
      moreInfo.setAttribute('aria-hidden', false);
      moreInfo.previousElementSibling.className = 'accordion open';
      moreInfo.previousElementSibling.setAttribute('aria-expanded', true);
      moreInfo.previousElementSibling.setAttribute('aria-selected', true);
      // iteratate through all other uls to check for any open and add hidden/aria false attributes
      for (var i = 0; i < allRecordNames.length; i++) {
        if (allRecordNames[i] !== e.target && allRecordNames[i].classList.contains('open')) {
          var toHideElem = allRecordNames[i].nextElementSibling;
          toHideElem.setAttribute('hidden', '');
          toHideElem.setAttribute('aria-hidden', true);
          toHideElem.previousElementSibling.className = 'accordion'
          toHideElem.previousElementSibling.setAttribute('aria-expanded', false);
          toHideElem.previousElementSibling.setAttribute('aria-selected', false);
          // return because only one ul can be shown at a time
          return false;
        }
      }
    }
  }

  toggleRecordVisibility = function(elem) {
    // add keyboard support
    elem.addEventListener('keypress', function(e) {
      if (e.which === 32 || e.which === 13) {
        toggle(e);
      }
    });
    elem.addEventListener('click', function(e) {
      toggle(e);
    });
  }

  filterDangerous = function(button, message) {
    button.addEventListener('click', function() {
      var safe = document.getElementsByClassName('safe');
      if (button.textContent === 'Show only potentially hazardous') {
        if (deadlyAsteroids === 0) {
          message.textContent = 'There are no asteroids that might kill us all this week.';
        } else {
          for (var i = 0; len = safe.length, i < len; i++) {
            safe[i].parentNode.setAttribute('hidden', '');
          }
          button.textContent = 'Show all';
          message.textContent = '';
        }
      } else {
        for (var i = 0; len = safe.length, i < len; i++) {
          safe[i].parentNode.removeAttribute('hidden', '');
        }
        button.innerText = 'Show only potentially hazardous';
      }
    });
  }

  return {
    renderFilteredRecords: renderFilteredRecords,
    toggleRecordVisibility: toggleRecordVisibility,
    filterDangerous: filterDangerous
  }

}();
