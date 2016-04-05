(function(){
  
// Coded by Peter
// Particles
// https://github.com/Bush95

var canvas = document.querySelector('#particles');
var ctx = canvas.getContext('2d');
var particles = [];
var options = {
  max_particles: 1000,
  random: false,
  follow: false,
  explode: false,
  explode_particles: 30,
  p_speed_x: 0,
  p_speed_y: 0
};
var effect = {
  explode: function(e) {
    for (var i = 0; i < options.explode_particles; i++) {
      create(e.clientX, e.clientY);
    }
  },
  follow_mouse: function(e) {
    create(e.clientX, e.clientY);
  }
};

var create = function(mouseX, mouseY) { //check particles number, add new particle object to particles[] array.
  if (particles.length > options.max_particles) {
    particles.splice(0, (particles.length - options.max_particles));
  }
  mouseX++; //fixed random spawn when triggered on edges
  mouseY++;
  var p = {
    x: mouseX || Math.random() * canvas.width,
    y: mouseY || Math.random() * canvas.height,
    r: (Math.random() * 15) + 5,
    Vx: (Math.random() - 0.5),
    Vy: (Math.random() - 0.5),
    red: Math.floor(Math.random() * 255),
    green: Math.floor(Math.random() * 255),
    blue: Math.floor(Math.random() * 255),
    alpha: (Math.random() + 0.4)
  };
  particles.push(p);

};

var clear = function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

var draw = function(p) { //draw every particle from particles[p]
  ctx.fillStyle = "rgba(" + p.red + ", " + p.green + ", " + p.blue + ", " + p.alpha + ")";
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
  ctx.fill();
};

var fade = function(p) { //Sizing down effect, applying to every particle
  p.r *= 0.996;
};

var move = function(p) { //moving every particle
  p.x += p.Vx + options.p_speed_x;
  p.y += p.Vy + options.p_speed_y;
};

var update_stats = function() { //Showing currrent config to the user 
  var max_particles = document.querySelector('#stat_max-particles');
  var follow_cursor = document.querySelector('#stat_follow-cursor');
  var random_spawn = document.querySelector('#stat_random-spawn');
  var explode = document.querySelector('#stat_explode');
  var explode_p_num = document.querySelector('#stat_explode-p-num');
  var p_speed_x = document.querySelector('#stat_p-speed-x');
  var p_speed_y = document.querySelector('#stat_p-speed-y');

  max_particles.innerHTML = particles.length;
  follow_cursor.innerHTML = options.follow;
  random_spawn.innerHTML = options.random;
  explode.innerHTML = options.explode;
  explode_p_num.innerHTML = options.explode_particles ? options.explode_particles : 30;
  p_speed_x.innerHTML = options.p_speed_x;
  p_speed_y.innerHTML = options.p_speed_y;
};

var resize_canvas = function() {
  canvas.width = canvas.parentNode.offsetWidth;
  canvas.height = canvas.parentNode.offsetHeight;
};

var add_listener = function(element, type, listener, useCapture) { //add event listener with IE support
  if (!useCapture)
    useCapture = false;

  if (element.addEventListener) {
    element.addEventListener(type, listener, useCapture);
  } else if (type.attachEvent) {
    element.attachEvent('on' + type, listener);
  } else {
    console.log('An error occurred while adding event listener');
  }
};

var remove_listener = function(element, type, listener, useCapture) { //remove event listener with IE support
  if (!useCapture)
    useCapture = false;

  if (element.removeEventListener) {
    element.removeEventListener(type, listener, useCapture);
  } else if (type.detachEvent) {
    element.detachEvent('on' + type, listener);
  } else {
    console.log('An error occurred while removing event listener');
  }
};

var apply_listeners = function() {
  var set_config = function(e) {
    e.preventDefault();
    document.querySelector('.progress-bar').classList.add('progress-animated');

    setTimeout(function() {
      document.querySelector('.progress-bar').classList.remove('progress-animated');
    }, 500);
    document.querySelector('.welcome-popup').style.display = "none";
    options.max_particles = document.getElementById('cfg_max-particles').value;
    options.random = document.getElementById('cfg_random-spawn').checked;
    options.follow = document.getElementById('cfg_follow-cursor').checked;
    options.explode = document.getElementById('cfg_explode').checked;
    options.explode_particles = document.getElementById('cfg_explode-p-num').value;
    options.p_speed_x = Number(document.getElementById('cfg_p-speed-x').value);
    options.p_speed_y = Number(document.getElementById('cfg_p-speed-y').value);

    create(canvas.width, 0); //creating 1 particle to trigger max_particle number
    update_effects();
  };

  add_listener(document.querySelector('#config'), 'submit', set_config, false);
  add_listener(window, 'resize', resize_canvas, false);
  add_listener(document.querySelector('#cfg_explode'), 'click', function() {
    var explode_p_num = document.querySelector('#cfg_explode-p-num');
    this.checked ? explode_p_num.removeAttribute('disabled') : explode_p_num.setAttribute('disabled', true);
  }, false);
};

var update_effects = function() {
  options.explode ? add_listener(canvas, 'click', effect.explode, false) : remove_listener(canvas, 'click', effect.explode, false);
  options.follow ? add_listener(canvas, 'mousemove', effect.follow_mouse, false) : remove_listener(canvas, 'mousemove', effect.follow_mouse, false);
};

var set_default_config = function() {
  document.getElementById('cfg_max-particles').value = options.max_particles;
  document.getElementById('cfg_explode-p-num').value = 30;
  document.getElementById('cfg_p-speed-x').value = 0;
  document.getElementById('cfg_p-speed-y').value = 0;
};

var loop = function() {
  if (options.random) {
    create();
  }
  clear();
  update_stats();
  particles.forEach(function(p) {
    fade(p);
    move(p);
    draw(p);
  });
  window.requestAnimationFrame(loop);
};


// fix to requestAnimationFrame in safari:

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// MIT license

(function() {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
      window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() {
          callback(currTime + timeToCall);
        },
        timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
}());
//Main event
add_listener(window, 'load', function() {
  set_default_config();
  resize_canvas();
  apply_listeners();
  window.requestAnimationFrame(loop);
}, false);
  
})();