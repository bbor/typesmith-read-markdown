
var fs = require('fs');
var path = require('path');
var glob = require('glob');

module.exports = plugin;

/*
  options:
  - path:    the Markdown path to read. May be a single string, or an array of strings.
              Each string should be a folder that contains Markdown files. All .md files will
              be taken, and will end up in the same relative locations after the build.
*/

function plugin(opts) {

  return function(typesmith, done){
    opts = opts || typesmith.config['typesmith-read-markdown'] || {}

    var globjobs = 0;

    var handle_matches = function(this_path, err, matches) {
      globjobs--;
      matches.forEach( function(match) {
        var file_content = fs.readFileSync(match, 'utf8');
        var record = {};
        record.content = file_content;
        record.name = path.basename(match, '.md');
        record.type = 'page';
        record.uid = record.name;
        typesmith.add_to_db(record);
      });
      if (globjobs == 0) done();
    }

    if (opts.path)
    {
      if (typeof(opts.path) == "string")
      {
        opts.path = [opts.path];
      }
      opts.path.forEach( function(this_path) {
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