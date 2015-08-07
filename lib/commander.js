var commands = require('./commands').commands;

exports.pattern = /^\/\w+((?:\ \w+)*)/;

var validColors = ['yellow', 'green', 'red', 'purple', 'gray', 'random'];

exports.onCommand = function *() {
  var content = this.content;
  var store = this.tenantStore;
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
    command.getResponse(args, store, function(text, options) {
      options = options || {};
      this.roomClient.sendNotification(text,
        {
          color: validColors.indexOf(options.color) > -1 ? options.color : 'yellow',
          notify: options.notify || false,
          message_format: options.message_format || 'html'
        });
    }.bind(this));
  }
};
