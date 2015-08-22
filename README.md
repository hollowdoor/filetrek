filetrek
========

install
-------

npm install filetrek

Usage
-----

```javascript
var filetrek = require("filetrek");

var p = filetrek('./', function(name, stats, root){
    //do stuff
});

p.then(function(info){
    //info is an Array
    //info = [{name: "filename", stats: object, root: "root directory"}]
});
```

With options
------------

```javascript
var filetrek = require("filetrek"),
    options = {
        ignore: ["*script.js", /\mark.xml$/, "filename.html"],
        find: ["*.js", /\.xml$/, "filename.html"]
    };

var p = filetrek('./', options, function(name, stats, root){
    //do stuff
});

p.then(function(info){
    //info is an Array
    //info = [{name: "filename", stats: object, root: "root directory"}]
});
```

Find and Ignore
---------------

**options.find** is used before **options.ignore**.

The find, and ignore options should be arrays of **glob strings**, **instances of RegExp**, or **plain strings**.

The glob string patterns are the same used in the **minimatch** module.

Plain strings will match up to the end of file names.

options.find
------------

Returns all matched files.

options.ignore
--------------

Excludes matched files in the return.

Recursion Recipe
----------------

```javascript
var files = [],
    filetrek = require("filetrek");

function walkFiles(folder){

    return filetrek(folder, function(name, stats, root){

        if(stats.isDirectory()){
            //The directory path is used to continue walking files.
            return path.join(root, name);
        }
        //Work with the files.
    });
}

walkFiles('./').then(function(info){
    console.log('done');
});
```

Note on the callback
--------------------

You can also return a promise in the callback like this:

```javascript
function walkFiles(folder){

    return filetrek(folder, function(name, stats, root){
        return promiseFactory();
    });
}

walkFiles('./').then(function(resultsOfAllPromiseFactoryPromises){});
```

The promises returned like this are passed to **Promise.all**.

If there are other operations on the **file name** you want to do, and that operation returns a promise returning a promise in the callback might be what you want to do.

All values that aren't strings, or promises returned in the callback are **no-ops**.

Strings returned in the callback that aren't a directory will cause an error.

About
-----

Walk directory contents.

filetrek returns a promise. After all files are walked the promise resolves.
