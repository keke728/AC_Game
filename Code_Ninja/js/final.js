$(document).ready(function(){
  landingSound();

  $('.restart').click(function(){
    window.location = "landing.html";
  });
});

function landingSound(){
  var sound = document.getElementById('landingAudio');
  sound.volume = 0.3;
  sound.play();
}
