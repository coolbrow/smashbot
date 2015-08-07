exports.pattern = /^\/time\ *((?:\ +\w+)*)\ *$/;

exports.run = function(send, args, store) {
  if (!args) {
    getTimeString(store, send);
  } else if (args[0] === 'add' && args[1]) {
    addTime(store, parse(args[1]), send);
  } else if (args[0] === 'list') {
    listTimes(store, send);
  } else if (args[0] === 'remove' && args[1]) {
    removeTime(store, parseInt(args[1]), send);
  } else if (args[0] === 'clear') {
    clearTimes(store, send);
  } else {
    getTimeString(store, send);
  }
};

var time = require('time');
var chrono = require('chrono-node');

var LIST_KEY = 'times';

function addTime(store, time, send) {
  if (!time) {
    return send("Time could not be added");
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
      listTimes(store, send);
    });
  });
}

function listTimes(store, send) {
  var list = store.get(LIST_KEY);
  list.then(function(times) {
    var result = '<b>Match Times:</b></br><ol>';
    if (times) {
      times.sort();
      times.forEach(function(time) {
        result += ('<li>' + formatTime(time) + '</li>');
      });
    }
    send(result + '</ol>', {color : 'gray'});
  });
}

function removeTime(store, pos, send) {
  var list = store.get(LIST_KEY);
  list.then(function(times) {
    if (times && pos && pos > 0 && pos <= times.length) {
      times.sort();
      times.splice(pos-1, 1);
      var setPromise = store.set(LIST_KEY, times);
      setPromise.then(function(val) {
        listTimes(store, send);
      });
    } else {
      send("Could not remove a time from the list");
    }
  });
}

function clearTimes(store, send) {
  store.set(LIST_KEY, []);
  send("List Cleared", { color: 'red' });
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


function getTimeString(store, send) {
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
          send(s, {color: 'green'}); 
          return true;
        }
        return false;
      });
      if (!hasTimes) send("No more matches today (sadpanda)", {color: 'yellow'});
    } else {
      send("You should probably add a time first!");
    }
  });
}
