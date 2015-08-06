var commands = require('./commands').commands;

exports.pattern = /^\/\w+((?:\ \w+)*)/;

var validColors = ['yellow', 'green', 'red', 'purple', 'gray', 'random'];

exports.onCommand = function *() {
  var content = this.content;
  var command;
  commands.some(function(cmd) {
    var result = cmd.pattern.exec(content);
    if (result) {
      command = cmd;
    }
    return !!result;
  });
  if (command) {
    yield this.roomClient.sendNotification(command.getResponse(this.match),
        {
          color: validColors.indexOf(command.color) > -1 ? command.color : 'yellow',
          notify: command.notify || false
        });
  }
};
