# typesmith-read-markdown

This plugin for [typesmith.js](http://www.github.com/bbor/typesmith) reads Markdown files from a folder that you specify. For each file it reads, it creates a new record of type `page` in the typesmith database.

## Options

`path`

>	The Markdown path to read. May be a single string, or an array of strings. Each string should be a folder that contains Markdown files. All files with the `*.md` extension will be picked up.

## Usage

As any other `typesmith` plugin, require it in your module and pass it to `typesmith.use()`:

```js
var typesmith = require('typesmith');
var readMarkdown = require('typesmith-read-markdown');
... // require other plugins

var config = {
	... // config options and type info goes here
}

typesmith(config)
  .use(readJson())
  .use(readMarkdown())
  .use(autoparent())
  .use(subgroup())
  .use(writeJson())
  .use(writeHtml())
  .run( function(errmsg) { if (errmsg) { console.log("Error: " + errmsg); } console.log('finished!'); } );

```
