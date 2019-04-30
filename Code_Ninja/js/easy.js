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

var game = new Phaser.Game(w, h, Phaser.AUTO, 'game',{ preload: preload, create: create, update: update, render: render });

function preload() {
	game.load.image('android_l', '../icon/android_l.png');
	game.load.image('atom_l', '../icon/atom_l.png');
	game.load.image('atom_s', '../icon/atom_s.png');
	game.load.image('angular_l', '../icon/angular_l.png');
	game.load.image('angular_s', '../icon/angular_s.png');
	game.load.image('android_s', '../icon/android_s.png');
	game.load.image('bomb', '../icon/Bomb.png');
	game.load.spritesheet('code_icons', '../icon/vendor-icons.png', 32, 32);
	game.load.spritesheet('veggies', '../icon/iconninja-sprites.png', 50, 50);
	var bmd = game.add.bitmapData(50,50);
	bmd.ctx.fillStyle = '#e4c915';bmd.ctx.beginPath();bmd.ctx.fillRect(0, 0, 40, 40);﻿bmd.ctx.closePath();
	game.cache.addBitmapData('and', bmd);
	var bmd = game.add.bitmapData(50,50);
	bmd.ctx.fillStyle = '#0000ff';bmd.ctx.beginPath();bmd.ctx.fillRect(0, 0, 40, 40);﻿bmd.ctx.closePath();
	game.cache.addBitmapData('jav', bmd);
	var bmd = game.add.bitmapData(50,50);
	bmd.ctx.fillStyle = '#00ffff';bmd.ctx.beginPath();bmd.ctx.fillRect(0, 0, 40, 40);﻿bmd.ctx.closePath();
	game.cache.addBitmapData('parts', bmd);
	var bmd = game.add.bitmapData(70,70);
	androidTex = bmd.generateTexture('android_l');
	// bmd.texture = androidTex;
	// game.cache.addBitmapData('and', bmd);
		// android_S = game.add.sprite(0, 0, androidTex);
	 // game.cache.addSpriteSheet('good', '', bmd.canvas);

// var texture1 = sprite.generateTexture();
// bmd.draw(texture1);
// game.cache.addSpriteSheet('good', '', bmd.canvas);

	var bmd = game.add.bitmapData(64,64);
	bmd.ctx.fillStyle = '#ff0000';
	bmd.ctx.arc(32,32,32, 0, Math.PI * 2);
	bmd.ctx.fill();
	game.cache.addBitmapData('bad', bmd);

// 	var stage = new PIXI.Stage(0, true);
// var renderer = PIXI.autoDetectRenderer(620, 380);
// document.body.appendChild(renderer.view);

//create a texture
// texture = PIXI.Texture.fromImage('../icon/android_l.png');
// var tilingSprite = new PIXI.TilingSprite(texture, 100, 100);
// stage.addChild(tilingSprite);
//
// //create craphics
// var graphics = new PIXI.Graphics();
// graphics.beginFill(0);
// // graphics.moveTo(50,50);
// graphics.lineStyle(3,'white', .9);
// graphics.drawRect(0,0,100,100);
// graphics.endFill();
// stage.addChild(graphics);
//
// //mask the texture with the polygon
// tilingSprite.mask = graphics;
}

// function create() {
// 	game.physics.startSystem(Phaser.Physics.ARCADE);
// 	game.physics.arcade.gravity.y = 200;
//
// 	var bmd = game.add.bitmapData(50,50);
// 	var androidTex = bitmapdata.generateTexture('android_l');
// 	game.add.sprite(0, 0, androidTex);
// }



var good_objects,
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
var bomb_block=[];


function create() {

	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.physics.arcade.gravity.y = 300;
	game.stage.backgroundColor = '#ac87c6';
	game.load.image("background", "http://www.graphicartsunit.com/images/noise.png");
	// var bmd = game.add.bitmapData(70,70);
	// androidTex = bmd.generateTexture('android_l');
	// var sprite = game.add.sprite(0,0,androidTex);
	// game.cache.addRenderTexture('good', androidTex);
	// good_objects = createGroup(4, game.cache.getRenderTexture('good'));
	// var tilingSprite = new PIXI.TilingSprite(texture, 100, 100);
	// stage.addChild(tilingSprite);

	//create craphics
	// var graphics = new PIXI.Graphics();
	// graphics.beginFill(0);
	// // graphics.moveTo(50,50);
	// graphics.lineStyle(3,'white', .9);
	// graphics.drawRect(0,0,100,100);
	// graphics.endFill();
	// stage.addChild(graphics);
	//
	// //mask the texture with the polygon
	// tilingSprite.mask = graphics;
	// var foo = game.add.sprite(100,100,'veggies');
	// atom_blocks.push('atom_l');
	// atom_blocks.push('atom_s');
	code_block = 'code_icons';
	android_blocks.push('android_l');
	android_blocks.push('android_s');
  bomb_block.push('bomb');
	good_objects = createGroup(40, code_block);
	good_objects1 = createGroup(4, code_block);
	// var group1 = game.add.group();
	// group1.enableBody = true;
	// group1.physicsBodyType = Phaser.Physics.ARCADE;
	// 	good_objects = group1.createMultiple(4, sprite1);
	// group1.setAll('checkWorldBounds', true);
	// group1.setAll('outOfBoundsKill', true);

	// good_objects1 = createGroup(4, game.cache.getBitmapData('jav'));
	bad_objects = createGroup1(4, bomb_block);

	slashes = game.add.graphics(0, 0);
	slashes.lineStyle(2, 0x0000FF, 1);

	scoreLabel = game.add.text(10,10,'Tip: get the green ones!');
	scoreLabel.fill = 'white';

	emitter = game.add.emitter(0, 0, 300);
	emitter.makeParticles('veggies', [0,1,2,3,4], 20);
		// game.cache.getBitmapData('parts'));
	emitter.gravity = 300;
		emitter.setXSpeed(-400,400);
	// emitter.setYSpeed(-400,400);

//
// 	this.timeInSeconds = 120;
// this.timeText = this.game.add.text(this.game.world.centerX,
// this.game.world.centerY, "0:00",{font: '15px Arial', fill: '#FFFFFF', align:
// 'center'});
// this.timeText.anchor.set(0.5, 0.5);
// this.timer = this.game.time.events.loop(Phaser.Timer.SECOND,
// this.updateTimer, this);



	throwObject();
}


function createGroup (numItems, sprite) {
	var group = game.add.group();
	group.enableBody = true;
	group.physicsBodyType = Phaser.Physics.ARCADE;
	group.createMultiple(0.5, sprite, [18,19,20,21,22,23,24,25,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,26,27,28,29,30,31,32,33,34,35,36,37,40]);
	// sprite.width = 40; sprite.height = 40;
	group.setAll('scale.x', 2);
	group.setAll('scale.y', 2);
	group.setAll('checkWorldBounds', true);
	group.setAll('outOfBoundsKill', true);
	// good_objects = group.createMultiple(4, sprite1);
	return group;
}

function createGroup1 (numItems, sprite) {
	var group = game.add.group();
	group.enableBody = true;
	group.physicsBodyType = Phaser.Physics.ARCADE;
	group.createMultiple(numItems, sprite);
	group.setAll('scale.x', 0.4);
 	group.setAll('scale.y', 0.4);
	group.setAll('checkWorldBounds', true);
	group.setAll('outOfBoundsKill', true);
	// good_objects = group.createMultiple(4, sprite1);
	return group;
}

function throwObject() {
	if (game.time.now > nextFire && good_objects.countDead()>0 && good_objects1.countDead()>0 && bad_objects.countDead()>0) {
		nextFire = game.time.now + fireRate;
		throwGoodObject(good_objects);
		throwGoodObject(good_objects1);
		if (Math.random()>.5) {
			throwBadObject();
		}
	}
}

function throwGoodObject(object_passed) {
	var obj = object_passed.getFirstDead();
	obj.reset(game.world.centerX + Math.random()*100-Math.random()*100, 600);
	obj.anchor.setTo(0.5, 0.5);
	//obj.body.angularAcceleration = 100;
	game.physics.arcade.moveToXY(obj, game.world.centerX, game.world.centerY, 530);
}

function throwBadObject() {
	var obj = bad_objects.getFirstDead();
	obj.reset(game.world.centerX + Math.random()*100-Math.random()*100, 600);
	obj.anchor.setTo(0.5, 0.5);
	//obj.body.angularAcceleration = 100;
	game.physics.arcade.moveToXY(obj, game.world.centerX, game.world.centerY, 530);
}

function update() {
	// requestAnimFrame( update );
  //   renderer.render(stage);
	throwObject();

	points.push({
		x: game.input.x,
		y: game.input.y
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
		game.debug.geom(line);

		good_objects.forEachExists(checkIntersects);
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

		contactPoint.x = game.input.x;
		contactPoint.y = game.input.y;
		var distance = Phaser.Point.distance(contactPoint, new Phaser.Point(fruit.x, fruit.y));
		if (Phaser.Point.distance(contactPoint, new Phaser.Point(fruit.x, fruit.y)) > 110) {
			return;
		}

		if (fruit.parent == good_objects || fruit.parent == good_objects1) {
			killFruit(fruit);
		} else {
			resetScore();
		}
	}

}

function resetScore() {
	var highscore = Math.max(score, localStorage.getItem("highscore"));
	localStorage.setItem("highscore", highscore);

	good_objects.forEachExists(killFruit);
	good_objects1.forEachExists(killFruit);
	bad_objects.forEachExists(killFruit);

	score = 0;
	scoreLabel.text = 'Game Over!\nHigh Score: '+highscore;
	// Retrieve
}

function render() {
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
