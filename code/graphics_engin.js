var bg_folder = 'images/';
var fg_folder = 'images/';
var dialog_html = 'code/dialog.html';

var gameenv;

function ImageCollection(srclist)
{
	this.srclist = srclist;
	var src;
	this.images = [];
	for (var i = 0; i < srclist.length; i++)
	{
		src = srclist[i];
		this.images[src] = new Image();
		this.images[src]._loadedNoProblem = false;
		this.images[src].onload = function () { this._loadedNoProblem = true; };
		this.images[src].src = fg_folder + src;
	}
}
ImageCollection.prototype.loaded = function() {
	var ok = true;
	for (var src in this.images)
	{
		if (!(this.images[src]._loadedNoProblem))
		{
			ok = false;
			break;
		}
	}
	return ok;
}

function bodyLoaded()
{
	initGameEnv();
	initAudio();
	audio.playMusic("music01");
	gameenv.start();
}

function initGameEnv()
{
	gameenv = {
		walkingTimerInterval: 240,
		default_transition_width: 100,
		default_entrance_pos: 80,
		default_player_y: 160,
		
		fade_time: 1000, // ms
		dark_time: 300,  // ms, between region transitions (doors)

		imgcollection: new ImageCollection([
		'alberto0.png',
		'errorbar0.png',
		'face_alberto.png',
		'face_greg.png',
		'face_mira.png',
		'face_ren.png',
		'face_tuner.png',
		'guyleft1.png',
		'guyleft2.png',
		'guyleft3.png',
		'guyright1.png',
		'guyright2.png',
		'guyright3.png',
		'house0.png',
		'house1.png',
		'outside0.png',
		'outside1.png',
		'outside10.png',
		'outside11.png',
		'outside2.png',
		'outside3.png',
		'outside4.png',
		'outside5.png',
		'outside6.png',
		'outside7.png',
		'outside8.png',
		'outside9.png',
		'room0.png',
		'room1.png',
		'room2.png'
		]),

		background: document.getElementById("background"),
		
		fade_layer: document.getElementById("fade_layer"),
		fade_opacity: 100,
		fade_timer_id: -1,

		player: document.getElementById("player"),
		playerPosition: -1,
		playerTop: -1,
		playerDirection: "right",  // left or right
		playerPose: 0,
		playerPoses: [1, 3, 2, 3],
		//playerMovementsForPoses: [10, 20, 10, 20],
		//distanceTolerance: 20,
		playerMovementsForPoses: [20, 34, 20, 34],
		distanceTolerance: 30,
		
		iframe: document.getElementById("popup_frame"),
		current_dialog_id: '',

		destinationX: -1,
		scheduledAction: function() {},
		
		region: "",
		screen: 0,
		data: {}, // universal object to store game state information, used by game content and dialogs
		
		start: function() {
			if (!gameenv.imgcollection.loaded()) {
				setTimeout(gameenv.start, 500);
			} else {
				gameenv.initImgs();
				gameenv.gotoScreen(initial_region, initial_screen, initial_pos);
				gameenv.fadeIn();
			}
		},
		gotoScreen: function(region, screen, initial_x) {
			gameenv.region = region;
			gameenv.screen = screen;
			gameenv.background.src = bg_folder + region + screen + ".png";
			gameenv.movePlayer(initial_x, "");
			gameenv.changeBackToOriginalPose();
			gameenv.clearStatusMessage();
		},
		initImgs: function() {
			gameenv.initFadeLayer();
			gameenv.background.onmousemove = gameenv.mouseHandler;
			gameenv.background.onmousedown = gameenv.mouseClickHandler;
			gameenv.background.ondragstart = function() { return false; };
			gameenv.playerTop = gameenv.default_player_y;
			gameenv.playerWidth = 130;
			gameenv.playerPosition = Math.floor(gameenv.playerWidth / 2);
			gameenv.player.style.left = "0px";
			gameenv.player.style.top = gameenv.playerTop + "px";
			gameenv.player.width = gameenv.playerWidth;
			gameenv.player.ondragstart = function() { return false; };
		},
		mouseHandler: function(event) {
				var x = event.clientX - document.getElementById("container").offsetLeft;
				gameenv.setStatusMessage(gameenv.getAction(x)[0]);
		},
		mouseClickHandler: function(event) {
				window.lastmousedownevent = event; // debug
				var x = event.clientX - document.getElementById("container").offsetLeft;
				gameenv.scheduledAction = gameenv.getAction(x)[1];
				var is_walking = gameenv.destinationX > -1;
				gameenv.destinationX = x;
				if (!is_walking) {
					gameenv.walkingTimer();
				}
		},
		getAction: function(x) {
			// check if clicked on interaction area
			for (var d in content.screens[gameenv.region][gameenv.screen].interactions) {
				var area = content.screens[gameenv.region][gameenv.screen].interactions[d];
				if (x >= area.from && x <= area.to) {
					return ["Talk / Use", area.action];
				}
			}
			// check if clicked on door
			for (var d in content.screens[gameenv.region][gameenv.screen].doors) {
				var door = content.screens[gameenv.region][gameenv.screen].doors[d];
				if (x >= door.from && x <= door.to) {
					return ["Enter", function() {
						gameenv.fadeOut();
						gameenv.clearStatusMessage();
						setTimeout(function() {
							gameenv.gotoScreen(door.region, door.screen, door.pos);
							gameenv.fadeIn();
						}, gameenv.fade_time + gameenv.dark_time);
					}];
				}
			}
			// check if clicked on screen edge to do a transition
			if (x <= gameenv.default_transition_width) {
				if (gameenv.screen > 0) {
					return ["Go Left", function() {
						gameenv.gotoScreen(gameenv.region, gameenv.screen - 1, 1000 - gameenv.default_entrance_pos);
					}];
				}
			} else if (x >= 1000 - gameenv.default_transition_width) {
				if (gameenv.screen < content.screens[gameenv.region].length - 1) {
					return ["Go Right", function() {
						gameenv.gotoScreen(gameenv.region, gameenv.screen + 1, gameenv.default_entrance_pos);
					}];
				}
			}
			return ["&nbsp;", function() {}];
		},
		movePlayer: function(position, src) {
			var img;
			img = gameenv.player;
			img.src = src;
			img.style.left = position - Math.floor(gameenv.playerWidth / 2) + "px";
			gameenv.playerPosition = position;
		},
		changePlayerPose: function() {
			gameenv.playerPose = (gameenv.playerPose + 1) % gameenv.playerPoses.length;
		},
		stepRight: function() {
			var ic = gameenv.imgcollection;
			var movement = gameenv.playerMovementsForPoses[gameenv.playerPose];
			gameenv.playerDirection = "right";
			gameenv.changePlayerPose();
			gameenv.movePlayer(gameenv.playerPosition + movement, ic.images["guyright" + gameenv.playerPoses[gameenv.playerPose] + ".png"].src);
			if (gameenv.playerPose == 0 || gameenv.playerPose == gameenv.playerPoses.length / 2)
				audio.playSound("steps_" + content.screens[gameenv.region][gameenv.screen].steps);
		},
		stepLeft: function() {
			var ic = gameenv.imgcollection;
			var movement = gameenv.playerMovementsForPoses[gameenv.playerPose];
			gameenv.playerDirection = "left";
			gameenv.changePlayerPose();
			gameenv.movePlayer(gameenv.playerPosition - movement, ic.images["guyleft" + gameenv.playerPoses[gameenv.playerPose] + ".png"].src);
			if (gameenv.playerPose == 0 || gameenv.playerPose == gameenv.playerPoses.length / 2)
				audio.playSound("steps_" + content.screens[gameenv.region][gameenv.screen].steps);
		},
		changeBackToOriginalPose: function() {
			var ic = gameenv.imgcollection;
			gameenv.movePlayer(gameenv.playerPosition, ic.images["guy" + gameenv.playerDirection + "3.png"].src);
		},
		walkingTimer: function()
		{
			if (Math.abs(gameenv.destinationX - gameenv.playerPosition) <= gameenv.distanceTolerance) {
				gameenv.destinationX = -1;
				gameenv.changeBackToOriginalPose();
				var act = gameenv.scheduledAction;
				gameenv.scheduledAction = function() {};
				act();
				return;
			}
			if (gameenv.destinationX > gameenv.playerPosition) {
				gameenv.stepRight();
			} else {
				gameenv.stepLeft();
			}
			gameenv.timerid = setTimeout(gameenv.walkingTimer, gameenv.walkingTimerInterval);
		},
		openIframe: function(url) {
			audio.playSound("dialog");
			gameenv.background.onmousedown = null; // disable mouse handler
			gameenv.background.onmousemove = null;
			gameenv.clearStatusMessage();
			gameenv.iframe.src = url;
			gameenv.iframe.style.left = "150px";
			gameenv.iframe.style.top = "75px";
			gameenv.iframe.style.width = "700px";
			gameenv.iframe.style.height = "350px";
		},
		closeIframe: function() {
			gameenv.iframe.src = "about:blank";
			gameenv.iframe.style.left = "0px";
			gameenv.iframe.style.top = "0px";
			gameenv.iframe.style.width = "0px";
			gameenv.iframe.style.height = "0px";
			gameenv.background.onmousedown = gameenv.mouseClickHandler; // re-enable mouse handler
			gameenv.background.onmousemove = gameenv.mouseHandler;
		},
		openDialog: function(dialog_id) {
			gameenv.current_dialog_id = dialog_id;
			gameenv.openIframe(dialog_html);
		},
		fadeIn: function() {
			window.clearInterval(gameenv.fade_timer_id);
			gameenv.fade_timer_id = window.setInterval("gameenv.fadeInStep()", gameenv.fade_time / 100);
		},
		fadeOut: function() {
			gameenv.initFadeLayer();
			window.clearInterval(gameenv.fade_timer_id);
			gameenv.fade_timer_id = window.setInterval("gameenv.fadeOutStep()", gameenv.fade_time / 100);
		},
		fadeInStep: function() {
			if (gameenv.fade_opacity > 0) {
				gameenv.fade_opacity -= 1;
				gameenv.setFadeOpacity();	
			} else {
				window.clearInterval(gameenv.fade_timer_id);
				gameenv.removeFadeLayer();
			}
		},
		fadeOutStep: function() {
			if (gameenv.fade_opacity < 100) {
				gameenv.fade_opacity += 1;
				gameenv.setFadeOpacity();	
			} else {
				window.clearInterval(gameenv.fade_timer_id);
			}
		},
		initFadeLayer: function() {
			gameenv.fade_layer.style.left = "0px";
			gameenv.fade_layer.style.top = "0px";
			gameenv.fade_layer.style.width = "1000px";
			gameenv.fade_layer.style.height = "500px";
		},
		removeFadeLayer: function() {
			gameenv.fade_layer.style.left = "0px";
			gameenv.fade_layer.style.top = "0px";
			gameenv.fade_layer.style.width = "0px";
			gameenv.fade_layer.style.height = "0px";
		},
		setFadeOpacity: function() {
			var opacity = gameenv.fade_opacity;
			// code from http://clagnut.com/sandbox/imagefades.php
			opacity = (opacity == 100) ? 99.999 : opacity; // prevent Firefox flickering
			gameenv.fade_layer.style.filter = "alpha(opacity:"+opacity+")"; // IE/Win
			gameenv.fade_layer.style.KHTMLOpacity = opacity/100; // Safari<1.2, Konqueror
			gameenv.fade_layer.style.MozOpacity = opacity/100; // Older Mozilla and Firefox
			gameenv.fade_layer.style.opacity = opacity/100; // Safari 1.2, newer Firefox and Mozilla, CSS3
		},
		setStatusMessage: function(msg) {
			document.getElementById("status_bar").innerHTML = msg;
		},
		clearStatusMessage: function(msg) {
			gameenv.setStatusMessage("&nbsp;");
		}
	};
}


