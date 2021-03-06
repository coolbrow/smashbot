exports.pattern = /^\/john\ *((?:\ +\w+)*)\ *$/;

exports.help = [{command: "/john", desc: "Generate a random john"}];

exports.run = function(send, args, store) {
  return send(generate(), {color: 'random'});
};

var prep = [
  "I lost because",
  "I only lost because",
  "They won because",
  "They only won because",
  "Chris only won because"
];

var subjects = [
  "my controller is",
  "the sun was",
  "my hands were",
  "everyone was",
  "the TV is",
  "the crowd was",
  "my opponent was",
  "my chair is",
  "his controller is",
  "Meta Knight is",
  "my brain is",
  "my 3DS is",
  "Nintendo was",
  "my eyes are",
  "the DLC is",
  "the music was",
  "Final Destination is",
  "Reggie Fils-Aim\u00e9 is",
  "the venue is",
  "my skills were",
  "the stream was",
  "Sakurai was",
  "Brawl is",
  "Melee is",
  "reddit is",
  "the ledge was",
  "my foot is",
  "the C-stick was",
  "my analogue stick is",
  "the USA is",
  "my IQ is",
  "the posts on Miiverse are",
  "tap jump was",
  "all 1540 matchups are",
  "Jigglypuff was",
  "I was",
  "PAC-MAN was",
  "Alex Strife is",
  "my scarf is",
  "Ganon is"
];

var problems = [
  "in my eyes",
  "broken",
  "laggy",
  "hacked",
  "too loud",
  "uncomfortable",
  "OP", 
  "fraudulent",
  "disturbing me",
  "making me SD",
  "upside-down",
  "violating the rules",
  "too smelly for me",
  "totally spooking me out",
  "unnecessarily rude",
  "making funny faces at me",
  "trash-talking mid-match",
  "running a company for 16 hours a day",
  "making excuses",
  "spamming projectiles",
  "not fair",
  "way better than my character",
  "speaking Japanese",
  "too bright",
  "nerfed",
  "garbage",
  "not good enough",
  "too small",
  "too big",
  "on a bad day",
  "sandbagging",
  "using custom moves",
  "reminding me of my ex",
  "really annoying",
  "tired",
  "a big gimmick",
  "kinda sweaty",
  "drunk",
  "only using one move",
  "not listening to me",
  "sleeping",
  "cheap",
  "terrible for my character",
  "rated a 7.8 on IGN",
  "using infinite combos",
  "taunting",
  "cheating",
  "different because of the update",
  "using glitches",
  "too hard to reach",
  "a timed match",
  "using better moves than me",
  "using motion controls",
  "sitting slightly closer to the screen",
  "not wearing his glasses",
  "sober",
  "using items",
  "not letting me grab him",
  "shielding too much",
  "air dodging",
  "rolling",
  "pausing mid-match",
  "saving replays",
  "ethically superior to me",
  "only using the A button",
  "only using the B button",
  "Reggie Fils-Aim\u00e9",
  "picking stages that I don't like",
  "bad and should feel bad",
  "low on batteries",
  "cold",
  "sticky",
  "blocking the screen",
  "walking in front of the screen",
  "tangling my controller cable",
  "incapable of melting steel beams",
  "too attractive",
  "too fast",
  "using an ugly alternative costume",
  "using counters too much",
  "spamming PK Fire",
  "my b",
  "really hard to remember",
  "a troll (troll)"
];

function getRandInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function generate() {
  var finalPrep = prep[getRandInt(0,prep.length-1)]
  var finalSubject = subjects[getRandInt(0,subjects.length-1)]
  var finalProblem = problems[getRandInt(0,problems.length-1)]

  var rand1 = Math.random();
  var rand2 = Math.random();

  return finalPrep + " " + finalSubject + " " +  finalProblem + ".";
}
