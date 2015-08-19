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

About
-----

Walk directory contents.

filetrek returns a promise. After all files are walked the promise resolves.
