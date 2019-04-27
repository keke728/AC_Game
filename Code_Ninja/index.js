$(document).ready(function(){
});

$('#startbtn').hover(
  function(){
    var sound = document.getElementById('btnAudio');
    sound.volume = 1;
    sound.play();
  }
);
