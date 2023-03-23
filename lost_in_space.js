"use strict";

window.onload = function() {
	window.setInterval(refresh,500);
};


var canvas = document.getElementById("game_area");
var context = canvas.getContext('2d');


var shipX = 300;
var shipY = 600;

var shot = [];

var ETright = [];
var ETleft = [];

var time = -40;
var descente = 0;

var collide = false;

var direction = 0;

var bossShot = [];
var bossHealth = 200;
var bossCD = true;
var bossCleared = false;

for (var a = 0; a < 8; a++) {
	for (var flagi = 0; flagi < 20; flagi++) {
		ETleft.push([30 * flagi + -20 * 30, a*40]);
	}
}
for (var b = 0; b < 8; b++) {
	for (var flagj = 0; flagj < 20; flagj++) {
		ETright.push([570 - 30 * flagj + 20 * 30, b*40 + 20]);
	}
}


context.beginPath();
context.fillStyle = 'yellow';
context.strokeStyle = 'yellow';
context.moveTo(shipX - 10, shipY);
context.lineTo(shipX + 10, shipY);
context.lineTo(shipX, shipY - 18);
context.lineTo(shipX - 10, shipY);
context.fill();
context.stroke();


function move(key) {
	if (key.keyCode == 39) {
		if (shipX <= 580) {
			shipX += 10;
		}
	}
	if (key.keyCode == 37) { 
		if (shipX >= 20) {
			shipX -= 10;
		}
	}
	if (key.keyCode == 38) { 
		if (shipY >= 28) {
			shipY -= 10;
		}
	}
	if (key.keyCode == 40) {
		if (shipY <= 590) {
			shipY += 10;
		}
	}
	context.clearRect(0,0,600,600);
	context.beginPath();
	context.fillStyle = 'yellow';
	context.strokeStyle = 'yellow';
	context.moveTo(shipX - 10, shipY);
	context.lineTo(shipX + 10, shipY);
	context.lineTo(shipX, shipY - 18);
	context.lineTo(shipX - 10, shipY);
	context.fill();
	context.stroke();
	alien(time, descente, ETright, ETleft);
	alienmove(ETright, ETleft)
	shootmove(shot);
	alienshot(ETright, ETleft, shot);
	colision(ETright, ETleft, shipX, shipY);
	var cleared = clear(ETright, ETleft);
	if (cleared == true && bossCleared == false) {
		boss(bossShot, bossHealth, shot, time, cleared);
		bossBullet(bossShot, shipX, shipY);
	}
}

function shoot(key) {
	if (key.keyCode == 32) {
		if (shot.length < 4) {
			shot.push([shipX,shipY - 18,0]);
		}
	}
}

function shootmove(shot){
	/* shot.forEach(element => {
		context.beginPath();
		context.strokeStyle = "#00a3cc";
		context.moveTo(element[0],element[1]);
		context.lineTo(element[0],element[1] - 20);
		context.stroke();
		element[1] -= 20;
		element[2] += 1;
		if (element[2] == 20) {
			shot.splice(shot.indexOf(element),1); 
		}*/
	for (var tir = 0; tir < shot.length; tir++) {
		context.beginPath();
		context.strokeStyle = "#00a3cc";
		context.moveTo(shot[tir][0],shot[tir][1]);
		context.lineTo(shot[tir][0],shot[tir][1] - 18);
		context.stroke();
		shot[tir][1] -= 20;
		shot[tir][2] += 1;
	}
	shot.forEach(element => {
		if (element[2] == 15) {
		shot.splice(shot.indexOf(element),1); }
	})
}
	
	
window.onkeydown = move;
window.onkeypress = shoot;


var ET = new Image();
ET.onload = alien
ET.src = 'alien.png';

var explosion = new Image();
explosion.src = 'explosion.png';

var bosssprite = new Image();
bosssprite.src = 'boss.png';


function alien(time, descente, ETright, ETleft) {
	for (var a = descente; a < descente + 8; a++) {
		var flagA = a - descente
		for (let i = 0; i < 20; i++) {
			if (ETleft[flagA * 20 + i] != 'dead') {
				ETleft[flagA * 20 + i] = [30 * i + time * 15, a*40];
			}
		}
	}
	for (var b = descente; b < descente + 8; b++) {
		var flagB = b - descente
		for (let i = 0; i < 20; i++) {
			if (ETright[flagB * 20 + i] != 'dead') {
				ETright[flagB * 20 + i] =[570 - 30 * i - time * 15, b*40 + 20];
			}
		}
	}
}

function alienmove(ETright, ETleft) {
	ETright.forEach(elem => {
		if (elem != 'dead') {
			context.drawImage(ET,elem[0],elem[1]);
		}
	})
	ETleft.forEach(elem => {
		if (elem != 'dead') {
		context.drawImage(ET,elem[0],elem[1]);
		}
	})
}


function alienshot(ETright, ETleft, shot) {
	shot.forEach(bullet => {
		for (let alienLeft = 0; alienLeft < ETleft.length; alienLeft++) {
			if (bullet[0] >= ETleft[alienLeft][0] && bullet[0] <= ETleft[alienLeft][0] + 30 && bullet[1] - 18 <= ETleft[alienLeft][1] + 27 && bullet[1] - 18 >= ETleft[alienLeft][1]) {
				shot.splice(shot.indexOf(bullet),1);
				ETleft[alienLeft] = 'dead';
				context.drawImage(explosion,bullet[0] - 17,bullet[1] - 18);
			}
		}
		for (let alienRight = 0; alienRight < ETright.length; alienRight++) {
			if (bullet[0] >= ETright[alienRight][0] && bullet[0] <= ETright[alienRight][0] + 30 && bullet[1] - 18 <= ETright[alienRight][1] + 27 && bullet[1] - 18 >= ETright[alienRight][1]) {
				shot.splice(shot.indexOf(bullet),1);
				ETright[alienRight] = 'dead';
				context.drawImage(explosion,bullet[0] - 17,bullet[1] - 18);
			}
		}
	})
}

function colision(ETright, ETleft, shipX, shipY, collide) {
	ETright.forEach(alien => {
		if (shipX >= alien[0] && shipX <= alien[0] + 30 && shipY >= alien[1] && shipY - 18 <= alien[1] + 27) {
			context.drawImage(explosion, shipX - 17, shipY - 24);
			collide = true;
		}
	})
	ETleft.forEach(alien => {
		if (shipX >= alien[0] && shipX <= alien[0] + 30 && shipY >= alien[1] && shipY - 18 <= alien[1] + 27) {
			context.drawImage(explosion, shipX - 17, shipY - 24);
			collide = true;
		}
	})
	if (collide == true) {
	return true;
}
}
			
function clear(ETright, ETleft) {
	let rightClear = 0;
	let leftClear = 0;
	ETright.forEach(alien => {
		if (alien == 'dead') {
			rightClear += 1;
		}
	})
	ETleft.forEach(alien => {
		if (alien == 'dead') {
			leftClear += 1;
		}
	})
	if (rightClear + leftClear == 320) {
		return true;
	}
}
			
function boss(bossShot, bossHealth, shot, time, cleared) {
	context.drawImage(bosssprite,120,20);
	if (time%3 == 0) {
		for (var flag = 0; flag < 3; flag++) {
			bossShot.push([Math.random() * 600, 280]);
		}
	}
	shot.forEach(bullet => {
		if (bullet[0] >= 120 && bullet[0] <= 480 && bullet[1] - 18 <= 280 && bullet[1] >= 20) {
			shot.splice(shot.indexOf(bullet),1);
			bossHealth--;                /* Pour une raison que j'ignore, les points de vie du boss ne diminue pas lorsqu'on lui tire dessus*/
			console.log(bossHealth);
			context.drawImage(explosion,bullet[0] - 17,bullet[1] - 18);
		}
	})
	if (bossHealth <= 0) {
		BossCleared = true;
	}
}
	
function bossBullet(bossShot, shipX, shipY) {
	bossShot.forEach(bullet => {
		context.beginPath();
		context.strokeStyle = '#11d950';
		context.moveTo(bullet[0],bullet[1]);
		context.lineTo(bullet[0],bullet[1] + 35);
		context.stroke();
		bullet[1] += 35
		if (bullet[1] > 800) {
			bossShot.splice(bossShot.indexOf(bullet),1);
		}
	})
}
		
	
			

function refresh() {	
	context.clearRect(0,0,600,600);
	var cleared = clear(ETright, ETleft);
	if (cleared == true && bossCleared == false) {
		boss(bossShot, bossHealth, shot, time, cleared);
		bossBullet(bossShot, shipX, shipY);
	}
	context.beginPath();
	context.fillStyle = 'yellow';
	context.strokeStyle = 'yellow';
	context.moveTo(shipX - 10, shipY);
	context.lineTo(shipX + 10, shipY);
	context.lineTo(shipX, shipY - 18);
	context.lineTo(shipX - 10, shipY);
	context.fill();
	context.stroke();
	time += 1;
	if (time == 41) {
		time = -40
	}
	if (time == 0 || time == 40 || time == -20 || time == 20 ){
		if (direction == 0) {
			descente += 1;
			if (descente == 8) {
				direction = 1;
			}
		}
		if (direction == 1) {
			descente -= 1;
			if (descente == 0) {
				direction = 0;
			}
		}
	}
	var GameOver = colision(ETright, ETleft, shipX, shipY);
	alienshot(ETright, ETleft, shot);
    alien(time, descente, ETright, ETleft);	
	alienmove(ETright, ETleft)
	shootmove(shot);
	if (GameOver == true) {
		context.font = '50px serif';
		context.fillStyle = 'red';
		context.fillText('GameOver',200,300);
		context.stroke();
	}
}
	
	
	
	
	
