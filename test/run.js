var filetrek = require('../index.js'),
    fs = require('fs');

var p = filetrek('./', function(name, stats, root){
    console.log('name = ',name);
    console.log('stats.isFile() = ', stats.isFile());
});

p.then(function(all){
    console.log(all);
}, function(e){ console.log(e); });
