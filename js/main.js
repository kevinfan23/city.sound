// declare global variables
const blue = '#3F99FF';
mapboxgl.accessToken = 'pk.eyJ1Ijoia2V2aW5mYW4yMyIsImEiOiJjaXV0Ymo5eDIwMHhhMnhsZ3YxNHBjeWZuIn0.6VFBg8iqnjPGwUniL8wgWg';
const zoom = 11;
const chords = ['music/chords/Fmajor7.wav',
  'music/chords/Fmajor7.wav',
  'music/chords/Fmajor7.wav',
  'music/chords/Fmajor7.wav',
  'music/chords/Fmajor7.wav',
  'music/chords/Fmajor7.wav',
  'music/chords/Fmajor7.wav',
  'music/chords/Fmajor7.wav',
  'music/chords/Em.wav',
  'music/chords/Fmajor7.wav',
  'music/chords/Em.wav',
  'music/chords/Fmajor7.wav',
  'music/chords/Em.wav',
  'music/chords/Fmajor7.wav',
  'music/chords/Gsus.wav',
  'music/chords/G.wav',
  'music/chords/Fmajor7.wav',
  'music/chords/C.wav',
  'music/chords/Fmajor7.wav',
  'music/chords/C.wav',
  'music/chords/Fmajor7.wav',
];

// coordinates offsets
// top left corner
// lat: 40.84926763226528
// lng: -74.17880233274501

// bottom right corner
// lat: 40.66914920135909
// lng: -73.86437121410064
const offLon1 = -74.17880;
const offLat1 = 40.84926;
const offLon2 = -73.86437;
const offLat2 = 40.66914;
const screenX = 1440;
const screenY = 862;

const pi = Math.PI;

var map_loaded = false;
var map;

map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/kevinfan23/cj6duchkb0zb52sqjq0z9c0ka',
  center: [-73.980939, 40.735686],
  zoom: zoom,
  attributionControl: false,
  pitch: 38,
  //interactive: false
});

map.on('load', function() {
  console.log("loaded");
  animate_revealer();
  parse_json();
});

  // map.on('mousemove', function (e) {
  //       // e.point is the x, y coordinates of the mousemove event relative
  //       // to the top-left corner of the map
  //       //JSON.stringify(e.point) + '<br />' +
  //       // e.lngLat is the longitude, latitude geographical position of the event
  //       console.log(e.lngLat);
  // });

function parse_json() {
  var geo_canvas_ratioX = (offLon2 - offLon1)/screenX;
  var geo_canvas_ratioY = (offLat2 - offLat1)/screenY;

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
          var speed = data[i]['speed'];
          var borough = data[i]['borough'];
          var coordinates = [];

          // console.log(coordinatesString);
          for (var j = 0; j < coordinatesString.length; j++) {
              if (!coordinatesString[j].isEmpty) {
                var coord = coordinatesString[j].split(',');
                coordinatesLine.push(coord.reverse());
              }
          }
          //console.log(coordinatesLine[0]);
          for (var j = 0; j < coordinatesLine.length; j++) {
            if (coordinatesLine[j] != 0) {
              coordinates.push(coordinatesLine[j]);
            }
            if (coordinates.length >= 1) {
              break;
            }
          }
          coordinates = coordinates[0];
          // // convert mercator geo coordinate
          // console.log(coordinates[0]);
          // console.log("lat is: " + coordinates[1] + ", lon is: " + coordinates[0]);
          // console.log(speed);

          var x = (coordinates[0] - offLon1)/geo_canvas_ratioX;
          var y = (coordinates[1] - offLat1)/geo_canvas_ratioY;

          // console.log("x is: " + x + ", y is: " + y);
          // console.log(borough);

          animateParticules(x-500, y-50, 0.2, speed);
          i++;
      }
      else {
          window.clearInterval(timer);
      }
    }, 309);

    var delayMillis = 1000; //1 second

    var j = 0;
    var music_timer = window.setInterval(function() {
      if (j == 13) {
        setTimeout(function() {
          var chord = new Howl({
            src: [chords[j]],
            autoplay: true,
            volume: 0.3,
          });
          chord.play();
        }, 300);
      }
      else {
        var chord = new Howl({
          src: [chords[j]],
          autoplay: true,
          volume: 0.3,
        });
        chord.play();
      }
      j++;
    }, 3090);

    setTimeout(function() {
      var song = new Howl({
        src: ['music/lost_stars.mp3'],
      });

      song.play();
    }, 2300);
  });
}

// Generate ripple effects
// adapted from Anime.js example
// https://codepen.io/juliangarnier/pen/gmOwJX
  window.human = false;

  var canvasEl = document.querySelector('.canvas');
  var ctx = canvasEl.getContext('2d');

  function setCanvasSize() {
    canvasEl.width = window.innerWidth * 2;
    canvasEl.height = window.innerHeight * 2;
    canvasEl.style.width = window.innerWidth + 'px';
    canvasEl.style.height = window.innerHeight + 'px';
    canvasEl.getContext('2d').scale(2, 2);
  }

  function createCircle(x,y,r,s) {
    var hue = s*1.5;
    var p = {};
    p.x = x;
    p.y = y;
    p.color = 'hsl(' + hue + ', 100%, 70%)';
    p.radius = r;
    p.alpha = 1;
    p.lineWidth = 20;
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

  function animateParticules(x, y, r, s) {
    var circle = createCircle(x, y, r, s);
    var particules = [];

    anime.timeline().add({
      targets: circle,
      radius: anime.random(80, 160),
      lineWidth: 0,
      alpha: {
        value: 0,
        easing: 'linear',
        duration: anime.random(1000, 1200),
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

// // Helper functions for Mercator mapping
// function mercX(lon) {
//   lon = lon * (pi/180);
//   var a = (256 / pi) * Math.pow(2, zoom);
//   var b = lon + pi;
//   return a * b;
// }
//
// function mercY(lat) {
//   lat = lat * (pi/180);
//   var a = (256 / pi) * Math.pow(2, zoom);
//   var b = Math.tan(pi / 4 + lat / 2);
//   var c = pi - Math.log(b);
//   return a * c;
// }
