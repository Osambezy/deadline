var initial_region = 'room';
var initial_screen = 0;
var initial_pos = 200;

var content = {
	screens: {
		'room': [
			// 0 bedroom
			{interactions: [
				{from: 590, to: 1100, text: "Check computer", condition: ()=>check_var('email_received', undefined), action: ()=>dialog('email')},
				{from: 590, to: 803, text: "Check computer", condition: ()=>(check_var('book_found', true) && check_var('internet_dead', undefined)), action: ()=>dialog('internet_dead')},
				{from: 590, to: 803, text: "Check computer", condition: ()=>(check_var('book_found', true) && check_var('internet_dead', true)), action: ()=>dialog('internet_dead_again')},
			],
			steps: 'house'},
			// 1 kitchen
			{interactions: [],
			steps: 'house'},
			// 2 hallway upstairs
			{interactions: [{from: 363, to: 633, text: "Go down", action: ()=>transition('house', 1, 360)}],
			steps: 'house'}
		],
		'house': [
			// 0 laundry room
			{interactions: [
				{from: 98, to: 308, text: "Check laundry", condition: ()=>check_var('coin', undefined), action: ()=>dialog('washingmachine')},
				{from: 98, to: 308, text: "Put coin and get laundry", condition: ()=>(check_var('coin', true) && check_var('ticket', undefined)),
					action: ()=>dialog('washingmachine_coin')}],
			steps: 'floor'},
			// 1 hallway downstairs
			{interactions: [
				{from: 237, to: 480, text: "Go up", action: ()=>transition('room', 2, 500)},
				{from: 880, to: 1000, text: "Leave house", action: ()=>transition('outside', 2, 325)}
				],
			steps: 'floor'}
		],
		'outside': [
			// 0 train station
			{interactions: [
				{from: 128, to: 247, text: "Look at", action: ()=>dialog('ticketmachine')},
				{from: 485, to: 717, text: "Look at", condition: ()=>(check_var('internet_dead', undefined) && check_var('book_found', undefined)), action: ()=>dialog('traingate_first')},
				{from: 485, to: 717, text: "Look at", condition: ()=>(check_var('internet_dead', undefined) && check_var('book_found', true)), action: ()=>dialog('traingate_first_book')},
				{from: 485, to: 717, text: "Take train", condition: ()=>(check_var('internet_dead', true) && check_var('ticket', undefined)), action: ()=>dialog('traingate_noticket')},
				{from: 485, to: 717, text: "Take train", condition: ()=>(check_var('internet_dead', true) && check_var('ticket', true)), action: end}
				],
			steps: 'outside'},
			// 1
			{interactions: [],
			steps: 'outside'},
			// 2 entrance to own house
			{interactions: [{from: 200, to: 455, text: "Enter your home", action: ()=>transition('house', 1, 820)}],
			steps: 'outside'},
			// 3
			{interactions: [],
			steps: 'outside'},
			// 4 Count Burger
			{interactions: [{from: 562, to: 832, text: "Look at", action: ()=>dialog('countburger')}],
			steps: 'outside'},
			// 5 Alberto's house
			{interactions: [
				{from: 405, to: 658, text: "Enter", condition: ()=>check_var('key_obtained', true), action: ()=>dialog('alberto_later')},
				{from: 405, to: 658, text: "Enter", condition: ()=>check_var('key_obtained', undefined), action: ()=>transition('alberto', 0, 135)}
				],
			steps: 'outside'},
			// 6 Error bar
			{interactions: [{from: 430, to: 680, text: "Enter", action: ()=>transition('errorbar', 0, 160)}],
			steps: 'outside'},
			// 7
			{interactions: [],
			steps: 'outside'},
			// 8 library
			{interactions: [],
			interactions: [
				{from: 240, to: 630, text: "Enter", condition: ()=>(check_var('key_obtained', undefined) && check_var('alberto_info', undefined)), action: ()=>dialog('library_locked')},
				{from: 240, to: 630, text: "Enter", condition: ()=>(check_var('key_obtained', undefined) && check_var('alberto_info', true)), action: ()=>dialog('library_locked_alberto')},
				{from: 240, to: 630, text: "Enter", condition: ()=>(check_var('key_obtained', true) && check_var('book_found', undefined)), action: ()=>dialog('library_open')}
				],
			steps: 'outside'},
			// 9
			{interactions: [],
			steps: 'park'},
			// 10 Tuner
			{interactions: [{from: 158, to: 278, text: "Talk", action: ()=>dialog('tuner')}],
			steps: 'park'},
			// 11 Mira
			{interactions: [{from: 869, to: 935, text: "Talk", action: ()=>dialog('mira')}],
			steps: 'park'}
		],
		'alberto': [
			{interactions: [
				{from: 704, to: 828, text: "Talk", condition: ()=>check_var('alberto_talked', undefined), action: ()=>dialog('alberto')},
				{from: 704, to: 828, text: "Talk", condition: ()=>check_var('alberto_talked', true), action: ()=>dialog('alberto_main')},
				{from: 0, to: 70, text: "Leave", action: ()=>transition('outside', 5, 520)}
				],
			steps: 'wood'}
		],
		'errorbar': [
			{interactions: [
				{from: 615, to: 710, text: "Talk", action: ()=>dialog('old_greg')},
				{from: 0, to: 85, text: "Leave", action: ()=>transition('outside', 6, 550)}],
			steps: 'wood',
			music: 'music02'}
		],
		'library': [
			// Library entrance
			{interactions: [{from: 0, to: 100, text: "Leave", action: ()=>transition('outside', 8, 430)}],
			steps: 'wood'},
			{interactions: [],
			steps: 'wood'},
			{interactions: [],
			steps: 'wood'},
			// Bookshelf
			{interactions: [{from: 790, to: 858, text: "Pick up", condition: ()=>check_var('book_found', undefined), action: ()=>dialog('library_book')}],
			steps: 'wood'}
		]
	},
	dialogs: {
		'email': {image: 'email', text: 'New e-mail from Dr. Brköwsky!', next: 'email_body'},
		'email_body': {image: 'email', text: 'Dear Mr. Kolofar,<br/><br/>It came to my ears that you are about to publish a scientific article, in which you cite one of my publications. Although I am glad to hear about this, it seems to me that you are having some major misconceptions about the main ideas of my work!', next: 'email_body2'},
		'email_body2': {image: 'email', text: 'I strongly recommend you to correct these errors in your paper before submitting it! You might find clarification in my book from 1995 about this subject.<br><br>Best regards,<br>Dr. Brköwsky', next: 'email_ren', action: ()=>set_var('email_received', true)},
		'email_ren': {image: 'ren', text: "Hmm that's strange! How does this guy know about my draft? Where did he get my e-mail address from? There's something really weird going on. I better go to the library to have a look in that book he mentioned."},

		'internet_dead': {image: 'ren', text: "Ok, let's see...", next:'internet_dead2'},
		'internet_dead2': {image: 'ren', text: "Why isn't it loading?", next:'internet_dead3'},
		'internet_dead3': {image: 'ren', text: "Hm, it seems that the internet connection is dead. Oh shit, maybe I should've paid my internet bills more regularly!", next:'internet_dead4'},
		'internet_dead4': {image: 'ren', text: "But I really need to know what's up with this Dr. Brköwsky! Erm, I guess the only way now is to take the train to the Institute. I can use my office computer there.", action: ()=>set_var('internet_dead', true)},
		'internet_dead_again': {image: 'ren', text: "Without internet I can't do much here. I have to go to the Institute."},

		'washingmachine': {image: 'ren', text: 'Shit!! The washing machine ran out of money! Now the door is locked and all my clothes are inside. I should get another coin to let it finish.', action: ()=>set_var('machine_stuck', true)},
		'washingmachine_coin': {image: 'ren', text: "Ok, this coin should do it.<br><br>Aah, here are the pants with my train ticket! Ugh, completely wet. Alright, I'll bring this with me.", action: ()=>set_var('ticket', true)},

		'traingate_first': {image: 'ren', text: "Hm, it's Sunday but still I feel like I must go to the office. What a life... Anyway, I should go to the library and find the book from this Brköwsky guy!"},
		'traingate_first_book': {image: 'ren', text: "Hm, it's Sunday but still I feel like I must go to the office. What a life... Anyway, I need to go home and find out more about this Dr. Brköwsky! This really begins to scare me!"},
		'traingate_noticket': {image: 'ren', text: "The train's already here. Damn, I didn't bring my train ticket, it must be in the other pants. I'll better go grab it quickly."},

		'ticketmachine': {image: 'ren', text: 'They raised the prices. Again!! Who should be able to afford this? Maybe I should start living in the office.'},

		'countburger': {image: 'ren', text: 'Wow, even count burger is closed on Sunday. People are really taking their day off seriously around here.'},

		'alberto': {image: 'alberto', text: "Ren Kolofar! Long time no see! How are you doing?", next: 'alberto2'},
		'alberto2': {image: 'ren', text: "Ciao Alberto! I'm doing fine! And you?", next: 'alberto3'},
		'alberto3': {image: 'alberto', text: "Very good too! This is the first time this year I can enjoy a free Sunday! Every week some people were bothering me. This is a tough job.", next: 'alberto4'},
		'alberto4': {image: 'ren', text: "Yeah, who do you tell. I wish I had a free Sunday today but it's more like the busiest ever. Time is running out and I'm in serious trouble.", next: 'alberto5'},
		'alberto5': {image: 'alberto', text: "Ok Ren. Don't get crazy with your science stuff and don't forget to enjoy life a bit!", action: ()=>set_var('alberto_talked', true), next: 'alberto_main'},
		'alberto_main': {image: 'ren', choice: [
			{text: "I wanted to ask you something about real-time strategy games.", condition: ()=>(check_var('alberto_info', true) && check_var('key_obtained', undefined)), next:'alberto_rts'},
			{text: "Well, I'll catch you later, Alberto!", next:'alberto_end'},
			]},
		'alberto_rts': {image: 'alberto', text: "Oh! RTS games! They are awesome! You came to the right place, Ren! What do you need?", next: 'alberto_rts2'},
		'alberto_rts2': {image: 'ren', text: "Uhm, I'm currently writing my own RTS game and wanted to ask you something.", next: 'alberto_rts3'},
		'alberto_rts3': {image: 'alberto', text: "Wow, how cool! What's the theme gonna be like?", next: 'alberto_rts4'},
		'alberto_rts4': {image: 'ren', text: "Hm, well, I... don't really have a clear idea yet. Hey, I was thinking that maybe I could find some additional material in the library. Do you know how I could get in there?", next: 'alberto_rts5'},
		'alberto_rts5': {image: 'alberto', text: "It's open every weekday!", next: 'alberto_rts6'},
		'alberto_rts6': {image: 'ren', text: "Ah, I meant if I could access it right now?", next: 'alberto_rts7'},
		'alberto_rts7': {image: 'alberto', text: "Right now?? Oh, that's difficult. But then again... man, I really like that idea of your strategy game! You know what? Here's the library key. Go and get what you need!", action: ()=>set_var('key_obtained', true), next: 'alberto_rts8'},
		'alberto_rts8': {image: 'ren', text: "Thanks, Alberto! I owe you one!", next: 'alberto_rts9'},
		'alberto_rts9': {image: 'alberto', text: "Let me know when your game is done!", next: 'alberto_rts10'},
		'alberto_rts10': {image: 'ren', text: "Sure!"},
		
		'alberto_end': {image: 'alberto', text: "See you later!"},

		'alberto_later': {image: 'ren', text: "When I'm done with all this stuff, I'd like come back and play some strategy games with Alberto!!"},

		'library_locked': {image: 'ren', text: "Yeah, it's Sunday. Of course the library is closed too. Who could have thought of that. Hmmm, there must be a way in. In this city everything works if you know the right people."},
		'library_locked_alberto': {image: 'ren', text: "Tuner said that I could get the library key from Alberto, if I ask him about real-time strategy games. Tuner really knows the tricks!"},
		'library_open': {image: 'ren', text: "Hah, it works! Alberto, you're the man!", next: ()=>transition('library', 0, 210)},
		'library_book': {image: 'ren', text: "Ah, here we go!<br/><br/>Artificial Intelligence and Embodiment<br/>by Antimon Brköwsky<br/>1995", action: ()=>set_var('book_found', true), next: 'library_book2'},
		'library_book2': {image: 'ren', text: "*cough* There's a lot of dust on it! Ok, I guess I'll take that home and have a look at it.", next: ()=>setTimeout(()=>dialog('library_book3'), 2000)},
		'library_book3': {image: 'ren', text: "Wait a second, there's something else. Looks like an old newspaper.", next: 'library_book4'},
		'library_book4': {image: 'ren', text: "The headline says: Dr. Brköwsky found dead! Whoa, what is going on here? Brköwsky is dead? How could he have sent me an e-mail? And how did he know about my work? This is creepy!", next: 'library_book5'},
		'library_book5': {image: 'ren', text: "Let's see.... hmmmmm.... the article says that the circumstances of his death were never fully clarified. This is getting weirder and weirder!", next: 'library_book6'},
		'library_book6': {image: 'ren', text: "I'll better go home and try to find out more about this Brköwsky! There must be something online about him. Maybe there is more in the e-mail that he sent me."},

		'tuner': {image: 'ren', text: 'Hi Tuner!', next:'tuner1'},
		'tuner1': {image: 'tuner', text: "Hey R.K.! Maan, what's up?", next:'tuner_main'},
		'tuner_main': {image: 'ren', choice: [
			{text: "Nice day, isn't it?", next:'tuner_colors'},
			{text: "Hey do you have some small change?", condition: ()=>(check_var('greg_info', undefined) && check_var('machine_stuck', true)), next:'tuner_coin'},
			{text: "I have a problem: Do you know how I could enter the library on Sunday?", condition: ()=>check_var('alberto_info', undefined), next:'tuner_library'},
			{text: "Hi, I'm selling these fine leather jackets.", next:'tuner_jacket'},
			{text: "Alright, see you later.", next: 'tuner_end'}
			]},
		'tuner_colors': {image: 'tuner', text: "Really nice man! Look at all those colors!", next:'tuner_main'},
		'tuner_coin': {image: 'ren', text: "My washing machine ran out of money and got stuck!", next:'tuner_coin2'},
		'tuner_coin2': {image: 'tuner', text: "Ah man, I know, I owe you 2 BTC, I didn't forget that!! Times are tough these days, you know! Really sorry man! I'll pay you back very soon, I promise!", next:'tuner_coin3'},
		'tuner_coin3': {image: 'ren', text: "No, don't worry about that. I just need a coin right now for the washing machine!", next:'tuner_coin4'},
		'tuner_coin4': {image: 'tuner', text: "Nah sorry, I'm totally broke. Couldn't even buy a Falafel over at the Kebab place!", next:'tuner_coin5'},
		'tuner_coin5': {image: 'tuner', text: "But man, there's something you could try. Do you know Old Greg? He always hangs out at Error Bar. Drunk the whole day. Booze ain't good for you, I tell ya!", next:'tuner_coin6'},
		'tuner_coin6': {image: 'tuner', text: "He really loves to play that coin bouncing game, you know? But he totally sucks at it, haha! Maybe you can challenge him?", action: ()=>set_var('greg_info', true), next:'tuner_coin7'},
		'tuner_coin7': {image: 'ren', text: "Sounds like a plan! Thanks Tuner, you're my man! But don't forget the BTC, right?", next:'tuner_coin8'},
		'tuner_coin8': {image: 'tuner', text: "Sure thing, R.K.! I'll get it tomorrow, I promise!!", next:'tuner_main'},
		'tuner_library': {image: 'tuner', text: "That's easy man. Just go to the librarian and start a conversation about real-time strategy games. He's crazy about that stuff. If you get him in the mood, he will do anything you ask.", next:'tuner_library2'},
		'tuner_library2': {image: 'ren', text: "Ok, that's good to know! Where can I find this guy?", next:'tuner_library3'},
		'tuner_library3': {image: 'tuner', text: "You know Alberto, right? Isn't he a good friend of yours?", next:'tuner_library4'},
		'tuner_library4': {image: 'ren', text: "Alberto is the librarian?!?", next:'tuner_library5'},
		'tuner_library5': {image: 'tuner', text: "I tell you man!", action: ()=>set_var('alberto_info', true), next:'tuner_library6'},
		'tuner_library6': {image: 'ren', text: "I didn't know that! Thanks a lot tuner!! What would this city do without you!", next:'tuner_main'},
		'tuner_jacket': {image: 'tuner', text: "Ah c'mon R.K., that joke is older than LeChuck's beard, haha.", next:'tuner_jacket2'},
		'tuner_jacket2': {image: 'ren', text: "Ok ok Tuner. You're the boss on classic adventure games!", next:'tuner_main'},
		'tuner_end': {image: 'tuner', text: "See ya man. Bring some weed next time!"},

		'old_greg': {image: 'greg', text: 'What do you want?', next: 'old_greg1'},
		'old_greg1': {image: 'ren', choice: [
			{text: "Hi! How are you doing?", next:'old_greg2'},
			{text: "You must be Greg, right?", condition: ()=>(check_var('greg_info', true) && check_var('coin', undefined)), next:'old_greg_coin'},
			{text: "Eh, sorry to bother you."}
			]},
		'old_greg2': {image: 'greg', text: "Leave an old man in peace, won't ya?"},
		'old_greg_coin': {image: 'greg', text: "That's me!", next: 'old_greg_coin1'},
		'old_greg_coin1': {image: 'ren', text: "Greg, I bet you can't bounce this coin such that it lands in the glass over there!", next: 'old_greg_coin2'},
		'old_greg_coin2': {image: 'greg', text: "Ahahahargh, are you kidding me, boy? You wanna challenge me? Well, all right! You go first!", next: ()=>coingame(()=>dialog('old_greg_coin3'))},
		'old_greg_coin3': {image: 'greg', text: "Ok, you win! Take it and leave me alone!", action: ()=>set_var('coin', true)},

		'mira': {image: 'ren', text: 'Hi Mira! Enjoying the sun?', next:'mira1'},
		'mira1': {image: 'mira', text: "Hi Ren! Yes, it's lovely, isn't it?", next:'mira_main'},
		'mira_main': {image: 'ren', choice: [{text: "How's your work going?", next:'mira_work'}, {text: "Well, i got some stuff to do. See you later!", next:"mira_end"}]},
		'mira_work': {image: 'mira', text: "It's going well! My conference paper got accepted last week! How's your work?", next:'mira_work2'},
		'mira_work2': {image: 'ren', text: "Ah..... it's ok. Sort of. I have a deadline tonight and need to fix an important thing. Time is running out.", next:'mira_work3'},
		'mira_work3': {image: 'mira', text: "Oh I don't want to keep you busy then!", next:'mira_work4'},
		'mira_work4': {image: 'ren', text: "Ah, no problem. I always enjoy talking to you!", next:'mira_main'},
		'mira_end': {image: 'mira', text: 'Bye Ren!'},
	}
};

