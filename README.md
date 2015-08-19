fsforlstats
===========

install
-------

npm install fsforlstats

Usage
-----

```javascript
var forlstats = require("fsforlstats");

var prom = forlstats(['fileone', 'filetwo'], function(stats, index, filenames){
    //do something
});

prom.then(function(statsArray){
    console.log(statsArray.name); //The file name
    console.log(statsArray.stats); //The files stats
});
```

About
-----

fsforlstats gets the stats for an array of file names in parallel.

A promise is returned from fsforlstats.

When all the stats are acquired the promise resolves.
