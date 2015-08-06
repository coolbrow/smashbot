module.exports = {
  pattern: /^\/time\ *((?:\ +\w+)*)\ *$/,
  color: "green",
  getResponse: function(args) {
    return getTimeString();
  }
};

var morningTime = getTime(18, 0).getTime();
var afternoonTime = getTime(22, 30).getTime();

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
  var morning = Math.ceil((morningTime - now) / 1000 / 60);
  var afternoon = Math.ceil((afternoonTime - now) / 1000 /60);
  if (morning < 0 && afternoon < 0) {
    return 1440 + Math.min(morning, afternoon);
  }
  if (morning > 0 && afternoon > 0) {
    return Math.min(morning, afternoon);
  }
  return Math.max(morning, afternoon);
}

function getTimeString() {
  var mins = minutesUntilSmash() % 60;
  var hours = Math.floor(minutesUntilSmash() / 60);
  var s = mins + ' MINUTES!'; 
  var hour = hours > 1 ? ' HOURS ' : ' HOUR ';
  if (hours > 0) s = hours + hour + s;
  return s;
}
