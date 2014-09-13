var sound_folder = 'sounds/';
var music_folder = 'music/';

var audio;

function MusicSound(name) {
	this.sound = new Howl({
		urls: [music_folder + name + ".mp3"], //, "music/" + name + ".ogg"],
		buffer: true,
		loop: true
	});
}

function EffectSound(name) {
	this.sound = new Howl({
		urls: [sound_folder + name + ".wav", sound_folder + name + ".mp3"],
		buffer: false
	});
}

function initAudio()
{
	audio = {
		effects: [],
		music: [],
		step_index: 1,
		playSound: function(name) {
			audio.effects[name].sound.play()
		},
		playMusic: function(name) {
			audio.music[name].sound.play()
		},
		playStepSound: function() {
			audio.playSound("step" + audio.step_index);
			if (audio.step_index == 1) {
				audio.step_index = 2;
			} else {
				audio.step_index = 1;
			}
		}
	};
	var effectlist = [
		"step1",
		"step2",
		"dialog"];
	var musiclist = [
		"music01"];
	for (var i=0; i<effectlist.length; i++) {
		audio.effects[effectlist[i]] = new EffectSound(effectlist[i]);
	}
	for (var i=0; i<musiclist.length; i++) {
		audio.music[musiclist[i]] = new MusicSound(musiclist[i]);
	}
}
