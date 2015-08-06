var commands = [];

require('fs').readdirSync(__dirname + '/').forEach(function(file) {
  if (file.match(/\.js$/) && file !== 'index.js') {
    var name = file.replace('.js', '');
    commands.push(require('./' + file));
  }
});

exports.commands = commands;
