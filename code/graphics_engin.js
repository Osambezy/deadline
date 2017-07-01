var bg_folder = 'images/';
var fg_folder = 'images/';
var dialog_html = 'code/dialog.html';
var coingame_html = 'code/coingame.html';

var gameenv;

function ImageCollection(srclist) {
    this.srclist = srclist;
    var src;

    this.images = {};
    for (var i = 0; i < srclist.length; i++) {
        src = srclist[i];
        this.images[src] = new Image();
        this.images[src]["data-loaded"] = "no";
        this.images[src].onload = function () { this["data-loaded"] = "yes"; };
        this.images[src].src = fg_folder + src;
    }
}

ImageCollection.prototype.loaded = function() {
    var ok = true;
    for (var src in this.images) {
        if (this.images.hasOwnProperty(src)) {
            if (this.images[src]["data-loaded"] === "no") {
                ok = false;
                break;
            }
        }
    }
    return ok;
}

function bodyLoaded() {
    initGameEnv();
    initAudio();
    gameenv.start();
}

function initGameEnv() {
    gameenv = {
        walkingTimerInterval: 150,
        default_transition_width: 100,
        default_entrance_pos: 110,
        default_player_y: 160,

        fade_time: 1000,  // ms
        dark_time: 300,  // ms, between region transitions (doors)
        fade_steps: 20,  // resolution of the fade

        imgcollection: new ImageCollection([
            'alberto0.png',
            'errorbar0.png',
            'face_alberto.png',
            'face_email.png',
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
            'library0.png',
            'library1.png',
            'library2.png',
            'library3.png',
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
        playerMovementsForPoses: [20, 34, 20, 34],
        distanceTolerance: 30,

        iframe: document.getElementById("popup_frame"),
        iframeCallback: function() {},
        coinEndCallback: null,
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
            music = content.screens[region][screen].music;
            if (!music) music = 'music01';
            audio.playMusic(music);
        },
        end: function() {
            gameenv.background.onmousedown = null; // disable mouse handler
            gameenv.background.onmousemove = null;
            gameenv.background.src = bg_folder + "to_be_continued.png";
            gameenv.player.remove();
            audio.stopMusic();
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
            var x = event.clientX - gameenv.background.getBoundingClientRect().left;
            gameenv.setStatusMessage(gameenv.getAction(x)[0]);
        },
        mouseClickHandler: function(event) {
            var x = event.clientX - gameenv.background.getBoundingClientRect().left;
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
                    if (area.condition == undefined || area.condition()) {
                        return [area.text, area.action];
                    }
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
        openIframe: function(url, left, top, width, height) {
            gameenv.background.onmousedown = null; // disable mouse handler
            gameenv.background.onmousemove = null;
            gameenv.clearStatusMessage();
            gameenv.iframeCallback = function() {
                audio.playSound("dialog");
                gameenv.iframe.style.left = left + "px";
                gameenv.iframe.style.top = top + "px";
                gameenv.iframe.style.width = width + "px";
                gameenv.iframe.style.height = height + "px";
            };
            gameenv.iframe.src = url;
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
            gameenv.openIframe(dialog_html, 150, 75, 700, 350);
        },
        fadeIn: function() {
            window.clearInterval(gameenv.fade_timer_id);
            gameenv.fade_timer_id = window.setInterval("gameenv.fadeInStep()", gameenv.fade_time / gameenv.fade_steps);
        },
        fadeOut: function() {
            gameenv.initFadeLayer();
            window.clearInterval(gameenv.fade_timer_id);
            gameenv.fade_timer_id = window.setInterval("gameenv.fadeOutStep()", gameenv.fade_time / gameenv.fade_steps);
        },
        fadeInStep: function() {
            if (gameenv.fade_opacity > 0) {
                gameenv.fade_opacity -= 100 / gameenv.fade_steps;
                gameenv.setFadeOpacity();
            } else {
                gameenv.fade_opacity = 0;
                window.clearInterval(gameenv.fade_timer_id);
                gameenv.removeFadeLayer();
            }
        },
        fadeOutStep: function() {
            if (gameenv.fade_opacity < 100) {
                gameenv.fade_opacity += 100 / gameenv.fade_steps;
                gameenv.setFadeOpacity();
            } else {
                gameenv.fade_opacity = 100;
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
            // transform opacity to an exponential function with shape parameter a
            var a = 0.01;
            var opacity = 100 - 100 / (Math.exp(100 * a) - 1) * (Math.exp(a * (100 - gameenv.fade_opacity)) - 1);
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

function transition(region, screen, pos) {
    gameenv.fadeOut();
    gameenv.clearStatusMessage();
    setTimeout(function() {gameenv.gotoScreen(region, screen, pos);}, gameenv.fade_time);
    setTimeout(gameenv.fadeIn, gameenv.fade_time + gameenv.dark_time);
}

function dialog(id) {
    gameenv.openDialog(id);
}

function coingame(function_after) {
    gameenv.coinEndCallback = function_after;
    gameenv.openIframe(coingame_html, 0, 0, 1000, 500);
}

function set_var(name, value) {
    gameenv.data[name] = value;
}

function check_var(name, value) {
    return gameenv.data[name] == value;
}

function end() {
    gameenv.fadeOut();
    gameenv.clearStatusMessage();
    audio.stopMusic();
    setTimeout(function() {gameenv.end();}, gameenv.fade_time);
    setTimeout(function() {gameenv.fadeIn(); audio.playMusic('music03');}, gameenv.fade_time + gameenv.dark_time);
}
