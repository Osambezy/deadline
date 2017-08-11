var sound_folder = 'sounds/';
var music_folder = 'music/';

var audio;

function MusicSound(name) {
	this.sound = new Howl({
		src: [music_folder + name + ".mp3", music_folder + name + ".ogg"],
		loop: name=='music03' ? false : true
	});
}

function EffectSound(name) {
	this.sound = new Howl({
		src: [sound_folder + name + ".mp3", sound_folder + name + ".wav"],
		volume: 0.3
	});
}

function initAudio()
{
	audio = {
		effects: [],
		music: [],
		current_music: null,
		step_index: 1,
		playSound: function(name) {
			audio.effects[name].sound.play()
		},
		stopSound: function(name) {
			audio.effects[name].sound.stop()
		},
		playMusic: function(name) {
			if (name != audio.current_music) {
				audio.stopMusic();
				audio.current_music = name;
				audio.music[name].sound.play();
			}
		},
		stopMusic: function() {
			if (audio.current_music) {
				audio.music[audio.current_music].sound.stop()
			}
		}
	};
	var effectlist = [
		"dialog",
		"steps_floor",
		"steps_house",
		"steps_outside",
		"steps_park",
		"steps_wood",
		"steps_wood2",
		"coin_fly",
		"coin_bounce",
		"coin_bounce_glass",
		"coin_success",
		"coin_drop"];
	var musiclist = [
		"music01",
		"music02",
		"music03",
		];
	for (var i=0; i<effectlist.length; i++) {
		audio.effects[effectlist[i]] = new EffectSound(effectlist[i]);
	}
	for (var i=0; i<musiclist.length; i++) {
		audio.music[musiclist[i]] = new MusicSound(musiclist[i]);
	}
}
