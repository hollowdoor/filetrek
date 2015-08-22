var filetrek = require('../index.js'),
    fs = require('fs'),
    path = require('path');

var p = filetrek('./', function(name, stats, root){

    if(stats.isDirectory()){
        console.log('directory name = '+name);
        return path.join(root, name);
    }
    console.log('file name = ',name);
    //console.log('stats.isFile() = ', stats.isFile());
});

p.then(function(all){
    console.log('done');
    regularWalk();
}, function(e){ console.log(e); });

function regularWalk(){
    var p = filetrek('./', function(name, stats, root){
        console.log('file name = ',name);
        //console.log('stats.isFile() = ', stats.isFile());
    });

    p.then(function(all){
        console.log('done');
    }, function(e){ console.log(e); });
}
