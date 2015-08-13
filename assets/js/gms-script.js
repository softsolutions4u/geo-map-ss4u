//Initilizing global variables
var mm;
var z  = 11;
var ai = document.getElementById('autocomplete');
var cp = [];
var np = [];
var nl = jQuery('<ul></ul>');
nl.attr('id', 'gs-nearby-list');
nl.addClass('gs-full-width');
if (typeof jQuery == 'undefined') {
    document.write('<script type="text/javascript" src="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.1.min.js"></' + 'script>');
}

jQuery(window).load(function () {
    jQuery('#radius-level').chosen();
    i(null);
});

/**
 * 
 * @param {type} location
 * @returns {undefined}
 */
function i(l) {
    nl.html('');
    np = [];
    var m = [];
    var ac;
    var db = new google.maps.LatLngBounds(
            new google.maps.LatLng(parseFloat(objValues.south_bound), parseFloat(objValues.west_bound)),
            new google.maps.LatLng(parseFloat(objValues.north_bound), parseFloat(objValues.east_bound))
            );
    if (l === null) {
        /*Set Bounds Code Starts Here*/
        ac = db.getCenter();
    } else {
        ac = l;
        db = new google.maps.LatLngBounds(ac);
        z = Math.round(14-Math.log(parseInt(document.getElementById('radius-level').value))/Math.LN2);
    }
    //  Generating the map
    mm = new google.maps.Map(document.getElementById('map-canvas'), {
        center: ac,
        zoom : z
    });
    //fixing the initital title
    var gc = new google.maps.Geocoder();
    gc.geocode({latLng: ac}, function (gd, gs) {
        if (gs == google.maps.GeocoderStatus.OK) {
            var mi = new google.maps.Marker({
                map: mm,
                title: gd[0].address_components[2].long_name, //this is the full address
                position: ac,
                icon: objValues.default_marker_url
            });
            mc(mi, gd[0].formatted_address);
            m.push(mi);
        }
    });
    /*Set Bounds Code Ends Here*/

    var ps = new google.maps.places.PlacesService(mm),
            ad = new google.maps.places.Autocomplete(ai),
            sb = new google.maps.places.SearchBox(ai);

    google.maps.event.addListenerOnce(sb, 'places_changed', function () {
        cp = sb.getPlaces();
        fnb();
    });

    lr = google.maps.event.addListener(mm, 'bounds_changed', function () {
        var b = mm.getBounds();
        if (mm.getZoom() > 19) {
            mm.setZoom(19);
            google.maps.event.removeListener(lr);
        }
        sb.setBounds(b);
    });
}
function fnb() {
    var pl = cp;
    if (pl.length > 0) {
        if (!pl[0].geometry) {
            return;
        }
        // If the place has a geometry, then present it on a map.
        if (pl[0].geometry.viewport) {
            mm.fitBounds(pl[0].geometry.viewport);
        } else {
            mm.setCenter(pl[0].geometry.location);
            mm.setZoom(17);
        }

        var b = new google.maps.LatLngBounds();
        var r = {
            location: pl[0].geometry.location,
            radius: parseInt(document.getElementById('radius-level').value) * 1000,
            types: ['train_station']
        };

        var s = new google.maps.places.PlacesService(mm);
        s.nearbySearch(r, cb);
//        mp(pl[0], b);
        i(pl[0].geometry.location);
    }
}
/**
 * Create marker
 * 
 * @param {type} places
 * @param {type} bounds
 * @returns {undefined}
 */
function mp(pl, b) {
    var m = [];
    for (var i = 0, mi; mi = m[i]; i++) {
        mi.setMap(null);
    }
    var mi = new google.maps.Marker({
        map: mm,
        title: pl.name, //this is the full address
        position: pl.geometry.location,
        icon: objValues.place_marker_url
    });
    var gc = new google.maps.Geocoder();
    gc.geocode({'location': pl.geometry.location}, function(r, s) {
        if (s == google.maps.GeocoderStatus.OK && r[1]) {
            mc(mi, r[1].formatted_address);
        } else {
            mc(mi, pl.name);
        }
    });
    m.push(mi);
    if (b !== null) {
        b.extend(pl.geometry.location);
    }
}
/**
 * Call back function
 * 
 * @param {type} results
 * @param {type} status
 * @returns {undefined}
 */
function cb(cr, cs, cp) {
    jQuery("#gs-nearby-results").fadeOut();
    jQuery("#gs-nearby-results").html('');
    if (cs === google.maps.places.PlacesServiceStatus.OK) {

        jQuery("#gs-nearby-results").append("<h3>Nearby Search</h3>");
        for (var i = 0; i < cr.length; i++) {
            if (np.indexOf(cr[i].name) < 0) {
                var l = jQuery('<li></li>');
                np.push(cr[i].name);
                l.attr('class', 'address_list');
                l.append('<p>' + cr[i].name + '</p>');
                nl.append(l);
                mp(cr[i], null);
            }
        }
        jQuery("#gs-nearby-results").append(nl);
        jQuery("#gs-nearby-results").append('<a id="more" href="javascript:void(0);">More</a>');
        jQuery("#gs-nearby-results").fadeIn();
        var mb = document.getElementById('more');
        if (cp.hasNextPage) {
            jQuery('#more').show();
            mb.disabled = false;

            google.maps.event.addDomListenerOnce(mb, 'click',
                    function () {
                        mb.disabled = true;
                        cp.nextPage();
                    });
        } else {
            jQuery('#more').hide();
        }
    } else {
        jQuery("#gs-nearby-results").append("<h3>No result found</h3>");
        jQuery("#gs-nearby-results").fadeIn();
    }
}
/**
 * 
 * @returns {undefined}
 */
document.getElementById('searchbutton').onclick = function () {
    google.maps.event.trigger(ai, 'focus');
    google.maps.event.trigger(ai, 'keydown', {keyCode: 13});
    if (cp.length < 1) {
        var gc = new google.maps.Geocoder();
        gc.geocode({"address": '"' + ai.value + '"'}, function (results, gs) {
            if (gs == 'OK') {
                cp = results;
                fnb();
            }
        });
    }
}

function mc(mi, t) {
    var iw = new google.maps.InfoWindow({
        content: t,
        maxWidth: 150
    });
    google.maps.event.addListener(mi, 'click', function () {
        mm.setZoom(19);
        iw.open(mm, mi);
        mm.setCenter(mi.getPosition());
    });
    google.maps.event.addListener(iw, "closeclick", function ()
    {
        mm.panTo(mi.getPosition());
        mm.setZoom(z);
    });
}