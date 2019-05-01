$(document).ready(function(){
  bgmSound();
});

function bgmSound(){
  var sound = document.getElementById('bgmAudio');
  sound.volume = 0.3;
  sound.play();
}

var w = window.innerWidth;
var h = window.innerHeight;
var androidTex;
var texture;
var sprite1;

var game1 = new Phaser.Game(w, h, Phaser.AUTO, 'game',{ preload: preload, create: create, update: update, render: render });

function preload() {
	game1.load.image('bomb', '../icon/Bomb.png');
	game1.load.image('restart', '../icon/restart.png');
	game1.load.spritesheet('code_icons1', '../icon/vendor-icons.png', 32, 32);
	game1.load.spritesheet('bomb-sprite', '../icon/bomb-sprite.png', 32, 42);
	game1.load.spritesheet('veggies', '../icon/iconninja-sprites.png', 50, 50);
}

var good_objects1,
		bad_objects,
		slashes,
		line,
		scoreLabel,
		score = 0,
		points = [];

var fireRate = 1000;
var nextFire = 0;
var android_blocks = [];
var atom_blocks = [];
var angular_blocks = [];
var code_block;
var bomb_block;
var restart_label;
var finalLabel;


function create() {

	game1.physics.startSystem(Phaser.Physics.ARCADE);
	game1.physics.arcade.gravity.y = 300;
	game1.stage.backgroundColor = '#ac87c6';
	code_block = 'code_icons1';
	android_blocks.push('android_l');
	android_blocks.push('android_s');
  // bomb_block.push('bomb');
	bomb_block = 'bomb-sprite';
	good_objects1 = createGroup(1, code_block);
	bad_objects = createGroup1(1, bomb_block);

	slashes = game1.add.graphics(0, 0);
	slashes.lineStyle(2, 0x0000FF, 1);

	scoreLabel = game1.add.text(10,10,'Tip: Avoid the bombs!');
	scoreLabel.fill = 'white';

	emitter = game1.add.emitter(0, 0, 300);
	emitter.makeParticles('veggies', [0,1,2,3,4], 30);
		// game.cache.getBitmapData('parts'));
	emitter.gravity = 300;
		emitter.setXSpeed(-400,400);
	// emitter.setYSpeed(-400,400);
	throwObject();
}


function createGroup (numItems, sprite) {
	var group = game1.add.group();
	group.enableBody = true;
	group.physicsBodyType = Phaser.Physics.ARCADE;
	group.createMultiple(numItems, sprite, [1,8,4,19,23]);
	// sprite.width = 40; sprite.height = 40;
	group.setAll('scale.x', 2.5);
	group.setAll('scale.y', 2.5);
	group.setAll('checkWorldBounds', true);
	group.setAll('outOfBoundsKill', true);
	// good_objects1 = group.createMultiple(4, sprite1);
	return group;
}

function createGroup1 (numItems, sprite) {
	var group = game1.add.group();
	group.enableBody = true;
	group.physicsBodyType = Phaser.Physics.ARCADE;
	group.createMultiple(numItems, sprite, [0]);
	group.setAll('scale.x', 2);
 	group.setAll('scale.y', 2);
	group.setAll('checkWorldBounds', true);
	group.setAll('outOfBoundsKill', true);
	// good_objects1 = group.createMultiple(4, sprite1);
	return group;
}

function throwObject() {
	if (game1.time.now > nextFire && good_objects1.countDead()>0 && bad_objects.countDead()>0) {
		nextFire = game1.time.now + fireRate;
		throwGoodObject(good_objects1);
		if (Math.random()>.5) {
			throwBadObject();
		}
	}
}

function throwGoodObject(object_passed) {
	var obj = object_passed.getFirstDead();
	obj.reset(game1.world.centerX + Math.random()*100-Math.random()*100, 600);
	obj.anchor.setTo(0.5, 0.5);
	//obj.body.angularAcceleration = 100;
	game1.physics.arcade.moveToXY(obj, game1.world.centerX, game1.world.centerY, 530);
}

function throwBadObject() {
	var obj = bad_objects.getFirstDead();
	obj.reset(game1.world.centerX + Math.random()*100-Math.random()*100, 600);
	obj.anchor.setTo(0.5, 0.5);
	//obj.body.angularAcceleration = 100;
	game1.physics.arcade.moveToXY(obj, game1.world.centerX, game1.world.centerY, 530);
}

function update() {
	throwObject();

	points.push({
		x: game1.input.x,
		y: game1.input.y
	});
	points = points.splice(points.length-10, points.length);
	//game.add.sprite(game.input.x, game.input.y, 'hit');

	if (points.length<1 || points[0].x==0) {
		return;
	}

	slashes.clear();
	// slashes.beginFill(0xFFFFFF);
	slashes.alpha = .8;
	slashes.moveTo(points[0].x, points[0].y);
	for (var i=1; i<points.length; i++) {
		slashes.lineTo(points[i].x, points[i].y);
	}
	// slashes.endFill();

	for(var i = 1; i< points.length; i++) {
		line = new Phaser.Line(points[i].x, points[i].y, points[i-1].x, points[i-1].y);
		game1.debug.geom(line);

		good_objects1.forEachExists(checkIntersects);
		bad_objects.forEachExists(checkIntersects);
	}
}

var contactPoint = new Phaser.Point(0,0);

function checkIntersects(fruit, callback) {
	var l1 = new Phaser.Line(fruit.body.right - fruit.width, fruit.body.bottom - fruit.height, fruit.body.right, fruit.body.bottom);
	var l2 = new Phaser.Line(fruit.body.right - fruit.width, fruit.body.bottom, fruit.body.right, fruit.body.bottom-fruit.height);
	l2.angle = 90;

	if(Phaser.Line.intersects(line, l1, true) ||
		 Phaser.Line.intersects(line, l2, true)) {

		contactPoint.x = game1.input.x;
		contactPoint.y = game1.input.y;
		var distance = Phaser.Point.distance(contactPoint, new Phaser.Point(fruit.x, fruit.y));
		if (Phaser.Point.distance(contactPoint, new Phaser.Point(fruit.x, fruit.y)) > 110) {
			return;
		}

		if (fruit.parent == good_objects1) {
			killFruit(fruit);
		} else {
			resetScore();
		}
	}

}

function resetScore() {
	var highscore = Math.max(score, localStorage.getItem("highscore"));
	localStorage.setItem("highscore", highscore);

	good_objects1.forEachExists(killFruit);
	bad_objects.forEachExists(killFruit);


	good_objects1.destroy();
	bad_objects.destroy();
	scoreLabel.destroy();
	finalLabel = game1.add.text(w/2-150, h/2-200,'Game Over!\nYour Score: '+score, { font: '30px Arial', fill: '#fff' });
	finalLabel.fill = 'white';
	// restart_label = game.add.text(w/2-150, h/2, 'Restart', { font: '60px Arial', fill: '#fff' });
  //   restart_label.inputEnabled = true;
	// 	restart_label.events.onInputUp.add(reviveAll);
		restart_label = game1.add.button(w/2-120, h/2-90, 'restart', reviveAll, this, 0, 0, 0);
}

function render() {
}

function reviveAll() {
	score = 0;
		restart_label.destroy();
		finalLabel.destroy();
    create();
	// window.location = "landing.html";

}

function killFruit(fruit) {

	emitter.x = fruit.x;
	emitter.y = fruit.y;
	emitter.start(true, 2000, null, 8);
	fruit.kill();
	points = [];
	score++;
	scoreLabel.text = 'Score: ' + score;
}
