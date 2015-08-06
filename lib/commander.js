var commands = require('./commands').commands;

exports.pattern = /^\/\w+((?:\ \w+)*)/;

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
    yield this.roomClient.sendNotification(command.getResponse(this.match));
  }
};
