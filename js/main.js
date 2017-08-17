// declare global variables
const blue = '#3F99FF';
mapboxgl.accessToken = 'pk.eyJ1Ijoia2V2aW5mYW4yMyIsImEiOiJjaXV0Ymo5eDIwMHhhMnhsZ3YxNHBjeWZuIn0.6VFBg8iqnjPGwUniL8wgWg';
var map_loaded = false;
var map;

map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/kevinfan23/cj6duchkb0zb52sqjq0z9c0ka',
    center: [-73.980939, 40.735686],
    zoom: 11.75,
    attributionControl: false,
    pitch: 38,
    //interactive: false
});

  map.on('load', function() {
    console.log("loaded");
    animate_revealer();
    //parse_json();
  });

  // map.on('mousemove', function (e) {
  //       // e.point is the x, y coordinates of the mousemove event relative
  //       // to the top-left corner of the map
  //       //JSON.stringify(e.point) + '<br />' +
  //       // e.lngLat is the longitude, latitude geographical position of the event
  //       console.log(e.lngLat);
  // });

  window.human = false;

  var canvasEl = document.querySelector('.fireworks');
  var ctx = canvasEl.getContext('2d');
  var numberOfParticules = 30;
  var pointerX = 0;
  var pointerY = 0;
  var tap = ('ontouchstart' in window || navigator.msMaxTouchPoints) ? 'touchstart' : 'mousedown';
  var colors = ['#FF1461', '#18FF92', '#5A87FF', '#FBF38C'];

  function setCanvasSize() {
    canvasEl.width = window.innerWidth * 2;
    canvasEl.height = window.innerHeight * 2;
    canvasEl.style.width = window.innerWidth + 'px';
    canvasEl.style.height = window.innerHeight + 'px';
    canvasEl.getContext('2d').scale(2, 2);
  }

  function updateCoords(e) {
    pointerX = e.clientX || e.touches[0].clientX;
    pointerY = e.clientY || e.touches[0].clientY;
  }

  function setParticuleDirection(p) {
    var angle = anime.random(0, 360) * Math.PI / 180;
    var value = anime.random(50, 180);
    var radius = [-1, 1][anime.random(0, 1)] * value;
    return {
      x: p.x + radius * Math.cos(angle),
      y: p.y + radius * Math.sin(angle)
    }
  }

  function createParticule(x,y) {
    var p = {};
    p.x = x;
    p.y = y;
    p.color = colors[anime.random(0, colors.length - 1)];
    p.radius = anime.random(16, 32);
    p.endPos = setParticuleDirection(p);
    p.draw = function() {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
      ctx.fillStyle = p.color;
      ctx.fill();
    }
    return p;
  }

  function createCircle(x,y) {
    var p = {};
    p.x = x;
    p.y = y;
    p.color = '#FFF';
    p.radius = 0.1;
    p.alpha = .5;
    p.lineWidth = 6;
    p.draw = function() {
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
      ctx.lineWidth = p.lineWidth;
      ctx.strokeStyle = p.color;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    return p;
  }

  function renderParticule(anim) {
    for (var i = 0; i < anim.animatables.length; i++) {
      anim.animatables[i].target.draw();
    }
  }

  function animateParticules(x, y) {
    var circle = createCircle(x, y);
    var particules = [];
    for (var i = 0; i < numberOfParticules; i++) {
      particules.push(createParticule(x, y));
    }
    anime.timeline().add({
      targets: circle,
      radius: anime.random(80, 160),
      lineWidth: 0,
      alpha: {
        value: 0,
        easing: 'linear',
        duration: anime.random(600, 800),
      },
      duration: anime.random(1200, 1800),
      easing: 'easeOutExpo',
      update: renderParticule,
      offset: 0
    });
  }

  var render = anime({
    duration: Infinity,
    update: function() {
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    }
  });

  document.addEventListener(tap, function(e) {
    window.human = true;
    render.play();
    updateCoords(e);
    animateParticules(pointerX, pointerY);
  }, false);

  var centerX = window.innerWidth / 2;
  var centerY = window.innerHeight / 2;

  setCanvasSize();
  window.addEventListener('resize', setCanvasSize, false);
//
// function setup() {
//   createCanvas(displayWidth,displayHeight);
//   // disable map zoom when using scroll
//   map.scrollZoom.disable();
//
//   map.on('load', function() {
//     console.log("loaded");
//     animate_revealer();
//     //parse_json();
//     map_loaded = true;
//   });
// }

// animate logo reveal animations
function animate_revealer() {
		var rev_logo = new RevealFx(document.querySelector('#rev-logo'), {
			revealSettings : {
				bgcolor: blue,
				direction: 'lr',
				delay: 1000,
				duration: 250,
				easing: 'easeInOutQuint',
				onCover: function(contentEl, revealerEl) {
					contentEl.style.opacity = 1;
				}
			}
		});

	rev_logo.reveal();
}

// function parse_json() {
  // // JQuery get json from url
  // // http://api.jquery.com/jquery.parsejson/
  // // GeoJSON source: https://dev.socrata.com/foundry/data.cityofnewyork.us/i4gi-tjb9
  // // https://data.cityofnewyork.us/resource/i4gi-tjb9.json
  // $.getJSON( "https://data.cityofnewyork.us/resource/i4gi-tjb9.json", function(data) {
  //   //$.each(data, function(key, val) {
  //   val = data[0];
  //
  //     // Get the coordinates of the traffic lines
  //     var coordinatesLine = [];
  //     var coordinatesString = val['link_points'].split(" ");
  //
  //     for (var i = 0; i < coordinatesString.length; i++) {
  //         var coord = coordinatesString[i].split(',');
  //         coordinatesLine.push(coord.map(Number).reverse());
  //     }
  //     console.log(coordinatesLine);
  //
  //       map.addLayer({
  //               "id": "route",
  //               "type": "line",
  //               "source": {
  //                   "type": "geojson",
  //                   "data": {
  //                       "type": "Feature",
  //                       "properties": {},
  //                       "geometry": {
  //                           "type": "LineString",
  //                           "coordinates": coordinatesLine
  //                       }
  //                   }
  //               },
  //               "layout": {
  //                   "line-join": "miter",
  //                   "line-cap": "butt"
  //               },
  //               "paint": {
  //                   "line-color": "#db7b2b",
  //                   "line-opacity": 0.75,
  //                   "line-width": 4
  //               }
  //           });
  //
  //   //});
  // });
// }

function parse_json() {
  d3.json('https://data.cityofnewyork.us/resource/i4gi-tjb9.json', function(err, data) {
    if (err) throw err;
    //console.log(data);

    var i = 0;
    var timer = window.setInterval(function() {
      if (i < data.length) {
          // data.features[0].geometry.coordinates.push(coordinates[i]);
          // map.getSource('trace').setData(data);
          // map.panTo(coordinates[i]);

          // get the coordinates of the traffic lines
          // to draw a straight line, we only take the first two points
          var coordinatesLine = [];
          var coordinatesString = data[i]['link_points'].split(" ");
          var coordinates = [];

          // console.log(coordinatesString);
          for (var j = 0; j < coordinatesString.length; j++) {
              if (!coordinatesString[j].isEmpty) {
                var coord = coordinatesString[j].split(',');
                coordinatesLine.push(coord.map(Number).reverse());
              }
          }
          //console.log(coordinatesLine[0]);
          for (var j = 0; j < coordinatesLine.length; j++) {
            if (coordinatesLine[j] != 0) {
              coordinates.push(coordinatesLine[j]);
            }
            if (coordinates.length >= 2) {
              break;
            }
          }
          console.log(coordinates);
          // var geoPath = d3.geoPath();
          // var geoMultiPoint = {
          //         "type": "MultiPoint",
          //         "coordinates": coordinates
          // };
          //console.log(coordinates);
          // var geoPath = d3.geoPath();
          //
          // var geoLineString = {
          //     "type": "LineString",
          //     "coordinates": coordinates
          // };
          //
          // var width = 400,
          //     height = 400,
          //     geoPath = d3.geoPath();
          //     // SVG Container
          //
          // var svgContainer = d3.select("body").append("svg")
          //     .attr("width", width)
          //     .attr("height", height)
          //     .style("border", "2px solid steelblue")
          //
          // var lineStringPath = svgContainer.append("path")
          //     .attr("d", "M-73.994441,40.77158L-73.99455,40.7713004")
          //     .style("stroke", "#FF00FF");
          i++;
      }
      else {
          window.clearInterval(timer);
      }
    }, 1000);

  });
}
