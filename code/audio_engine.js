var sound_folder = 'sounds/';
var music_folder = 'music/';

var audio;

function MusicSound(name) {
	this.sound = new Howl({
		urls: [music_folder + name + ".mp3", music_folder + name + ".ogg"],
		buffer: true,
		loop: true
	});
}

function EffectSound(name) {
	this.sound = new Howl({
		urls: [sound_folder + name + ".mp3", sound_folder + name + ".wav"],
		volume: 0.3,
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
		}
	};
	var effectlist = [
		"dialog",
		"steps_floor",
		"steps_house",
		"steps_outside",
		"steps_park",
		"steps_wood",
		"steps_wood2"];
	var musiclist = [
		"music01"];
	for (var i=0; i<effectlist.length; i++) {
		audio.effects[effectlist[i]] = new EffectSound(effectlist[i]);
	}
	for (var i=0; i<musiclist.length; i++) {
		audio.music[musiclist[i]] = new MusicSound(musiclist[i]);
	}
}
