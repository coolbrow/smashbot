var commands = require('./commands').commands;

exports.pattern = /^\/\w+((?:\ \w+)*)/;

var validColors = ['yellow', 'green', 'red', 'purple', 'gray', 'random'];

var helpRegexp = /^\/(smashbot|help)\ *$/;

exports.onCommand = function *() {
  var content = this.content;
  var store = this.tenantStore;
  if (helpRegexp.exec(content)) {
    var helpTxt = "<pre><table>";
    commands.forEach(function(cmd) {
      if (cmd.help && cmd.help instanceof Array) {
        cmd.help.forEach(function(help) {
          helpTxt += "<tr><td>" + help.command + "&nbsp;&nbsp;&nbsp;&nbsp;</td><td>" + help.desc + "</td></tr>";
        });
      }
    });
    helpTxt += "</table></pre>";
    yield this.roomClient.sendNotification(helpTxt, {color: 'gray'})
  } else {
    var command;
    commands.some(function(cmd) {
      var result = cmd.pattern.exec(content);
      if (result) {
        command = cmd;
      }
      return !!result;
    });
    if (command) {
      var args;
      if (this.match[1]) {
        args = this.match[1].trim().split(' ');
      }
      var sendMessage = function(text, options) {
        options = options || {};
        this.roomClient.sendNotification(text,
          {
            color: validColors.indexOf(options.color) > -1 ? options.color : 'yellow',
            notify: options.notify || false,
            message_format: options.message_format || 'html'
          });
      }.bind(this);
      command.run(sendMessage, args, store);
    }
  }
};
