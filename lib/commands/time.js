exports.pattern = /^\/time\ *((?:\ +\w+)*)\ *$/;

exports.help = 
[{command: '/time', desc: 'Get time until next match'},
{command: '/time add <i><b>time</b></i>', desc: 'Add a time'},
{command: '/time list', desc: 'List all match times'},
{command: '/time remove <i><b>item</b></i>', desc: 'Remove time'},
{command: '/time postpone <i><b>mins</b></i>', desc: 'Postpone next time by <i><b>mins</b></i> minutes'}];

exports.run = function(send, args, store) {
  if (!args) {
    return getTimeString(store, send);
  } else if (args[0] === 'add' && args[1]) {
    return addTime(store, parse(args[1]), send);
  } else if (args[0] === 'list') {
    return listTimes(store, send);
  } else if (args[0] === 'remove' && args[1]) {
    return removeTime(store, parseInt(args[1]), send);
  } else if (args[0] === 'clear') {
    return clearTimes(store, send);
  } else if (args[0] === 'postpone' && args[1]) {
    return postponeTime(store, parseInt(args[1]), send);
  } else {
    return getTimeString(store, send);
  }
};

var time = require('time');
var chrono = require('chrono-node');

var LIST_KEY = 'times';
var POSTPONE_KEY = 'postpone';

function addTime(store, time, send) {
  return function *() {
    if (!time) {
      yield send("Time could not be added");
    } else {
      var times = yield store.get(LIST_KEY);
      if (!times) {
        times = [];
      }
      times.push(time);
      times.sort();
      yield store.set(LIST_KEY, times);
      yield listTimes(store, send);
    }
  }
}

function listTimes(store, send) {
  return function *() {
    var times = yield store.get(LIST_KEY);
    if (times) {
      var postpone = yield store.get(POSTPONE_KEY);
      if (!postpone || postpone.time < getNow()) {
        postpone = {};
        store.set(POSTPONE_KEY, postpone);
      }
      var result = '<b>Match Times:</b></br><ol>';
      times.sort();
      times.forEach(function(time) {
        var postponeString = '';
        if (time == postpone.time) {
          postponeString += ' (Postponed for ' + postpone.minutes + ' minutes)';
        }
        result += ('<li>' + formatTime(time) + postponeString + '</li>');
      });
      yield send(result + '</ol>', {color : 'gray'});
    } else {
      yield send('No match times set. Use /time add');
    }
  }
}

function removeTime(store, pos, send) {
  return function *() {
    var times = yield store.get(LIST_KEY);
    if (times && pos && pos > 0 && pos <= times.length) {
      times.sort();
      times.splice(pos-1, 1);
      yield store.set(LIST_KEY, times);
      yield listTimes(store, send);
    } else {
      yield send("Could not remove a time from the list");
    }
  }
}

function clearTimes(store, send) {
  return function *() {
    store.set(LIST_KEY, []);
    store.set(POSTPONE_KEY, {});
    yield send("List Cleared", { color: 'red' });
  }
}

function postponeTime(store, minutes, send) {
  return function *() {
    if (!minutes) {
      yield send("Could not parse number of minutes");
    } else {
      var times = yield store.get(LIST_KEY);
      var nextTime;
      var now = getNow();
      times.sort();
      times.some(function(time) {
        nextTime = time;
        var diff = new Date(new Date(time) - now);
        return diff.getTime() > 0;
      });
      store.set(POSTPONE_KEY, {
        minutes: minutes,
        time: nextTime
      });
      yield send("Postponed " + formatTime(nextTime) + ' match by ' + minutes + ' minutes');
    }
  }
}

function parse(timeStr) {
  var date = chrono.parseDate(timeStr);
  if (!date) return;
  return normalizeDate(date);
}

function formatTime(date) {
  date = new Date(date);
  var time = 'am';
  var hours = date.getHours();
  if (hours >= 12) {
    time = 'pm';
    hours -= 12;
  }
  if (hours === 0) hours += 12;
  var mins = date.getMinutes();
  if (mins < 10) mins = "0" + mins;
  return hours + ":" + mins + time;
}

function normalizeDate(date) {
  return new Date(0, 0, 0, date.getHours(), date.getMinutes(), date.getSeconds());
}

function getNow() {
  var now = new time.Date();
  now.setTimezone('America/Los_Angeles');
  now = normalizeDate(now);
  return now;
}

function getTimeString(store, send) {
  return function *() {
    var now = getNow();
    var times = yield store.get(LIST_KEY);
    if (times) {
      times.sort();
      var postpone = yield store.get(POSTPONE_KEY);
      if (!postpone) {
        postpone = {};
      }
      var hasTimes = times.some(function(time) {
        var ppMilli = time == postpone.time ? postpone.minutes * 60 * 1000 : 0;
        var diffTime = new Date(new Date(time) - now + ppMilli);
        if (diffTime.getTime() + ppMilli > 0) {
          var mins = Math.ceil(diffTime.getTime() / 1000 / 60);
          if (postpone.time != time) {
            store.set(POSTPONE_KEY, {});
          }
          var hours = Math.floor(mins / 60);
          var mins = mins % 60;
          var s = mins + ' MINUTES!'; 
          var hour = hours > 1 ? ' HOURS ' : ' HOUR ';
          if (hours > 0) s = hours + hour + s;
          send(s, {color: 'green'}); 
          return true;
        }
        return false;
      });
      if (!hasTimes) {
        store.set(POSTPONE_KEY, {});
        yield send("No more matches today (sadpanda)", {color: 'yellow', message_format: 'text'});
      }
    } else {
      yield send("You should probably add a time first!");
    }
  }
}
