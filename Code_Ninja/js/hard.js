$(document).ready(function(){
  bgmSound();
});


function bgmSound(){
  var sound = document.getElementById('bgmAudio');
  sound.volume = 0.3;
  sound.play();
}
