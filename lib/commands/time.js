var time = require('time');
var chrono = require('chrono-node');

module.exports = {
  pattern: /^\/time\ *((?:\ +\w+)*)\ *$/,
  getResponse: function(args, store, cb) {
    if (!args) {
      return getTimeString(store, cb);
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
    return getTimeString(store, cb);
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


function getTimeString(store, cb) {
  var now = new time.Date();
  now.setTimezone('America/Los_Angeles');
  now = normalizeDate(now);
  var list = store.get(LIST_KEY);
  list.then(function(times) {
    if (times) {
      times.sort();
      var hasTimes = times.some(function(time) {
        var diffTime = new Date(new Date(time) - now);
        if (diffTime.getTime() > 0) {
          var mins = Math.ceil(diffTime.getTime() / 1000 / 60);
          var hours = Math.floor(mins / 60);
          var mins = mins % 60;
          var s = mins + ' MINUTES!'; 
          var hour = hours > 1 ? ' HOURS ' : ' HOUR ';
          if (hours > 0) s = hours + hour + s;
          cb(s, {color: 'green'}); 
          return true;
        }
        return false;
      });
      if (!hasTimes) cb("No more matches today (sadpanda)", {color: 'yellow'});
    } else {
      cb("You should probably add a time first!");
    }
  });
}
