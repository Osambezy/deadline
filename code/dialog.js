// Delay formula: delay = num_characters * delay_factor + delay_constant
var delay_factor = 70;
var delay_constant = 1000;

var gameenv = parent.gameenv;
var content = parent.content;

var current_face;
var current_choices;

var image_dir = "../images/";

function bodyLoaded()
{
	document.getElementById("faceimg").ondragstart = function() { return false; };
	if (gameenv) {
		start_dialog(gameenv.current_dialog_id);
	} else {
		display_message('ren', "Sometimes I wonder if I should have become like Tuner...", false);
	}
}

function start_dialog(id) {
	document.onmousedown = null;
	var d = content.dialogs;
	if (d[id]) {
		if (d[id].choice) {
			display_choice(d[id].image, d[id].choice);
		} else {
			display_message(d[id].image, d[id].text, d[id].next);
		}
	} else {
		display_message("", 'Dialog "' + id + '" not found.', false);
	}
	
}

function display_message(face, text, next) {
	document.getElementById("faceimg").src = image_dir + "face_" + face + ".png";
	document.getElementById("textbox").innerHTML = text;
	var delay = text.length * delay_factor + delay_constant;
	var next_func;
	if (next == -1) {  // keep open forever to wait for user input
		return;
	} else if (next) { // continue with next dialog
		next_func = function() { start_dialog(next); };
	} else { // nothing to continue, close window
		next_func = close;
	}
	var to = setTimeout(next_func, delay);
	document.onmousedown = function() {
		// click handler to skip to next dialog
		clearTimeout(to);
		next_func();
	};
}

function display_choice(face, choices) {
	current_face = face;
	current_choices = choices;
	var text = "<ul>";
	for (var c=0; c<choices.length; c++) {
		text = text + '<li><p class="choice"><a href="javascript:choice('+c+')">' + choices[c].text + '</a></p></li>';
	}
    text = text + "</ul>";
	display_message(face, text, -1);
}

function choice(c) {
	display_message(current_face, current_choices[c].text, current_choices[c].next);
}

function close() {
	gameenv.closeIframe();
}
