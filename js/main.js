mapboxgl.accessToken = 'pk.eyJ1Ijoia2V2aW5mYW4yMyIsImEiOiJjaXV0Ymo5eDIwMHhhMnhsZ3YxNHBjeWZuIn0.6VFBg8iqnjPGwUniL8wgWg';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/kevinfan23/cj6duchkb0zb52sqjq0z9c0ka',
    center: [-73.980939, 40.735686],
    zoom: 12.3,
    attributionControl: false,
    pitch: 45,
    //interactive: false
});

// disable map zoom when using scroll
map.scrollZoom.disable();

// Create a GeoJSON source with an empty lineString.
// var geojson = {
//     "type": "FeatureCollection",
//     "features": [{
//         "type": "Feature",
//         "geometry": {
//             "type": "LineString",
//             "coordinates": [
//                 [0, 0]
//             ]
//         }
//     }]
// };

// var speedFactor = 30; // number of frames per longitude degree
// var animation; // to store and cancel the animation
// var startTime = 0;
// var progress = 0; // progress = timestamp - startTime
// var resetTime = false; // indicator of whether time reset is needed for the animation
//
// map.on('load', function() {
//
//     // add the line which will be modified in the animation
//     map.addLayer({
//         'id': 'line-animation',
//         'type': 'line',
//         'source': {
//             'type': 'geojson',
//             'data': geojson
//         },
//         'layout': {
//             'line-cap': 'round',
//             'line-join': 'round'
//         },
//         'paint': {
//             'line-color': '#ed6498',
//             'line-width': 5,
//             'line-opacity': .8
//         }
//     });
//
//     startTime = performance.now();
//
//     animateLine();
//
//     // reset startTime and progress once the tab loses or gains focus
//     // requestAnimationFrame also pauses on hidden tabs by default
//     document.addEventListener('visibilitychange', function() {
//         resetTime = true;
//     });
//
//     // animated in a circle as a sine wave along the map.
//     function animateLine(timestamp) {
//         if (resetTime) {
//             // resume previous progress
//             startTime = performance.now() - progress;
//             resetTime = false;
//         } else {
//             progress = timestamp - startTime;
//         }
//
//         // restart if it finishes a loop
//         if (progress > speedFactor * 360) {
//             startTime = timestamp;
//             geojson.features[0].geometry.coordinates = [];
//         } else {
//             var x = progress / speedFactor;
//             // draw a sine wave with some math.
//             var y = Math.sin(x * Math.PI / 90) * 40;
//             // append new coordinates to the lineString
//             geojson.features[0].geometry.coordinates.push([x, y]);
//             // then update the map
//             map.getSource('line-animation').setData(geojson);
//         }
//         // Request the next frame of the animation.
//         animation = requestAnimationFrame(animateLine);
//     }
// });
