var initial_region = 'room';
var initial_screen = 0;
var initial_pos = 200;
/*var initial_region = 'outside';
var initial_screen = 5;
var initial_pos = 400;*/

var content = {
	screens: {
		'room': [
			// 0 bedroom
			{interactions: [{from: 590, to: 1100, action: function() {
				dialog('email');
				// disable this interaction after clicking once
				content.screens['room'][0].interactions[0] = {from: -999, to: -999};
				}}],
			doors: [],
			steps: 'house'},
			// 1 kitchen
			{interactions: [],
			doors: [],
			steps: 'house'},
			// 2 hallway upstairs
			{interactions: [],
			doors: [{from: 363, to: 633, region: 'house', screen: 1, pos: 360}],
			steps: 'house'}
		],
		'house': [
			// 0 laundry room
			{interactions: [{from: 98, to: 308, action: function() {dialog('washingmachine');}}],
			doors: [],
			steps: 'floor'},
			// 1 hallway downstairs
			{interactions: [],
			doors: [{from: 237, to: 480, region: 'room', screen: 2, pos: 500},
				{from: 880, to: 1000, region: 'outside', screen: 2, pos: 325}],
			steps: 'floor'}
		],
		'outside': [
			// 0 train station
			{interactions: [],
			doors: [],
			steps: 'outside'},
			// 1
			{interactions: [],
			doors: [],
			steps: 'outside'},
			// 2 entrance to own house
			{interactions: [],
			doors: [{from: 200, to: 455, region: 'house', screen: 1, pos: 820}],
			steps: 'outside'},
			// 3
			{interactions: [],
			doors: [],
			steps: 'outside'},
			// 4 Count Burger
			{interactions: [{from: 562, to: 832, action: function() {dialog('countburger');}}],
			doors: [],
			steps: 'outside'},
			// 5 Alberto's house
			{interactions: [],
			doors: [{from: 405, to: 658, region: 'alberto', screen: 0, pos: 135}],
			steps: 'outside'},
			// 6 Error bar
			{interactions: [],
			doors: [{from: 430, to: 680, region: 'errorbar', screen: 0, pos: 160}],
			steps: 'outside'},
			// 7
			{interactions: [],
			doors: [],
			steps: 'outside'},
			// 8 library
			{interactions: [],
			doors: [{from: 240, to: 630, region: 'library', screen: 0, pos: 210}],
			steps: 'outside'},
			// 9
			{interactions: [],
			doors: [],
			steps: 'park'},
			// 10 Tuner
			{interactions: [{from: 158, to: 278, action: function() {
				dialog('tuner');
				//Internet connection at home dies here:
				content.screens['room'][0].interactions[0] = {from: 590, to: 800, action: function() {dialog('internet_dead');}};
			}}],
			doors: [],
			steps: 'park'},
			// 11 Mira
			{interactions: [{from: 869, to: 935, action: function() {dialog('mira');}}],
			doors: [],
			steps: 'park'}
		],
		'alberto': [
			{interactions: [{from: 704, to: 828, action: function() {dialog('alberto_before');}}],
			doors: [{from: 0, to: 70, region: 'outside', screen: 5, pos: 520}],
			steps: 'wood'}
		],
		'errorbar': [
			{interactions: [{from: 615, to: 710, action: function() {dialog('old_greg');}}],
			doors: [{from: 0, to: 85, region: 'outside', screen: 6, pos: 550}],
			steps: 'wood'}
		],
		'library': [
			{interactions: [],
			doors: [{from: 0, to: 100, region: 'outside', screen: 8, pos: 430}],
			steps: 'wood'},
			{interactions: [],
			doors: [],
			steps: 'wood'},
			{interactions: [],
			doors: [],
			steps: 'wood'},
			{interactions: [],
			doors: [],
			steps: 'wood'}
		]
	},
	dialogs: {
		'email': {image: 'email', text: 'New e-mail from Dr. Brköwsky!', next: 'email_body'},
		'email_body': {image: 'email', text: 'Dear Mr. Kolofar,<br><br>It came to my ears that you are about to publish a scientific article, in which you cite one of my publications. Although I am glad to hear about this, it seems to me that you are having some major misconceptions about the main ideas of my work!', next: 'email_body2'},
		'email_body2': {image: 'email', text: 'I strongly recommend you to correct these errors in your paper before submitting it! You might find clarification in my book from 1995 about this subject.<br><br>Best regards,<br>Dr. Brköwsky', next: 'email_ren'},
		'email_ren': {image: 'ren', text: "Hmm that's strange! How does this guy know about my draft? Where did he get my e-mail address from? There's something really weird going on. I better go to the library to have a look in that book he mentioned."},
		
		'washingmachine': {image: 'ren', text: 'Shit!! The washing machine ran out of money! Now the door is locked and all my clothes are inside. I should get another coin to let it finish.'},
		
		'countburger': {image: 'ren', text: 'Wow, even count burger is closed on Sunday. People are really taking their day off seriously around here.'},
		
		'alberto_before': {image: 'alberto', text: "Ren Kolofar! Long time no see! How are you doing?", next: 'alberto_before2'},
		'alberto_before2': {image: 'ren', text: "Ciao Alberto! I'm doing fine! And you?", next: 'alberto_before3'},
		'alberto_before3': {image: 'alberto', text: "Very good too! This is the first time this year I can enjoy a free Sunday! Every week some people were bothering me. This is a tough job.", next: 'alberto_before4'},
		'alberto_before4': {image: 'ren', text: "Yeah, who do you tell. I wish I had a free Sunday today but it's more like the busiest ever. Time is running out and I'm in serious trouble. Well, I'll catch you later, ALberto!", next: 'alberto_before5'},
		'alberto_before5': {image: 'alberto', text: "Ok Ren. Don't get crazy with your science stuff and don't forget to enjoy life a bit! See you later."},
		
		'tuner': {image: 'ren', text: 'Hi Tuner!', next:'tuner1'},
		'tuner1': {image: 'tuner', text: "Hey R.K.! Maan, what's up?", next:'tuner_main'},
		'tuner_main': {image: 'ren', choice: [{text: "Nice day, isn't it?", next:'tuner_colors'}, {text: "Hey do you have some small change?", next:'tuner_coin'}, {text: "I have a problem: Do you know how I could enter the library on Sunday?", next:'tuner_library'}, {text: "Hi, I'm selling these fine leather jackets.", next:'tuner_jacket'}, {text: "Alright, see you later.", next: 'tuner_end'}]},
		'tuner_colors': {image: 'tuner', text: "Really nice man! Look at all those colors!", next:'tuner_main'},
		'tuner_coin': {image: 'ren', text: "My washing machine ran out of money and got stuck!", next:'tuner_coin2'},
		'tuner_coin2': {image: 'tuner', text: "Ah man, I know, I owe you 2 BTC, I didn't forget that!! Times are tough these days, you know! Really sorry man! I'll pay you back very soon, I promise!", next:'tuner_coin3'},
		'tuner_coin3': {image: 'ren', text: "No, don't worry about that. I just need a coin right now for the washing machine!", next:'tuner_coin4'},
		'tuner_coin4': {image: 'tuner', text: "Nah sorry, I'm totally broke. Couldn't even buy a Falafel over at Star Kebab!", next:'tuner_coin5'},
		'tuner_coin5': {image: 'tuner', text: "But man, there's something you could try. Do you know Old Greg? He always hangs out at Error Bar. Drunk the whole day. Booze isn't good for you, I tell ya!", next:'tuner_coin6'},
		'tuner_coin6': {image: 'tuner', text: "He really loves to play that coin bouncing game, you know? But he totally sucks at it, haha! Maybe you can challenge him?", next:'tuner_coin7'},
		'tuner_coin7': {image: 'ren', text: "Sounds like a plan! Thanks Tuner, you're my man! But don't forget the BTC, right?", next:'tuner_coin8'},
		'tuner_coin8': {image: 'tuner', text: "Sure thing, R.K.! I'll get it tomorrow, I promise!!", next:'tuner_main'},
		'tuner_library': {image: 'tuner', text: "That's easy man. Just tell the librarian you needa get some stuff about Australian Waterfalls. He'll open it for you any time.", next:'tuner_library2'},
		'tuner_library2': {image: 'ren', text: "Cool. Where can I find this guy?", next:'tuner_library3'},
		'tuner_library3': {image: 'tuner', text: "You know Alberto, right? Isn't he a good friend of yours?", next:'tuner_library4'},
		'tuner_library4': {image: 'ren', text: "Alberto is the librarian?!?", next:'tuner_library5'},
		'tuner_library5': {image: 'tuner', text: "I tell you man!", next:'tuner_library6'},
		'tuner_library6': {image: 'ren', text: "I didn't know that! Thanks a lot tuner!! What would this city do without you!", next:'tuner_main'},
		'tuner_jacket': {image: 'tuner', text: "Ah c'mon R.K., that joke is older than LeChuck's beard, haha.", next:'tuner_jacket2'},
		'tuner_jacket2': {image: 'ren', text: "Ok ok Tuner. You're the boss on classic adventure games!", next:'tuner_main'},
		'tuner_end': {image: 'tuner', text: "See ya man. Bring some weed next time!"},
		
		'old_greg': {image: 'greg', text: 'What do you want?'},
		
		'mira': {image: 'ren', text: 'Hi Mira! Enjoying the sun?', next:'mira1'},
		'mira1': {image: 'mira', text: "Hi Ren! Yes, it's lovely, isn't it?", next:'mira_main'},
		'mira_main': {image: 'ren', choice: [{text: "How's your work going?", next:'mira_work'}, {text: "Well, i got some stuff to do. See you later!", next:"mira_end"}]},
		'mira_work': {image: 'mira', text: "It's going well! My conference paper got accepted last week! How's your work?", next:'mira_work2'},
		'mira_work2': {image: 'ren', text: "Ah..... it's ok. Sort of. I have a deadline tonight and need to fix an important thing. Time is running out.", next:'mira_work3'},
		'mira_work3': {image: 'mira', text: "Oh I don't want to keep you busy then!", next:'mira_work4'},
		'mira_work4': {image: 'ren', text: "Ah, no problem. I always enjoy talking to you!", next:'mira_main'},
		'mira_end': {image: 'mira', text: 'Bye Ren!'},
		
		'internet_dead': {image: 'ren', text: "What's going on here? The internet connection is dead? Oh shit, maybe I should've paid my internet bill more regularly! How can I finish my paper now? I guess I need to take the train to the Institute!"}
	}
};


function dialog(id) {
	gameenv.openDialog(id);
}

