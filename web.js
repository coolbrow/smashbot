var commander = require('./lib/commander');

var ack = require('ac-koa').require('hipchat');
var pkg = require('./package.json');
var app = ack(pkg);

var addon = app.addon()
  .hipchat()
  .allowRoom(true)
  .scopes('send_notification');

if (process.env.DEV_KEY) {
  addon.key(process.env.DEV_KEY);
}

addon.webhook('room_message', commander.pattern, function *() {
  yield commander.onCommand;
}); 

app.listen();
