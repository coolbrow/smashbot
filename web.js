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

function convertDate(date) {
	return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
}

function getTime(hour, minute) {
	var time = new Date();
	time.setHours(hour, minute, 0, 0);
	return convertDate(time);
}

function minutesUntilSmash() {
	var now = convertDate(new Date()).getTime();
	var morning = Math.ceil((getTime(18, 0).getTime() - now) / 1000 / 60);
	var afternoon = Math.ceil((getTime(22, 30).getTime() - now) / 1000 /60);
	if (morning < 0 && afternoon < 0) {
		return 1440 + Math.min(morning, afternoon);
	}
	if (morning > 0 && afternoon > 0) {
		return Math.min(morning, afternoon);
	}
	return Math.max(morning, afternoon);
}
 
addon.webhook('room_message', /^\/time$/, function *() {
  var mins = minutesUntilSmash() % 60;
  var hours = Math.floor(minutesUntilSmash() / 60);
  var s = mins + ' MINUTES!'; 
  var hour = hours > 1 ? ' HOURS ' : ' HOUR ';
  if (hours > 0) s = hours + hour + s;
  yield this.roomClient.sendNotification(s);
}); 
app.listen();
