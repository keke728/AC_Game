$(document).ready(function(){
  landingSound();
});

$('.btn').hover(
  function(){
    var sound = document.getElementById('levelAudio');
    sound.volume = 1;
    sound.play();
  }
);

function landingSound(){
  var sound = document.getElementById('landingAudio');
  sound.volume = 0.3;
  sound.play();
}
