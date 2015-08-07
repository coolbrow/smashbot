var chrono = require('chrono-node');

module.exports = {
  pattern: /^\/time\ *((?:\ +\w+)*)\ *$/,
  getResponse: function(args, store, cb) {
    if (!args) {
      return cb(getTimeString(), { color: 'green' });
    }
    if (args[0] === 'add' && args[1]) {
      return addTime(store, parse(args[1]), cb);
    }
    if (args[0] === 'list') {
      return listTimes(store, cb);
    }
    if (args[0] === 'clear') {
      return clearTimes(store, cb);
    }
    return cb(getTimeString(), { color: 'green' });
  }
};

var LIST_KEY = 'times';

function addTime(store, time, cb) {
  if (!time) {
    return cb("Time could not be added");
  }
  var list = store.get(LIST_KEY);
  list.then(function(times) {
    if (!times) {
      times = [];
    }
    times.push(time);
    times.sort();
    var setPromise = store.set(LIST_KEY, times);
    setPromise.then(function(val) {
      listTimes(store, cb);
    });
  });
}

function listTimes(store, cb) {
  var list = store.get(LIST_KEY);
  list.then(function(times) {
    var result = '<ul>';
    if (times) {
      times.sort();
      times.forEach(function(time) {
        result += ('<li>' + formatTime(time) + '</li>');
      });
    }
    cb(result + '</ul>', {color : 'gray'});
  });
}

function clearTimes(store, cb) {
  store.set(LIST_KEY, []);
  cb("List Cleared", { color: 'red' });
}

function parse(timeStr) {
  var date = chrono.parseDate(timeStr);
  if (!date) return;
  return convertDate2(date);
}

function formatTime(date) {
  date = new Date(date);
  var hours = date.getHours();
  var mins = date.getMinutes();
  if (mins < 10) mins = "0" + mins;
  return hours + ":" + mins;
}

var morningTime = getTime(18, 0).getTime();
var afternoonTime = getTime(22, 30).getTime();

function convertDate2(date) {
  return new Date(Date.UTC(0, 0, 0, date.getHours(), date.getMinutes(), date.getSeconds()));
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
