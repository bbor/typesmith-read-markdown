
var fs = require('fs');
var path = require('path');
var glob = require('glob');
var merge_options = require('merge-options');

module.exports = plugin;

function plugin(opts) {

  var plugin_defaults = {};

  return function(typesmith, done){
    var config = merge_options.call({concatArrays: true}, {}, plugin_defaults, typesmith.config['typesmith-read-markdown'], opts)

    var globjobs = 0;

    var handle_matches = function(this_path, err, matches) {
      globjobs--;
      matches.forEach( function(match) {
        var file_content = fs.readFileSync(match, 'utf8');
        var record = {};
        var title_result = /^\s*#\s*(.+)$/m.exec(file_content);
        record.content_title = title_result ? title_result[1] : null;
        record.content = title_result ? file_content.replace(title_result[0], '') : file_content;
        record.name = path.relative(this_path, match).replace('.md','').replace(/\\/g,'.');
        record.type = 'page';
        record.uid = path.basename(match, '.md');
        typesmith.db.add(record);
      });
      if (globjobs == 0) done();
    }

    if (config.path)
    {
      if (typeof(config.path) == "string")
      {
        config.path = [config.path];
      }
      config.path.forEach( function(this_path) {
        var this_glob = this_path.replace('\\', '/') + '/**/*.md';
        globjobs++;
        var mg = new glob.Glob(this_glob, {}, handle_matches.bind(this, this_path))
      });
    }
    else {
      done();
    }
  };

}