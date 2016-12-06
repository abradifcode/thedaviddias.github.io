//= require instafeed.min
//= require wow.min

$(document).ready(function(){

 	"use strict";	

 	$(window).load(function() {});

  // Owl Carousel


  // Wow Animations
	new WOW().init();

  var userFeed = new Instafeed({
      get: 'user',
      userId: '5027903',
      accessToken: '5027903.1677ed0.c322702943d44062b0eb13539a6490cf',
      limit: 10,
      template: '<div class="instafeed__item"><a href="{{photo_link}}"><img width="185" height="185" src="{{url}}" /></a></div>',
      resolution: 'low_resolution'
  });
  userFeed.run();

});