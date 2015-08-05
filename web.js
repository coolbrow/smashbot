var ack = require('ac-koa').require('hipchat');
var pkg = require('./package.json');
var app = ack(pkg);
var time = require('./time.js');
var john = require('./john.js');

var addon = app.addon()
  .hipchat()
  .allowRoom(true)
  .scopes('send_notification');

if (process.env.DEV_KEY) {
  addon.key(process.env.DEV_KEY);
}

addon.webhook('room_message', /^\/time$/, function *() {
  yield this.roomClient.sendNotification(time.getTimeUntilSmash());
}); 

addon.webhook('room_message', /^\/john$/, function *() {
  yield this.roomClient.sendNotification(john.getRandomJohn());
}); 

app.listen();
