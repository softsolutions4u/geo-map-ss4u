/**
 * 
 * @name Geo Map SS4U
 * @version 1.1 [Aug 24, 2015]
 */
//Initilizing global variables.
(function($) {
    var map, center,
        zoom = 11,
        currentPlaces = [],
        nearbyPlaces = [];
    var $autoCompleteId = document.getElementById('autocomplete');
    var $nearByList = $('<ul></ul>');
    $nearByList.attr('id', 'gs-nearby-list');
    $nearByList.addClass('gs-full-width');
    $(window).load(function() {
        $('#radius-level').chosen();
        initializeMap(null);
        var lastScrollTop = 0;
		// Show scroll text only in mobile and tablet view.
        if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            $('.scroll').remove();
        }
    });
    /**
     * Initilizing the map on every search.
     * 
     * @param  location
     * @returns none
     */
    function initializeMap(location) {
        $nearByList.html('');
        nearbyPlaces = [];
        var marker = [],
            defaultBoundary = new google.maps.LatLngBounds(
								new google.maps.LatLng( parseFloat(objValues.south_bound), parseFloat(objValues.west_bound) ),
								new google.maps.LatLng( parseFloat(objValues.north_bound), parseFloat(objValues.east_bound) )
							  ); // Get boundary object.
        if (location === null) {
            center = defaultBoundary.getCenter();
        } else {
            center = location;
            defaultBoundary = new google.maps.LatLngBounds(center);
            zoom = Math.round(14 - Math.log(parseInt(document.getElementById('radius-level').value)) / Math.LN2);
        }
        //  Generating the map.
        map = new google.maps.Map(document.getElementById('map-canvas'), {
            center: center,
            zoom: zoom,
            scrollwheel: false,
            scaleControl: false,
            draggable: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        // Fixing the initital title.
        var geoCoder = new google.maps.Geocoder();
        geoCoder.geocode({
            latLng: center
        }, function(geoResult, geoStatus) {
            if (geoStatus === google.maps.GeocoderStatus.OK) {
                var title = $autoCompleteId.value ? $autoCompleteId.value : geoResult[4].formatted_address;
                var markerIcon = new google.maps.Marker({
                    map: map,
                    title: title, // Title of the location.
                    position: center,
                    icon: objValues.default_marker_url
                });
				// Creating radius circle.
                if (location !== null) {
                    new google.maps.Circle({
                        strokeColor: '#28A2D9',
                        strokeWeight: 1,
                        fillColor: '#28A2D9',
                        map: map,
                        center: center,
                        radius: (parseInt(document.getElementById('radius-level').value) * 1000) + 500
                    });
                }
                createMarkerIcon(markerIcon, title);
                marker.push(markerIcon);
            }
        });
        // Disable and Enable map scroll wheel.
        google.maps.event.addListener(map, 'click', function() {
            (this.get('scrollwheel')) ? this.setOptions({
                scrollwheel: false,
                scaleControl: false,
                draggable: false
            }): this.setOptions({
                scrollwheel: true,
                scaleControl: true,
                draggable: true
            });
        });
		// Default google functions for text search.
        var placeServices = new google.maps.places.PlacesService(map),
            autoCompleteDropDown = new google.maps.places.Autocomplete($autoCompleteId),
            searchBox = new google.maps.places.SearchBox($autoCompleteId);
        google.maps.event.addListenerOnce(searchBox, 'places_changed', function() {
            currentPlaces = searchBox.getPlaces();
            findNearByPlaces();
        });
        var listner = google.maps.event.addListener(map, 'bounds_changed', function() {
            var boundary = map.getBounds();
			// If the zoom level is maximum of 19, then set zoom level as 19.
            if (map.getZoom() > 19) {
                map.setZoom(19); 
                google.maps.event.removeListener(listner);
            }
            searchBox.setBounds(boundary);
        });
    }
    /**
     * Finding near by places
     * 
     * @returns none
     */
    function findNearByPlaces() {
        var places = currentPlaces;
        if (places.length > 0) {
            if (!places[0].geometry) {
                return;
            }
            // If the searched place has a geometry[boundary], then fix the map boundary
            if (places[0].geometry.viewport) {
                map.fitBounds(places[0].geometry.viewport);
            } else {
                map.setCenter(places[0].geometry.location);
                map.setZoom(17);
            }
            var radiusDetails = {
                location: places[0].geometry.location,
                radius: parseInt(document.getElementById('radius-level').value) * 1000, // User data - Selected radius
                types: [$('input[name=place_type]:checked', '#searchPlacesFrm').val()] // User data - Selected types
            };
            var placeService = new google.maps.places.PlacesService(map);
            placeService.nearbySearch(radiusDetails, parseNearBy);
            initializeMap(places[0].geometry.location);
        }
    }
    /**
     * Create marker
     * 
     * @param object places
     * @param boolean boundary
     * @returns none
     */
    function createMarker(places, boundary) {
        var markerIcon,
            marker = [];
        for (var i = 0, markerIcon; markerIcon = marker[i]; i++) {
            markerIcon.setMap(null);
        }
        markerIcon = new google.maps.Marker({
            map: map,
            title: places.name, // Title of the location.
            position: places.geometry.location,
            icon: objValues[$('input[name=place_type]:checked', '#searchPlacesFrm').val()]
        });
        var geoCoder = new google.maps.Geocoder();
        geoCoder.geocode({
            'location': places.geometry.location
        }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK && results[1]) {
                createMarkerIcon(markerIcon, places.name);
            } else {
                createMarkerIcon(markerIcon, places.name);
            }
        });
        marker.push(markerIcon);
        if (boundary !== null) {
            boundary.extend(places.geometry.location);
        }
    }
    /**
     * Parse Nearby places
     * 
     * @param object results
     * @param boolean status
     * @returns none
     */
    function parseNearBy(results, status, pagination) {
        $("#gs-nearby-results").fadeOut();
        $("#gs-nearby-results-cont").html('');
		// Parse the values if results found.
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            searchLocation = currentPlaces[0].geometry.location;
            for (var i = 0; i < results.length; i++) {
                currentResultLocation = results[i].geometry.location;
                kilometer = distance(searchLocation.G, searchLocation.K, currentResultLocation.G, currentResultLocation.K);
				// Extract the location if it is outside of the given radius.
                if (nearbyPlaces.indexOf(results[i].place_id) < 0 && parseInt(document.getElementById('radius-level').value) + 0.5 >= kilometer) {
                    var $currentList = $('<li></li>');
                    nearbyPlaces.push(results[i].place_id);
                    $currentList.addClass('address_list');
                    $currentList.addClass($('input[name=place_type]:checked', '#searchPlacesFrm').val());
                    $currentList.append('<p>' + results[i].name + '</p>');
                    $nearByList.append($currentList);
                    createMarker(results[i], null);
                }
            }
            $("#gs-nearby-results-cont").append($nearByList); // Append the results as li.
            $("#title").html('Result' + ($("#gs-nearby-list").find('li').length > 1 ? 's' : '') + ' found: ' + '' + $("#gs-nearby-list").find('li').length + ' ' + $('input[name=place_type]:checked', '#searchPlacesFrm').data('place-label') + ($("#gs-nearby-list").find('li').length > 1 ? 's' : '') + ' around the radius of ' + parseInt(document.getElementById('radius-level').value) + ' Km' + (document.getElementById('radius-level').value > 1 ? 's' : ''));
            $("#gs-nearby-results-cont").append('<a id="more" href="javascript:void(0);">Get more</a>');
            var $moreButton = document.getElementById('more');
			// Set pagination when maximum of results found.
            if (pagination.hasNextPage) {
                $('#more').show();
                $moreButton.disabled = false;
                google.maps.event.addDomListenerOnce($moreButton, 'click', function() {
                    $moreButton.disabled = true;
                    pagination.nextPage();
                });
                if ($("#gs-nearby-list").find('li').length < 20) {
                    $moreButton.click();
                }
            } else {
                $('#more').hide();
            }
            $("#gs-nearby-results").fadeIn();
            if ($nearByList.outerHeight() <= parseInt($("#gs-nearby-results-cont").css('max-height')) - 50) {
                $('#gs-scroll-down').fadeOut();
            } else {
                $('#gs-scroll-down').fadeIn();
            }
        } else {
            $("#title").text("No result found!...");
            $("#gs-nearby-results").fadeIn();
        }
    }
    /**
     * Creating the marker icon
     * 
     * @param object markerIcon
     * @param string markerTitle
     * @returns none
     */
    function createMarkerIcon(markerIcon, markerTitle) {
		// Initialize information window.
        var infoWindow = new google.maps.InfoWindow({
            content: markerTitle,
            maxWidth: 150
        });
		// Set actions when click the marker.
        google.maps.event.addListener(markerIcon, 'click', function() {
            map.setZoom(19);
            infoWindow.open(map, markerIcon);
            map.panTo(markerIcon.getPosition());
        });
		// Set actions when close the information window.
        google.maps.event.addListener(infoWindow, "closeclick", function() {
            map.panTo(center);
            map.setZoom(zoom);
        });
    }
    /**
     * Validating the distance
     * @param {float} lat1
     * @param {float} lon1
     * @param {float} lat2
     * @param {float} lon2
     * @returns {int}
     */
    function distance(lat1, lon1, lat2, lon2) {
        var earthRadius = 6371, // Radius of the earth in km.
            dLat = (lat2 - lat1) * (Math.PI / 180),
            dLon = (lon2 - lon1) * (Math.PI / 180),
            area = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((lat1) * (Math.PI / 180)) * Math.cos((lat2) * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2),
            preDistance = 2 * Math.atan2(Math.sqrt(area), Math.sqrt(1 - area)),
            distance = earthRadius * preDistance; // Distance in km.
        return distance;
    }
    document.getElementById('autocomplete').onchange = (function() {
        $(this).removeClass('alert');
    });
    document.getElementById('searchbutton').onclick = (function() {
        $('#autocomplete').removeClass('alert');
        var searchTerm = $.trim($autoCompleteId.value);
		// Search box empty validation.
        if (searchTerm === '') {
            $('#autocomplete').addClass('alert');
            $("html, body").animate({
                scrollTop: $('#autocomplete').offset().top - 50
            }, 500);
            return;
        }
        google.maps.event.trigger($autoCompleteId, 'focus');
        google.maps.event.trigger($autoCompleteId, 'keydown', {
            keyCode: 13
        });
        if (currentPlaces.length < 1) {
            var geoCoder = new google.maps.Geocoder();
            geoCoder.geocode({
                "address": '"' + searchTerm + '"'
            }, function(results, geoResult) {
                if (geoResult == 'OK') {
                    currentPlaces = results;
                    findNearByPlaces();
                }
            });
        }
    });
}(jQuery));